"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToMongoDB } from "../mongodb";

interface ThreadData {
  content: string;
  author: string;
  communityId: string | null;
}

export const createThread = async (data: ThreadData, path: string) => {
  const { content, author, communityId } = data;
  try {
    await connectToMongoDB();

    const newThread = await Thread.create({
      content,
      author,
      communityId,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: newThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error("Unable to post new thread:", error.message);
  }
};

export const fetchThreads = async () => {
  try {
    await connectToMongoDB();

    const threads = await Thread.find({
      parentThread: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
      .skip(0)
      .limit(20)
      .populate({ path: "author", model: User })
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

    return { threads, threadsCount };
  } catch (error: any) {
    throw new Error("Unable to fetch threads: ", error.message);
  }
};
