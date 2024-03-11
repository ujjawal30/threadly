import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  params: { id: string };
}

async function Page({ params }: Props) {
  const user = await currentUser();

  if (!params.id || !user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);

  return (
    <section className="relative">
      <ThreadCard
        key={thread?._id}
        id={thread?._id}
        currentUser={user?.id}
        content={thread?.content}
        author={thread?.author}
        createdAt={thread?.createdAt}
        community={thread?.community}
        parentThread={thread?.parentThread}
        comments={thread?.comments}
      />

      <div className="mt-7">
        <Comment
          threadId={thread?._id}
          userId={JSON.parse(JSON.stringify(userInfo?._id))}
          userImg={userInfo?.image}
        />
      </div>

      <div className="flex flex-col mt-10">
        {thread.comments.map((comment: any) => (
          <ThreadCard
            key={comment?._id}
            id={comment?._id}
            currentUser={user?.id}
            content={comment?.content}
            author={comment?.author}
            createdAt={comment?.createdAt}
            parentThread={comment?.parentThread}
            comments={comment?.comments}
            isComment={true}
          />
        ))}
      </div>
    </section>
  );
}

export default Page;
