import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mockmeet Ai",
  description: "Your Ai powered interview assistant",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Force allow indexing to override Clerk's noindex */}
          <meta name="robots" content="index, follow" />

          {/* Browser + Google-friendly favicon setup */}
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />

          {/* Additional PNG for Google Search */}
          <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
          <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
