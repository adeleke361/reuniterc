import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReuniteRC",
  description:
    "Digital Reunification and Lost-and-Found solution for Major Programmes in Redemption City."
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
