import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "../cards/ThreadCard";
import { fetchUserReplies } from "@/lib/actions/thread.action";

interface Props {
  currentUserId: string;
  userId: string;
}

async function RepliesTab({ currentUserId, userId }: Props) {
  const threads = await fetchUserReplies(userId);

  if (!threads) redirect("/");

  return (
    <section className="mt-10 flex flex-col gap-10">
      {threads.length === 0 ? (
        <p className="no-result">No replies/comments posted.</p>
      ) : (
        threads.map((thread: any) => (
          <div
            key={thread?._id}
            className="flex flex-col bg-dark-2 p-8 w-full rounded-xl"
          >
            <ThreadCard
              id={thread?._id}
              currentUser={currentUserId}
              content={thread?.content}
              author={thread?.author}
              createdAt={thread?.createdAt}
              community={thread?.community}
              parentThread={thread?.parentThread}
              comments={thread?.comments}
              likesCount={thread?.likes.length}
              isLiked={thread?.likes.includes(currentUserId)}
              isComment={true}
            />
            {thread.comments.map((comment: any) => (
              <ThreadCard
                key={comment?._id}
                id={comment?._id}
                currentUser={currentUserId}
                content={comment?.content}
                author={comment?.author}
                createdAt={comment?.createdAt}
                parentThread={comment?.parentThread}
                comments={comment?.comments}
                likesCount={comment?.likes.length}
                isLiked={comment?.likes.includes(currentUserId)}
                isComment={true}
              />
            ))}
          </div>
        ))
      )}
    </section>
  );
}

export default RepliesTab;
