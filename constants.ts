import { TbHome, TbSearch, TbUser, TbUsersGroup, TbPhotoPlus, TbHeart } from "react-icons/tb";

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
    icon: TbPhotoPlus,
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