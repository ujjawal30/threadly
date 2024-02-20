import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Topbar from "../../components/sections/Topbar";
import Bottombar from "../../components/sections/Bottombar";
import LeftPane from "../../components/sections/LeftPane";
import RightPane from "../../components/sections/RightPane";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Threads",
  description: "Threads Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Topbar />

          <main>
            <LeftPane />

            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>

            <RightPane />
          </main>

          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
