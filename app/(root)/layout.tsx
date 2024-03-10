import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Topbar from "../../components/shared/Topbar";
import Bottombar from "../../components/shared/Bottombar";
import LeftPane from "../../components/shared/LeftPane";
import RightPane from "../../components/shared/RightPane";
import "../globals.css";
import { dark } from "@clerk/themes";

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
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body className={inter.className}>
          <Topbar />

          <main className="flex flex-row">
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
