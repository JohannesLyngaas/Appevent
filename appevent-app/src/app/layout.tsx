import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

type DefaultLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({
  children,
}: DefaultLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}
