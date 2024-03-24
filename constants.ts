import {
  TbHome,
  TbSearch,
  TbUser,
  TbUsersGroup,
  TbHeart,
  TbMessageCircle,
  TbBrandThreads,
  TbEdit,
} from "react-icons/tb";

export const sidebarLinks = [
  {
    icon: TbHome,
    route: "/",
    label: "Home",
  },
  {
    icon: TbSearch,
    route: "/search",
    label: "Search",
  },
  {
    icon: TbHeart,
    route: "/activity",
    label: "Activity",
  },
  {
    icon: TbEdit,
    route: "/new-thread",
    label: "New Thread",
  },
  {
    icon: TbUsersGroup,
    route: "/communities",
    label: "Communities",
  },
  {
    icon: TbUser,
    route: "/profile",
    label: "Profile",
  },
];

export const profileTabs = [
  { value: "threads", label: "Threads", icon: TbBrandThreads },
  { value: "replies", label: "Replies", icon: TbMessageCircle },
];

export const communityTabs = [
  { value: "threads", label: "Threads", icon: TbBrandThreads },
  { value: "members", label: "Members", icon: TbUsersGroup },
];
