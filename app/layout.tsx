import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eulogeo Trading Academy — Student Registration",
  description: "Register your Weltrade account and join the Eulogeo Trading Academy free Telegram group.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
