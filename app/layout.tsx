"use client";

import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { IconContext } from "react-icons";
import { Nav } from "@/components/Nav";

export const metadata = {
  title: "Huize Sarijopen",
  description: "Responsive homepage of Huize Sarijopen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="luxury">
      <meta name="viewport" content="width=device-width" />
      <meta name="description" content={metadata.description} />
      <meta name="theme-color" content="#6495ed" />
      <title>{metadata.title}</title>

      <link rel="manifest" href="/manifest.json" />
      <body>
        <SessionProvider>
          <IconContext.Provider
            value={{ color: "black", className: "global-class-name" }}
          >
            <Nav />
            <div className={"container mx-auto pt-16 px-10 "}>{children}</div>
          </IconContext.Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
