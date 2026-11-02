import type { Metadata, Viewport } from "next";
import { Noto_Sans_Telugu, Inter } from "next/font/google";
import "./globals.css";
import { TextSizeProvider } from "@/components/layout/TextSizeProvider";
import { Analytics } from "@vercel/analytics/next";

const notoSansTelugu = Noto_Sans_Telugu({
  variable: "--font-telugu",
  subsets: ["telugu"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#176B5B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "MISSION MPSO — TGPSC MPSO / ASO పరీక్షా సాధన",
  description:
    "TGPSC Mandal Planning & Statistical Officer (MPSO / ASO) 07/G/ES/2026 పరీక్ష కోసం తెలుగు-మొదటి కృత్రిమ మేధా అభ్యాస వేదిక.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="te" className={`${notoSansTelugu.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FAFAF7] text-[#17211E]">
        <TextSizeProvider>{children}</TextSizeProvider>
        <Analytics />
      </body>
    </html>
  );
}
