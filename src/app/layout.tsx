import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReuniteRC",
  description:
    "Offline-resilient digital operating layer for authorised Redemption City family reunification support."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
