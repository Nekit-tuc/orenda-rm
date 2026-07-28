import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PropertiesSection from "@/components/PropertiesSection";
import SeoLandingLinks from "@/components/SeoLandingLinks";
import { getProperties } from "@/lib/getProperties";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Комерційна нерухомість у Житомирі — оренда та продаж",
  description:
    "Каталог комерційної нерухомості у Житомирі та Житомирській області: магазини, офіси, склади та приміщення в оренду або на продаж.",
  alternates: {
    canonical: "/objects",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Комерційна нерухомість у Житомирі — оренда та продаж",
    description:
      "Каталог комерційної нерухомості у Житомирі та Житомирській області.",
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
      <SeoLandingLinks compact />
      <div className="pt-4 md:pt-8">
        <PropertiesSection
          properties={properties}
          sectionTitle="Каталог об’єктів"
          sectionSubtitle="Комерційна нерухомість"
        />
      </div>
      <Footer />
    </main>
  );
}
