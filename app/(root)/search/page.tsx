import UserCard from "@/components/cards/UserCard";
import { fetchUser, searchUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const { users, isNext } = await searchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 20,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <div className="mt-14 flex flex-col gap-10">
        {users.length === 0 ? (
          <p className="no-result">No users</p>
        ) : (
          users.map((user: any) => (
            <UserCard
              key={user.id}
              id={user.id}
              name={user.name}
              username={user.username}
              image={user.image}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default Page;
