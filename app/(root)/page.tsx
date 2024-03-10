import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.action";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  const { threads, threadsCount } = await fetchThreads();

  if (!user) return null;

  return (
    <div>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-10 flex flex-col gap-10">
        {threads.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          threads?.map((thread: any) => (
            <ThreadCard
              key={thread?._id}
              id={thread?._id}
              currentUser={user?.id}
              content={thread?.content}
              author={thread?.author}
              createdAt={thread?.createdAt}
              parentThread={thread?.parentThread}
              community={thread?.community}
              comments={thread?.comments}
            />
          ))
        )}
      </section>
    </div>
  );
}
