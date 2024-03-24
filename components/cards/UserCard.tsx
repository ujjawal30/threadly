"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { boolean } from "zod";
import { followUnfollowUser } from "@/lib/actions/user.action";
import Link from "next/link";

interface Props {
  currentUserId: string;
  id: string;
  name: string;
  username: string;
  image: string;
  type?: "User" | "Community";
  isFollowing?: boolean;
}

function UserCard({
  currentUserId,
  id,
  name,
  username,
  image,
  type = "User",
  isFollowing,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [followStatus, setFollowStatus] = useState<boolean>(
    isFollowing || false
  );

  const handleFollow = async () => {
    setFollowStatus((status) => !status);
    await followUnfollowUser(followStatus, currentUserId, id, pathname);
  };

  return (
    <article className="user-card">
      <Link
        href={type === "Community" ? `/communities/${id}` : `/profile/${id}`}
        className="user-card_avatar"
      >
        <div className="relative h-12 w-12">
          <Image
            src={image}
            alt={name}
            fill
            className="cursor-pointer object-cover rounded-full"
          />
        </div>

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </Link>

      {type === "User" && (
        <Button
          className={`user-card_btn ${followStatus && "!bg-dark-4"}`}
          onClick={handleFollow}
        >
          {followStatus ? "Following" : "Follow"}
        </Button>
      )}
    </article>
  );
}

export default UserCard;
