import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "EnglishAI - Smart English Learning Platform",
  description: "Smart English Learning Platform with AI-powered Listening and Reading practice. Boost your English proficiency with EnglishAI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={spaceGrotesk.className}>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
