import UserCard from "@/components/cards/UserCard";
import Pagination from "@/components/shared/Pagination";
import Searchbar from "@/components/forms/Searchbar";
import { fetchUser, fetchUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  searchParams: {
    [key: string]: string | undefined;
  };
}

async function Page({ searchParams }: Props) {
  const currentLoggedUser = await currentUser();
  if (!currentLoggedUser) return null;

  const userInfo = await fetchUser(currentLoggedUser.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const { users, isNext } = await fetchUsers({
    userId: currentLoggedUser.id,
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 20,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <Searchbar routeType="search" />

      <div className="mt-14 flex flex-col gap-10">
        {users.length === 0 ? (
          <p className="no-result">No users</p>
        ) : (
          users.map((user: any) => (
            <UserCard
              key={user.id}
              currentUserId={currentLoggedUser.id}
              id={user.id}
              name={user.name}
              username={user.username}
              image={user.image}
              isFollowing={
                user.followers.includes(currentLoggedUser.id) &&
                userInfo.following.includes(user.id)
              }
            />
          ))
        )}
      </div>

      <Pagination
        isNext={isNext}
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        path="search"
      />
    </section>
  );
}

export default Page;
