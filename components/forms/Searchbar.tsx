"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "../ui/input";
import { TbSearch } from "react-icons/tb";

interface Props {
  routeType: string;
}

function Searchbar({ routeType }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        router.push(`/${routeType}?q=` + search);
      } else {
        router.push(`/${routeType}`);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, routeType]);

  return (
    <div className="searchbar items-center">
      <TbSearch size={24} className="text-gray-1" />
      <Input
        id="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`${
          routeType !== "search" ? "Search communities" : "Search users"
        }`}
        className="no-focus searchbar_input"
      />
    </div>
  );
}

export default Searchbar;
