import type { Metadata } from "next";
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
  title: "Orenda RM | Оренда та продаж нерухомості у Житомирі",
  description:
    "Orenda RM — каталог оренди та продажу нерухомості у Житомирі: комерційні приміщення, офіси, склади, квартири та об’єкти для бізнесу.",
  keywords: [
    "оренда Житомир",
    "оренда приміщення Житомир",
    "комерційна нерухомість Житомир",
    "оренда офісу Житомир",
    "оренда складу Житомир",
    "продаж нерухомості Житомир",
    "Orenda RM",
  ],
  openGraph: {
    title: "Orenda RM | Нерухомість Житомира",
    description:
      "Оренда та продаж комерційної нерухомості у Житомирі.",
    siteName: "Orenda RM",
    locale: "uk_UA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
