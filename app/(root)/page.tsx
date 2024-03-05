import { fetchThreads } from "@/lib/actions/thread.action";

export default async function Home() {
  const threadsData = await fetchThreads();

  console.log("threadsData :>> ", threadsData);

  return (
    <div>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-10 flex flex-col gap-10">
        <p className="no-result">No threads found</p>
      </section>
    </div>
  );
}
