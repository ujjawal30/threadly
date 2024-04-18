import { Inter, Montserrat } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Threadly",
  description: "A clone of Threads application by Meta",
};

const montserrat = Montserrat({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{ baseTheme: dark, variables: { colorPrimary: "#5965c7" } }}
    >
      <html lang="en">
        <body className={`${montserrat.className} bg-dark-1`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
