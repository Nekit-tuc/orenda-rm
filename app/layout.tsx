import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://investal-estate.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Investal Estate",
  appleWebApp: {
    capable: true,
    title: "Investal Estate",
    statusBarStyle: "black-translucent",
  },
  title: {
    default: "Investal Estate — сучасний каталог нерухомості",
    template: "%s | Investal Estate",
  },
  description:
    "Investal Estate — сучасна платформа нерухомості для купівлі, продажу та оренди комерційної нерухомості, земельних ділянок, будинків та квартир.",
  keywords: [
    "Investal Estate",
    "нерухомість",
    "комерційна нерухомість",
    "купити нерухомість",
    "продати нерухомість",
    "оренда нерухомості",
    "земля",
    "будинки",
    "офіси",
    "склади",
    "інвестиції",
  ],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  openGraph: {
    title: "Investal Estate — сучасний каталог нерухомості",
    description:
      "Платформа для купівлі, продажу та оренди комерційної нерухомості, землі, будинків і квартир.",
    url: siteUrl,
    siteName: "Investal Estate",
    locale: "uk_UA",
    type: "website",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Investal Estate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Investal Estate — сучасний каталог нерухомості",
    description:
      "Платформа для купівлі, продажу та оренди комерційної нерухомості, землі, будинків і квартир.",
    images: ["/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
