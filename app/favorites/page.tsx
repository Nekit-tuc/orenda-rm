import FavoritesClient from "@/components/FavoritesClient";
import { getProperties } from "@/lib/getProperties";
import Header from "@/components/Header";

export default async function FavoritesPage() {
  const properties = await getProperties();

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <FavoritesClient properties={properties} />
    </main>
  );
}
