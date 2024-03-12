"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToMongoDB } from "../mongodb";
import Community from "../models/community.model";

interface ThreadData {
  content: string;
  author: string;
  communityId: string | null;
}

export const createThread = async (data: ThreadData, path: string) => {
  const { content, author, communityId } = data;

  try {
    await connectToMongoDB();

    const community = await Community.findOne({ id: communityId }, { _id: 1 });

    const newThread = await Thread.create({
      content,
      author,
      community: community || null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: newThread._id },
    });

    if (community) {
      await Community.findByIdAndUpdate(community, {
        $push: { threads: newThread._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error("Unable to post new thread:", error.message);
  }
};

export const fetchThreads = async (pageNumber = 1, pageSize = 20) => {
  try {
    await connectToMongoDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const threads = await Thread.find({
      parentThread: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({ path: "community", model: Community })
      .populate({
        path: "comments",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentThread image",
        },
      });

    const threadsCount = await Thread.countDocuments({
      parentThread: { $in: [null, undefined] },
    });

    const isNext = threadsCount > skipAmount + threads.length;

    return { threads: JSON.parse(JSON.stringify(threads)), isNext };
  } catch (error: any) {
    throw new Error("Unable to fetch threads: ", error.message);
  }
};

export const fetchThreadById = async (id: string) => {
  try {
    await connectToMongoDB();

    const thread = await Thread.findById(id)
      .populate({ path: "author", model: User, select: "_id id name image" })
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      })
      .populate({
        path: "comments",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name image parentThread",
          },
          {
            path: "comments",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name image parentThread",
            },
          },
        ],
      });

    return JSON.parse(JSON.stringify(thread));
  } catch (error: any) {
    throw new Error("Unable to fetch thread: ", error.message);
  }
};

export const postComment = async (
  threadId: string,
  comment: string,
  userId: string,
  path: string
) => {
  try {
    await connectToMongoDB();

    const commentThread = await Thread.create({
      content: comment,
      author: userId,
      parentThread: threadId,
    });

    // await User.findByIdAndUpdate(userId, {
    //   $push: { threads: commentThread._id },
    // });

    await Thread.findByIdAndUpdate(threadId, {
      $push: { comments: commentThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    console.log("error.message :>> ", error.message);
    throw new Error("Unable to post comment: ", error.message);
  }
};
