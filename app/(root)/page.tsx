import ThreadCard from "@/components/cards/ThreadCard";
import Pagination from "@/components/shared/Pagination";
import { fetchThreads } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";

interface Props {
  searchParams: {
    [key: string]: string | undefined;
  };
}

export default async function Home({ searchParams }: Props) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user?.id);

  const pageNumber = searchParams.page ? +searchParams.page : 1;

  const { threads, isNext, suggestedThreads } = await fetchThreads(
    pageNumber,
    20,
    userInfo?.following
  );

  return (
    <div>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-10 flex flex-col gap-10">
        {threads.length > 0 &&
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
              likesCount={thread?.likes.length}
              isLiked={thread?.likes.includes(user?.id)}
              isSaved={userInfo?.saved.includes(thread._id) || false}
            />
          ))}
      </section>

      {suggestedThreads && suggestedThreads.length > 0 && (
        <div className="mt-10 flex flex-col justify-start">
          <h3 className="text-heading4-medium text-light-1">
            Suggested Threads
          </h3>

          <div className="mt-8 flex flex-col gap-10">
            {suggestedThreads.map((thread: any) => (
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
                likesCount={thread?.likes.length}
                isLiked={thread?.likes.includes(user?.id)}
                isSaved={userInfo?.saved.includes(thread._id) || false}
              />
            ))}
          </div>
        </div>
      )}

      <Pagination path="/" pageNumber={pageNumber} isNext={isNext} />
    </div>
  );
}
