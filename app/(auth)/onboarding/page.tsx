import MyAccount from "@/components/forms/MyAccount";
import { currentUser } from "@clerk/nextjs";
import React from "react";

async function Page() {
  const user = await currentUser();
  console.log("user :>> ", user);

  const userInfo = {
    _id: "",
    username: "",
    name: "",
    bio: "",
    image: "",
  };

  const userData = {
    id: user?.id || "",
    objectId: userInfo?._id || "",
    username: userInfo?.username || user?.username || "",
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user?.imageUrl || "",
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-4 text-base-regular text-light-2">
        Complete your profile now to continue
      </p>

      <section className="mt-10 bg-dark-2 p-10 rounded-lg">
        <MyAccount user={userData} />
      </section>
    </main>
  );
}

export default Page;
