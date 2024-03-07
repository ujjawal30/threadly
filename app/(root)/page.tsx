import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.action";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  const { threads, threadsCount } = await fetchThreads();

  if (!user) return null;
  console.log("threads :>> ", threads);
  console.log("threads :>> ", JSON.parse(JSON.stringify(threads)));

  return (
    <div>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-10 flex flex-col gap-10">
        {threads.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          threads?.map((thread) => (
            <ThreadCard
              key={thread?._id}
              id={thread.id}
              currentUser={user?.id}
              content={thread?.content}
              author={{
                id: thread?.author?.id,
                name: thread?.author?.name,
                image: thread?.author?.image,
              }}
              createdAt={thread?.createdAt}
              parentThread={thread?.parentThread}
              comments={thread?.comments}
            />
          ))
        )}
      </section>
    </div>
  );
}
