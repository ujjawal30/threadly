import CommunityCard from "@/components/cards/CommunityCard";
import { fetchCommunities } from "@/lib/actions/community.action";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const { communities, isNext } = await fetchCommunities({
    searchString: "",
    pageNumber: 1,
    pageSize: 20,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Communities</h1>

      <div className="mt-14 flex flex-col gap-10">
        {communities.length === 0 ? (
          <p className="no-result">No communities</p>
        ) : (
          communities.map((community: any) => (
            <CommunityCard
              key={community.id}
              id={community.id}
              name={community.name}
              username={community.username}
              image={community.image}
              bio={community.bio}
              members={community.members}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default Page;
