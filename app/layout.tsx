import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "CoinCash",
  description: "CoinCash",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ru">
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
      {children}
    </body>
  </html>;
}
