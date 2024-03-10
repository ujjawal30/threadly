import NewThread from "@/components/forms/NewThread";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <div>
      <h1 className="head-text">Create New Thread</h1>
      <NewThread userId={userInfo?._id?.toString()} />
    </div>
  );
}

export default Page;
