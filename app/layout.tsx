import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
  title: {
    default: "Investal Estate — комерційна нерухомість у Житомирі",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Оренда та продаж комерційної нерухомості у Житомирі та Житомирській області. Офіси, магазини, склади та інші перевірені об’єкти.",
  keywords: [
    "Investal Estate",
    "комерційна нерухомість Житомир",
    "оренда офісу Житомир",
    "продаж складу Житомир",
    "оренда магазину Житомир",
    "нерухомість Житомирська область",
  ],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    siteName: SITE_NAME,
    url: "/",
    title: "Investal Estate — комерційна нерухомість у Житомирі",
    description:
      "Оренда та продаж комерційної нерухомості у Житомирі та Житомирській області.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Investal Estate — комерційна нерухомість у Житомирі",
    description:
      "Оренда та продаж комерційної нерухомості у Житомирі та Житомирській області.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
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
