import Providers from "./providers";
import "@neondatabase/auth-ui/css";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FRAMEWORK — Filmmaking workspace",
  description: "Read screenplay PDFs or pasted scenes and build a practical film production plan with FRAMEWORK.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
