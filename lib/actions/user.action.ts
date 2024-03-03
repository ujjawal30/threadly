"use server";

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
  { username, name, bio, image }: UserData,
  path: string
) => {
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
