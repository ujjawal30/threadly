import UserCard from "@/components/cards/UserCard";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/tabs/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communityTabs } from "@/constants";
import { fetchCommunityDetails } from "@/lib/actions/community.action";
import { currentUser } from "@clerk/nextjs";
import React from "react";

interface Props {
  params: { id: string };
}

async function Page({ params }: Props) {
  const user = await currentUser();
  if (!user) return null;

  const communityDetails = await fetchCommunityDetails(params.id);

  return (
    <section>
      <ProfileHeader
        currentUserId={user?.id}
        userId={communityDetails?.id}
        name={communityDetails?.name}
        username={communityDetails?.username}
        imageURL={communityDetails?.image}
        bio={communityDetails?.bio}
        type="Community"
      />

      <div className="mt-10">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <tab.icon size={24} />
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.value === "threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {communityDetails?.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="threads" className="w-full text-light-1">
            <ThreadsTab
              currentUserId={user?.id}
              accountId={communityDetails?._id}
              accountType="Community"
            />
          </TabsContent>
          <TabsContent value="members" className="w-full text-light-1">
            <section className="mt-10 flex flex-col gap-10">
              {communityDetails?.members.map((member: any) => (
                <UserCard
                  key={member._id}
                  currentUserId={user.id}
                  id={member.id}
                  name={member.name}
                  username={member.username}
                  image={member.image}
                  type="User"
                />
              ))}
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
