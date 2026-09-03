

import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { SerwistProvider } from "@serwist/turbopack/react";

import "./globals.css";
import Script from "next/script";
import { AppProviders } from "@/components/providers/app-providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const APP_NAME = "EduMaster Management";
const APP_DEFAULT_TITLE = "EduMaster Management";
const APP_DESCRIPTION = "Smart Learning - MCQ Analysis Admin Dashboard";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: `%s - ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  icons: {
    icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        strategy="afterInteractive"
      />
      <body
        className={`${poppins.variable} font-poppins antialiased bg-gray-50 text-gray-800`}
      >
        <SerwistProvider swUrl="/serwist/sw.js">
          <AppProviders>{children}</AppProviders>
        </SerwistProvider>
      </body>
    </html>
  );
}
