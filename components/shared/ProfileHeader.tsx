"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { followUnfollowUser } from "@/lib/actions/user.action";

interface Props {
  currentUserId: string;
  userId: string;
  name: string;
  username: string;
  imageURL: string;
  bio: string;
  type?: "User" | "Community";
  followerCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}

function ProfileHeader({
  currentUserId,
  userId,
  name,
  username,
  imageURL,
  bio,
  type = "User",
  followerCount,
  followingCount,
  isFollowing,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [followStatus, setFollowStatus] = useState<boolean>(
    isFollowing || false
  );

  const handleFollow = async () => {
    setFollowStatus((status) => !status);
    await followUnfollowUser(followStatus, currentUserId, userId, pathname);
  };

  return (
    <div className="flex flex-col w-full justify-start">
      <div className="flex w-full items-center gap-4">
        <div className="relative h-20 w-20 object-cover">
          <Image
            src={imageURL}
            alt="Profile Photo"
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-left text-heading3-bold text-light-1">{name}</h2>
          <p className="text-base-medium text-gray-1">@{username}</p>
        </div>

        {type === "User" && (
          <div className="flex gap-6 max-sm:hidden">
            <div className="text-center">
              <h2 className="text-light-1">{followerCount}</h2>
              <p className="text-gray-1">Followers</p>
            </div>
            <div className="text-center">
              <h2 className="text-light-1">{followingCount}</h2>
              <p className="text-gray-1">Following</p>
            </div>
          </div>
        )}
      </div>

      {type === "User" && (
        <div className="mt-6 w-full justify-evenly flex sm:hidden">
          <div className="text-center">
            <h2 className="text-light-1">0</h2>
            <p className="text-gray-1">Following</p>
          </div>
          <div className="text-center">
            <h2 className="text-light-1">0</h2>
            <p className="text-gray-1">Followers</p>
          </div>
        </div>
      )}

      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>

      {type === "User" && (
        <>
          {currentUserId === userId ? (
            <Button
              className="mt-5 bg-dark-4"
              onClick={() => router.push("/profile/edit")}
            >
              Edit
            </Button>
          ) : (
            <Button
              className={`mt-5 bg-primary-500 ${followStatus && "bg-dark-4"}`}
              onClick={handleFollow}
            >
              {followStatus ? "Following" : "Follow"}
            </Button>
          )}
        </>
      )}

      <div className="mt-5 h-0.5 w-full bg-dark-3" />
    </div>
  );
}

export default ProfileHeader;
