import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Michael Vaz — Customer Success Engineer @ Resend",
  description:
    "Personal site of Michael Vaz — Support Engineer turning complex technical problems into calm, workable solutions. Email infrastructure, escalations, and people-focused support.",
  openGraph: {
    title: "Michael Vaz — Customer Success Engineer",
    description: "Complex problems. Calm solutions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrains.variable}>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
