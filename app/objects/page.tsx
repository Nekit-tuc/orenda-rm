import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PropertiesSection from "@/components/PropertiesSection";
import { getProperties } from "@/lib/getProperties";

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
};

export default async function ObjectsPage() {
  const properties = await getProperties();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#020202] text-white">
      <Header />
      <div className="pt-10 md:pt-14">
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
