"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToMongoDB } from "../mongodb";
import { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/community.model";
import { isBase64Image } from "../utils";
import { uploadImagetoS3 } from "../s3client";

interface UserData {
  username: string;
  name: string;
  bio: string;
  image: { name: string; url: string; type: string };
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

    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });
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
  let imageUrl = image.url;

  const isImageChanged = isBase64Image(imageUrl);

  if (isImageChanged) {
    const imageData = image.url.split(",")[1]; // Remove the data URL prefix
    const imageBuffer = Buffer.from(imageData, "base64");
    imageUrl = await uploadImagetoS3(imageBuffer, image.name, image.type);
  }

  try {
    await connectToMongoDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        name,
        username: username.toLowerCase(),
        bio,
        image: imageUrl,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
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
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        },
        {
          path: "comments",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "id name image",
          },
        },
      ],
    });

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

export const fetchActivity = async (userId: string) => {
  try {
    await connectToMongoDB();

    const threads = await Thread.find({ author: userId });
    const commentIds = threads.reduce((acc, curr) => {
      return acc.concat(curr.comments);
    }, []);

    const comments = await Thread.find({
      _id: { $in: commentIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "id name image",
    });

    return JSON.parse(JSON.stringify(comments));
  } catch (error: any) {
    console.log("error.message :>> ", error.message);
    throw new Error("Unable to fetch user activity:", error.message);
  }
};
