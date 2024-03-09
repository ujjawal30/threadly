"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants";
import React from "react";
import { useAuth } from "@clerk/nextjs";

function Bottombar() {
  const pathname = usePathname();
  const { userId } = useAuth();

  const isActive = (route: string) =>
    (pathname.includes(route) && route.length > 1) || pathname === route;

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => (
          <Link
            href={
              link.route === "/profile" ? `${link.route}/${userId}` : link.route
            }
            key={link.label}
            className={`bottombar_link ${
              isActive(link.route) && "bg-primary-500"
            }`}
          >
            <link.icon className="text-light-1" size={24} />
            <p className="text-subtle-medium text-light-1 max-sm:hidden">
              {link.label.split(/\s+/)[0]}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Bottombar;
