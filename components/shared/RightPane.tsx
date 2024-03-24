import React from "react";
import UserCard from "../cards/UserCard";
import { fetchCommunities } from "@/lib/actions/community.action";
import { currentUser } from "@clerk/nextjs";
import { searchUsers } from "@/lib/actions/user.action";

async function RightPane() {
  const user = await currentUser();
  if (!user) return null;

  const suggestedCommunities = await fetchCommunities({ pageSize: 4 });
  const suggestedUsers = await searchUsers({ userId: user.id, pageSize: 4 });

  return (
    <section className="custom-scrollbar rightpane">
      <div className="flex flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Communities
        </h3>

        <div className="mt-7 flex w-[350px] flex-col gap-9">
          {suggestedCommunities.communities.length > 0 ? (
            suggestedCommunities.communities.map((community: any) => (
              <UserCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                image={community.image}
                type="Community"
              />
            ))
          ) : (
            <p className="!text-base-regular text-light-3">
              No communities yet
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>

        <div className="mt-7 flex w-[350px] flex-col gap-9">
          {suggestedUsers.users.length > 0 ? (
            suggestedUsers.users.map((user: any) => (
              <UserCard
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                image={user.image}
                type="User"
              />
            ))
          ) : (
            <p className="!text-base-regular text-light-3">No users yet</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default RightPane;
