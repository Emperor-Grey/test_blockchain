// "use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { type ReactNode } from "react";
import { cookieToInitialState } from "wagmi";
import Script from "next/script";

import { getConfig } from "../wagmi";
import { Providers } from "./providers";

import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dawg Token",
  description: "Dawg Token FrontEnd Application",
};

export default function RootLayout(props: { children: ReactNode }) {
  const initialState = cookieToInitialState(
    getConfig(),
    headers().get("cookie")
  );
  return (
    <html lang="en">
      <body className={`${inter.className} relative min-h-screen`}>
        <Providers initialState={initialState}>{props.children}</Providers>

        {/* Chatbot Configuration Script */}
        <Script id="chatling-config" strategy="afterInteractive">
          {`window.chtlConfig = { chatbotId: "8418474356" };`}
        </Script>

        {/* Chatbot Embed Script */}
        <Script
          id="chatling-embed"
          strategy="afterInteractive"
          src="https://chatling.ai/js/embed.js"
        />
      </body>
    </html>
  );
}
