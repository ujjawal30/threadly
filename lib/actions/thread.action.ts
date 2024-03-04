"use server";

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
  } catch (error: any) {
    throw new Error("Unable to post new thread:", error.message);
  }
};
