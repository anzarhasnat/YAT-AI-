import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "YAT AI Interview | Prepare Smarter, Get Hired",
  description: "Next-generation AI-powered interview preparation and candidate screening platform.",
  keywords: ["AI interview", "mock interview", "placement portal", "candidate screening", "resume parsing"],
  authors: [{ name: "YAT AI" }],
  openGraph: {
    title: "YAT AI Interview | Prepare Smarter, Get Hired",
    description: "Next-generation AI-powered interview preparation and candidate screening platform.",
    url: "http://localhost:3000",
    siteName: "YAT AI Interview",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YAT AI Interview | Prepare Smarter, Get Hired",
    description: "Next-generation AI-powered interview preparation and candidate screening platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${dmSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}