"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToMongoDB } from "../mongodb";
import Community from "../models/community.model";
import { FilterQuery, UpdateQuery } from "mongoose";

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

export const fetchThreads = async (
  pageNumber = 1,
  pageSize = 20,
  following?: string[]
) => {
  try {
    await connectToMongoDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const authors = await User.find({ id: { $in: following } }, { _id: 1 });

    const filter: FilterQuery<typeof Thread> = {
      parentThread: { $in: [null, undefined] },
    };

    if (authors.length > 0) {
      filter.author = { $in: authors };
    }
    //************/ Aggregate query /************//
    // const followingUserThreads = await Thread.aggregate()
    //   .lookup({
    //     from: "users",
    //     localField: "author",
    //     foreignField: "_id",
    //     as: "author",
    //   })
    //   .match({ "author.id": { $in: following } })
    //   .unwind("author");

    // console.log("followingUserThreads :>> ", followingUserThreads);

    const threads = await Thread.find(filter)
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

    const threadsCount = await Thread.countDocuments(filter);

    let suggestedThreads: any;
    if (threadsCount < 5) {
      suggestedThreads = await Thread.find({
        parentThread: { $in: [null, undefined] },
        _id: { $nin: threads },
      })
        .sort({ createdAt: "desc" })
        .limit(10 - threadsCount)

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
    }

    const isNext = threadsCount > skipAmount + threads.length;

    return JSON.parse(JSON.stringify({ threads, isNext, suggestedThreads }));
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

const fetchAllComments = async (threadId: string): Promise<any[]> => {
  const commentThreads = await Thread.find({ parentThread: threadId });

  const comments = [];
  for (const commentThread of commentThreads) {
    const commentReplies = await fetchAllComments(commentThread._id);
    comments.push(commentThread, ...commentReplies);
  }

  return comments;
};

export const deleteThread = async (id: string, path: string) => {
  try {
    await connectToMongoDB();

    const mainThread = await Thread.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    const comments = await fetchAllComments(id);

    const commentIds = [id, ...comments.map((thread) => thread._id)];

    const uniqueAuthorIds = new Set(
      [
        ...comments.map((thread) => thread.author?._id?.toString()),
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...comments.map((thread) => thread.community?._id?.toString()),
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    await Thread.deleteMany({ _id: { $in: commentIds } });

    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: commentIds } } }
    );

    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: commentIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
};

export const likeUnlikeThread = async (
  isLiked: boolean,
  threadId: string,
  userId: string,
  path: string
) => {
  try {
    await connectToMongoDB();

    const data: UpdateQuery<typeof Thread> = isLiked
      ? {
          $pull: { likes: userId },
        }
      : {
          $push: { likes: userId },
        };

    await Thread.findByIdAndUpdate(threadId, data);

    revalidatePath(path);
  } catch (error: any) {
    throw new Error("Unable to unlike thread", error.message);
  }
};

export const fetchUserReplies = async (userId: string) => {
  try {
    const threadReplies = await Thread.find({}).populate([
      { path: "author", model: User, select: "id name image" },
      {
        path: "comments",
        match: { author: userId },
        populate: {
          path: "author",
          model: User,
          select: "id name image",
        },
      },
    ]);

    const sanitizedThreadReplies = threadReplies.filter(
      (reply) => reply.comments.length
    );

    return JSON.parse(JSON.stringify(sanitizedThreadReplies));
  } catch (error: any) {
    console.error("Unable to fetch user replies", error.message);
    throw error;
  }
};
