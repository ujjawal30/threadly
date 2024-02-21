"use client";

import { sidebarLinks } from "@/constants";
import { SignOutButton, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { TbLogout } from "react-icons/tb";

function LeftPane() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) =>
    (pathname.includes(route) && route.length > 1) || pathname === route;

  return (
    <section className="custom-scrollbar leftpane">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => (
          <Link
            href={link.route}
            key={link.label}
            className={`leftpane_link ${
              isActive(link.route) && "bg-primary-500"
            }`}
          >
            <link.icon className="text-light-1" size={24} />
            <p className="text-light-1 max-lg:hidden">{link.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push("/sign-in")}>
            <div className="flex cursor-pointer gap-4 p-4">
              <TbLogout className="text-light-1" size={24} />
              <p className="text-light-1 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
}

export default LeftPane;
