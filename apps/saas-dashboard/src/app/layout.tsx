import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClawSecretary - Edge Dashboard",
  description: "Mobile-Edge OAuth Bridge. Your data stays local.",
  manifest: "/manifest.json",
  themeColor: "#a855f7",
};

import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
