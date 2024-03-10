import { fetchActivity, fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activity = await fetchActivity(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          activity.map((act: any) => (
            <Link key={act._id} href={`/thread/${act.parentThread}`}>
              <article className="activity-card">
                <Image
                  src={act.author.image}
                  alt="Profile Photo"
                  width={24}
                  height={24}
                  className="rounded-full object-cover"
                />
                <p className="!text-small-regular text-light-1">
                  <span className="mr-1 text-purple-500">
                    {act.author.name}
                  </span>
                  replied to your thread
                </p>
              </article>
            </Link>
          ))
        ) : (
          <p>No activity yet</p>
        )}
      </section>
    </section>
  );
}

export default Page;
