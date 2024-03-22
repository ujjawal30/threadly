import ProfileHeader from "@/components/shared/ProfileHeader";
import RepliesTab from "@/components/tabs/RepliesTab";
import SavedTab from "@/components/tabs/SavedTab";
import ThreadsTab from "@/components/tabs/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import React from "react";
import { TbBookmark } from "react-icons/tb";

interface Props {
  params: { id: string };
}

async function Page({ params }: Props) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(params.id);

  return (
    <section>
      <ProfileHeader
        currentUserId={user?.id}
        userId={userInfo?.id}
        name={userInfo?.name}
        username={userInfo?.username}
        imageURL={userInfo?.image}
        bio={userInfo?.bio}
      />

      <div className="mt-10">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <tab.icon size={24} />
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.value === "threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
            {user.id === params.id && (
              <TabsTrigger value="saved" className="tab">
                <TbBookmark size={24} />
                <p className="max-sm:hidden">Saved</p>
                <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                  {userInfo?.savedThreads.length}
                </p>
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="threads" className="w-full text-light-1">
            <ThreadsTab
              currentUserId={user?.id}
              accountId={userInfo?.id}
              accountType="User"
            />
          </TabsContent>
          <TabsContent value="replies" className="w-full text-light-1">
            <RepliesTab
              currentUserId={user?.id}
              userId={JSON.parse(JSON.stringify(userInfo?._id))}
            />
          </TabsContent>
          {user.id === params.id && (
            <TabsContent value="saved" className="w-full text-light-1">
              <SavedTab currentUserId={user?.id} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
