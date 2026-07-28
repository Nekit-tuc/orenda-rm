import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PropertiesSection from "@/components/PropertiesSection";
import { getProperties } from "@/lib/getProperties";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const objectsTitle =
  "Комерційна нерухомість в оренду у Житомирі | Investal Estate";
const objectsDescription =
  "Актуальні комерційні приміщення в оренду у Житомирі: магазини, офіси, склади та приміщення для різних напрямків бізнесу. Переглядайте фото, площу, адресу та характеристики об’єктів.";
const objectsCanonical = "https://investal-est.com/objects";

export const metadata: Metadata = {
  title: {
    absolute: objectsTitle,
  },
  description: objectsDescription,
  alternates: {
    canonical: objectsCanonical,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: objectsTitle,
    description: objectsDescription,
    url: objectsCanonical,
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
          sectionTitle="Комерційні приміщення в оренду у Житомирі"
          sectionSubtitle="Каталог Investal Estate"
          sectionDescription="Переглядайте актуальні магазини, офіси, склади та інші приміщення для бізнесу у Житомирі."
          titleAs="h1"
        />
      </div>

      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 md:pb-14">
        <div className="rounded-3xl border border-[#b89652]/25 bg-[radial-gradient(circle_at_top_left,rgba(184,150,82,0.11),transparent_34%),rgba(255,255,255,0.028)] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.26)] backdrop-blur-xl sm:p-7">
          <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
            Оренда комерційної нерухомості у Житомирі
          </h2>

          <div className="mt-4 grid gap-3 text-sm leading-6 text-white/65 md:grid-cols-2 md:text-[15px] md:leading-7">
            <p>
              У каталозі Investal Estate представлені актуальні комерційні
              приміщення в оренду у Житомирі. Тут можна знайти магазини,
              торгові площі, офіси, склади та приміщення для різних напрямків
              бізнесу.
            </p>

            <p>
              Використовуйте фільтри, щоб підібрати об’єкт за типом, площею,
              районом або іншими характеристиками. На сторінці кожного
              приміщення доступні фотографії, адреса, опис, площа та контактна
              інформація.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
