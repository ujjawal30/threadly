import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  params: { id: string };
}

async function Page({ params }: Props) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(params.id);
  console.log("userInfo :>> ", userInfo);

  return (
    <div>
      <ProfileHeader
        currentUserId={user?.id}
        userId={userInfo?.id}
        name={userInfo?.name}
        username={userInfo?.username}
        imageURL={userInfo?.image}
        bio={userInfo?.bio}
      />
    </div>
  );
}

export default Page;
