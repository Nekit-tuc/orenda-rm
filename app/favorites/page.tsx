import Link from "next/link";
import FavoritesClient from "@/components/FavoritesClient";
import { getProperties } from "@/lib/getProperties";
import Image from "next/image";

export default async function FavoritesPage() {
  const properties = await getProperties();

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo_v1.png"
              alt="Orenda RM"
              width={110}
              height={110}
              className="rounded-full"
              priority
            />


          </Link>

          <Link
            href="/"
            className="rounded-full border border-white/20 px-5 py-2 text-sm transition hover:bg-white hover:text-black"
          >
            На головну
          </Link>
        </div>
      </header>

      <FavoritesClient properties={properties} />
    </main>
  );
}
