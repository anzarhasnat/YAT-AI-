import type { Metadata } from "next";
import { Lora } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${lora.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}