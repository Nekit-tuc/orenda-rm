import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PropertiesSection from "@/components/PropertiesSection";
import { getProperties } from "@/lib/getProperties";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Комерційні приміщення в оренду — каталог",
  description:
    "Каталог актуальних комерційних приміщень в оренду у Житомирі. Переглядайте фото, площу, адресу, характеристики та обирайте приміщення для бізнесу.",
  alternates: {
    canonical: "/objects",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Комерційні приміщення в оренду — каталог",
    description:
      "Каталог актуальних комерційних приміщень в оренду у Житомирі та Житомирській області.",
    url: "/objects",
    siteName: SITE_NAME,
    type: "website",
    locale: "uk_UA",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
};

export default async function ObjectsPage() {
  const properties = await getProperties();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#020202] text-white">
      <Header />
      <div className="pt-4 md:pt-8">
        <PropertiesSection
          properties={properties}
          sectionTitle="Комерційні приміщення в оренду"
          sectionSubtitle="Каталог Investal Estate"
        />
      </div>
      <Footer />
    </main>
  );
}
