"use server";

import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToMongoDB } from "../mongodb";

interface UserData {
  username: string;
  name: string;
  bio: string;
  image: string;
}

export const fetchUser = async (userId: string) => {
  try {
    await connectToMongoDB();

    return await User.findOne({ id: userId });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
};

export const updateUser = async (
  userId: string,
  data: UserData,
  path: string
) => {
  const { username, name, bio, image } = data;

  try {
    await connectToMongoDB();

    await User.findOneAndUpdate(
      { id: userId },
      { name, username: username.toLowerCase(), image, bio, onboarded: true },
      { upsert: true }
    );
  } catch (error: any) {
    throw new Error("Unable to update or create user:", error.message);
  }
};

export const fetchUserThreads = async (userId: string) => {
  try {
    await connectToMongoDB();

    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "comments",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "id name image",
        },
      },
    });

    console.log("threads :>> ", threads);
    return JSON.parse(JSON.stringify(threads));
  } catch (error: any) {
    throw new Error("Unable to fetch user threads:", error.message);
  }
};
