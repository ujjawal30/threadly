import { fetchUser, fetchUserThreads } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/lib/actions/community.action";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType?: "User" | "Community";
}

async function ThreadsTab({ currentUserId, accountId, accountType }: Props) {
  const result =
    accountType === "Community"
      ? await fetchCommunityPosts(accountId)
      : await fetchUserThreads(accountId);

  if (!result) redirect("/");

  const userInfo = await fetchUser(currentUserId);

  return (
    <section className="mt-10 flex flex-col gap-10">
      {result.threads.map((thread: any) => (
        <ThreadCard
          key={thread?._id}
          id={thread?._id}
          currentUser={currentUserId}
          content={thread?.content}
          author={{ name: result.name, image: result.image, id: result.id }}
          createdAt={thread?.createdAt}
          community={thread?.community}
          parentThread={thread?.parentThread}
          comments={thread?.comments}
          likesCount={thread?.likes.length}
          isLiked={thread?.likes.includes(currentUserId)}
          isSaved={userInfo?.savedThreads?.includes(thread._id) || false}
        />
      ))}
    </section>
  );
}

export default ThreadsTab;
