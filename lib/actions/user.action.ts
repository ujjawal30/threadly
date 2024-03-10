"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToMongoDB } from "../mongodb";
import { FilterQuery, SortOrder } from "mongoose";

interface UserData {
  username: string;
  name: string;
  bio: string;
  image: string;
}

interface SearchData {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
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

    revalidatePath(path);
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

export const searchUsers = async ({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: SearchData) => {
  try {
    await connectToMongoDB();

    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const usersCount = await User.countDocuments(query);

    const isNext = usersCount > skipAmount + users.length;

    return { users: JSON.parse(JSON.stringify(users)), isNext };
  } catch (error: any) {
    throw new Error("Unable to search users:", error.message);
  }
};
