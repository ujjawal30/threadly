import { fetchUserThreads } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "../cards/ThreadCard";

interface Props {
  currentUserId: string;
  userId: string;
  userType: string;
}

async function ThreadsTab({ currentUserId, userId, userType }: Props) {
  const result = await fetchUserThreads(userId);

  if (!result) redirect("/");

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
          parentThread={thread?.parentThread}
          comments={thread?.comments}
        />
      ))}
    </section>
  );
}

export default ThreadsTab;
