"use client";

import Image from "next/image";
import React from "react";

interface Props {
  currentUserId: string;
  userId: string;
  name: string;
  username: string;
  imageURL: string;
  bio: string;
}

function ProfileHeader({
  currentUserId,
  userId,
  name,
  username,
  imageURL,
  bio,
}: Props) {
  return (
    <div className="flex flex-col w-full justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imageURL}
              alt="Profile Photo"
              fill
              className="rounded-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>
      </div>
      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
}

export default ProfileHeader;
