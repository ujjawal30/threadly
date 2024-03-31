"use client";

import { OrganizationSwitcher, SignedIn, SignOutButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { TbLogout } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
});

function Topbar() {
  const router = useRouter();

  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logo-dark.png" alt="logo" width={48} height={48} />
        <p
          className={`text-heading2-bold text-light-1 max-xs:hidden ${montserrat.className}`}
        >
          Threadly
        </p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton signOutCallback={() => router.push("/sign-in")}>
              <div className="flex cursor-pointer">
                <TbLogout className="text-light-1" size={24} />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>

        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: { organizationSwitcherTrigger: "py-2 px-4" },
          }}
        />
      </div>
    </nav>
  );
}

export default Topbar;
