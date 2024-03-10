"use client";

import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { TbHeart, TbMessageCircle, TbSend, TbShare3 } from "react-icons/tb";

interface Props {
  id: string;
  currentUser: string;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  createdAt: Date;
  parentThread: string | null;
  community?: {
    id: string;
    name: string;
    image: string;
  } | null;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

function ThreadCard({
  id,
  currentUser,
  content,
  author,
  createdAt,
  parentThread,
  community,
  comments,
  isComment,
}: Props) {
  return (
    <article
      className={`flex flex-col w-full rounded-xl ${
        isComment ? "px-0 xs:px-8" : "bg-dark-2 p-8"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 gap-5">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-10 w-10">
              <Image
                src={author.image}
                alt="Profile Photo"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>

            <div className="thread-card_bar"></div>
          </div>

          <div className="flex flex-col w-full">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-light-1 text-small-semibold">
                {author.name}
              </h4>
            </Link>

            <Link href={`/thread/${id}`}>
              <p className="mt-2 text-light-2 text-small-regular">{content}</p>
            </Link>

            <div className="mt-5 flex flex-col gap-3">
              <div className="flex gap-3 text-gray-600">
                <TbHeart
                  size={20}
                  className="cursor-pointer hover:text-light-3"
                />
                <TbMessageCircle
                  size={20}
                  className="cursor-pointer hover:text-light-3"
                />
                <TbShare3
                  size={20}
                  className="cursor-pointer hover:text-light-3"
                />
                <TbSend
                  size={20}
                  className="cursor-pointer hover:text-light-3"
                />
              </div>

              {comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length} replies
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {!isComment && (
        <div className="mt-5 flex items-center">
          <p className="text-subtle-medium text-gray-1">
            {formatDate(createdAt)}
            {community && ` - ${community.name} Community`}
          </p>
          {community && (
            <Link href={`/communities/${community.id}`}>
              <Image
                src={community.image}
                alt={community.name}
                width={16}
                height={16}
                className="ml-1 rounded-full object-cover"
              />
            </Link>
          )}
        </div>
      )}
    </article>
  );
}

export default ThreadCard;
