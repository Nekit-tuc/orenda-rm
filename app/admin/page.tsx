"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Property } from "@/types/property";
import ImageUploader from "@/components/ImageUploader";
import MultiImageUploader from "@/components/MultiImageUploader";
import { useRouter } from "next/navigation";
import { createSlug } from "@/lib/createSlug";

export default function AdminPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [adminSearch, setAdminSearch] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    type: "Комерція",
    deal_type: "Оренда",
    price_total: "",
    price_per_meter: "",
    area: "",
    address: "",
    floor: "",
    floors: "",
    parking: false,
    heating: "",
    internet: false,
    security: false,
    bathroom: false,
    description: "",
    image: "",
    images: "",
    lat: "",
    lng: "",
    status: "Активний",
  });

    const router = useRouter();

    useEffect(() => {
      const isAdmin = localStorage.getItem("zt-space-admin");

      if (isAdmin !== "true") {
        router.push("/admin/login");
      }
    }, [router]);

  async function loadProperties() {
    setLoading(true);

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

      if (error) {
        console.error("SUPABASE LOAD ERROR:", error);
        alert(error.message);
      } else {
        console.log("SUPABASE DATA:", data);
        setProperties(data || []);
      }

    setLoading(false);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialProperties() {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error(error);
      } else {
        setProperties(data || []);
      }

      setLoading(false);
    }

    void loadInitialProperties();

    return () => {
      isMounted = false;
    };
  }, []);
        
        async function geocodeAddress() {
        if (!formData.address.trim()) {
            alert("Спочатку введи адресу");
            return;
        }

        const query = `${formData.address}, Житомир, Україна`;

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
            )}&limit=1`
        );

        const data = await response.json();

        if (!data || data.length === 0) {
            alert("Не вдалося знайти координати. Спробуй точнішу адресу.");
            return;
        }

        setFormData({
            ...formData,
            lat: data[0].lat,
            lng: data[0].lon,
        });
        }

        const formattedPriceTotal =
  formData.price_total.includes("грн") ||
  formData.price_total.includes("$")
    ? formData.price_total
    : formData.deal_type === "Оренда"
    ? `${formData.price_total} грн/міс`
    : `${formData.price_total} $`;

        function startEdit(property: Property) {
  setEditingId(property.id);
  setShowForm(true);

  setFormData({
    title: property.title,
    type: property.type,
    deal_type: property.deal_type,
    price_total: property.price_total,
    price_per_meter: property.price_per_meter,
    area: property.area,
    address: property.address,
    floor: property.floor ? String(property.floor) : "",
    floors: property.floors ? String(property.floors) : "",
    parking: property.parking,
    heating: property.heating || "",
    internet: property.internet,
    security: property.security,
    bathroom: property.bathroom,
    description: property.description,
    image: property.image,
    images: property.images ? property.images.join("\n") : "",
    lat: property.lat ? String(property.lat) : "",
    lng: property.lng ? String(property.lng) : "",
    status: property.status,
  });
}

  async function addProperty(e: React.FormEvent) {
    e.preventDefault();

    const imagesArray = formData.images
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

          const formattedPricePerMeter =
    formData.price_per_meter.includes("м²") ||
    formData.price_per_meter.includes("м2")
        ? formData.price_per_meter
        : formData.deal_type === "Оренда"
        ? `${formData.price_per_meter} грн/м²`
        : `${formData.price_per_meter} $/м²`;

        const slug = createSlug(formData.title);
 
        const { error } = await supabase.from("properties").insert({
      title: formData.title,
      type: formData.type,
      deal_type: formData.deal_type,
      price_total: formattedPriceTotal,
        price_per_meter: formattedPricePerMeter,
        slug,
      area: formData.area,
      address: formData.address,
      floor: formData.floor ? Number(formData.floor) : null,
      floors: formData.floors ? Number(formData.floors) : null,
      parking: formData.parking,
      heating: formData.heating,
      internet: formData.internet,
      security: formData.security,
      bathroom: formData.bathroom,
      description: formData.description,
      image: formData.image,
      images: [
        formData.image,
        ...imagesArray.filter((url) => url !== formData.image),
      ],
      lat: formData.lat ? Number(formData.lat) : null,
      lng: formData.lng ? Number(formData.lng) : null,
      status: formData.status,
      views: 0,
    });

    if (error) {
      console.error(error);
      alert("Помилка при додаванні об’єкта");
      return;
    }

    setFormData({
      title: "",
      type: "Комерція",
      deal_type: "Оренда",
      price_total: "",
      price_per_meter: "",
      area: "",
      address: "",
      floor: "",
      floors: "",
      parking: false,
      heating: "",
      internet: false,
      security: false,
      bathroom: false,
      description: "",
      image: "",
      images: "",
      lat: "",
      lng: "",
      status: "Активний",
    });

    setShowForm(false);
    loadProperties();
  }

            async function updateProperty(e: React.FormEvent) {
            e.preventDefault();

            if (!editingId) return;

            const imagesArray = formData.images
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean);

            const formattedPricePerMeter =
              formData.price_per_meter.includes("м²") ||
              formData.price_per_meter.includes("м2")
                ? formData.price_per_meter
                : formData.deal_type === "Оренда"
                ? `${formData.price_per_meter} грн/м²`
                : `${formData.price_per_meter} $/м²`;

            const formattedPriceTotal =
              formData.price_total.includes("грн") ||
              formData.price_total.includes("$")
                ? formData.price_total
                : formData.deal_type === "Оренда"
                ? `${formData.price_total} грн/міс`
                : `${formData.price_total} $`;

            const slug = createSlug(formData.title, editingId);

            const { error } = await supabase
              .from("properties")
              .update({
                title: formData.title,
                type: formData.type,
                deal_type: formData.deal_type,
                price_total: formattedPriceTotal,
                price_per_meter: formattedPricePerMeter,
                slug,
                area: formData.area,
                address: formData.address,
                floor: formData.floor ? Number(formData.floor) : null,
                floors: formData.floors ? Number(formData.floors) : null,
                parking: formData.parking,
                heating: formData.heating,
                internet: formData.internet,
                security: formData.security,
                bathroom: formData.bathroom,
                description: formData.description,
                image: formData.image,
                images: [
                  formData.image,
                  ...imagesArray.filter((url) => url !== formData.image),
                ],                lat: formData.lat ? Number(formData.lat) : null,
                lng: formData.lng ? Number(formData.lng) : null,
                status: formData.status,
              })
              .eq("id", editingId);

            if (error) {
              console.error(error);
              alert("Помилка при оновленні об'єкта");
              return;
            }

            alert("Об'єкт оновлено");

            setEditingId(null);
            setShowForm(false);

            loadProperties();
          }

  async function deleteProperty(id: number) {
    const confirmed = confirm("Точно видалити об’єкт?");

    if (!confirmed) return;



    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Помилка при видаленні");
      return;
    }

    loadProperties();
  }

  async function changeStatus(id: number, status: string) {
    const { error } = await supabase
      .from("properties")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Помилка при зміні статусу");
      return;
    }

    loadProperties();
  }

  const activeCount = properties.filter(
    (property) => property.status === "Активний"
  ).length;

    const filteredAdminProperties = properties.filter((property) => {
      const searchValue = adminSearch.toLowerCase().trim();

      if (!searchValue) return true;

      return (
        property.title.toLowerCase().includes(searchValue) ||
        property.address.toLowerCase().includes(searchValue) ||
        property.type.toLowerCase().includes(searchValue) ||
        property.deal_type.toLowerCase().includes(searchValue) ||
        property.status.toLowerCase().includes(searchValue)
      );
    });

  const totalViews = properties.reduce(
    (sum, property) => sum + (property.views || 0),
    0
  );


  

    async function copyPropertyLink(id: number) {
      const url = `${window.location.origin}/objects/${id}`;

      await navigator.clipboard.writeText(url);

      alert("Посилання скопійовано");
    }

    function cancelEdit() {
      setEditingId(null);
      setShowForm(false);

      setFormData({
        title: "",
        type: "Комерція",
        deal_type: "Оренда",
        price_total: "",
        price_per_meter: "",
        area: "",
        address: "",
        floor: "",
        floors: "",
        parking: false,
        heating: "",
        internet: false,
        security: false,
        bathroom: false,
        description: "",
        image: "",
        images: "",
        lat: "",
        lng: "",
        status: "Активний",
      });
    }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Admin Panel
            </p>
         </div>

          <Link
            href="/"
            className="rounded-full border border-white/20 px-5 py-2 text-sm transition hover:bg-white hover:text-black"
          >
            На сайт
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("zt-space-admin");
              router.push("/admin/login");
            }}
            className="rounded-full border border-red-500/40 px-5 py-2 text-sm text-red-300 transition hover:bg-red-500 hover:text-white"
          >
            Вийти
          </button> 
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-4xl font-bold">Керування об’єктами</h2>
            <p className="mt-2 text-white/50">
              Дані вже зберігаються в Supabase.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                title: "",
                type: "Комерція",
                deal_type: "Оренда",
                price_total: "",
                price_per_meter: "",
                area: "",
                address: "",
                floor: "",
                floors: "",
                parking: false,
                heating: "",
                internet: false,
                security: false,
                bathroom: false,
                description: "",
                image: "",
                images: "",
                lat: "",
                lng: "",
                status: "Активний",
              });
              setShowForm(true);
            }}
            className="rounded-full bg-white px-6 py-3 font-medium text-black transition hover:opacity-80"
          >
            + Додати об’єкт
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={editingId ? updateProperty : addProperty}
            className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6"
          >

          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                {editingId ? "Редагування об’єкта" : "Новий об’єкт"}
              </h3>

              {editingId && (
                <p className="mt-1 text-sm text-white/40">
                  Після змін натисни “Підтвердити зміни”.
                </p>
              )}
            </div>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-full border border-white/20 px-5 py-2 text-sm transition hover:bg-white hover:text-black"
              >
                Назад в адмін панель
              </button>
            )}
          </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                required
                placeholder="Назва"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none placeholder:text-white/30"
              />

              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
              >
                <option>Комерція</option>
                <option>Офіси</option>
                <option>Склади</option>
                <option>Квартири</option>
              </select>

              <select
                value={formData.deal_type}
                onChange={(e) =>
                  setFormData({ ...formData, deal_type: e.target.value })
                }
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
              >
                <option>Оренда</option>
                <option>Продаж</option>
              </select>

              <input
                required
                placeholder="Загальна ціна: 18 000 грн/міс або 75 000 $"
                value={formData.price_total}
                onChange={(e) =>
                  setFormData({ ...formData, price_total: e.target.value })
                }
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none placeholder:text-white/30"
              />

              <input
                required
                placeholder="Ціна за м²: 250 грн/м² або 789 $/м²"
                value={formData.price_per_meter}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price_per_meter: e.target.value,
                  })
                }
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none placeholder:text-white/30"
              />

              <input
                required
                placeholder="Площа: 72 м²"
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: e.target.value })
                }
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none placeholder:text-white/30"
              />

              <input
                required
                placeholder="Адреса"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none placeholder:text-white/30 md:col-span-2"
              />

              <button
                type="button"
                onClick={geocodeAddress}
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-left text-white/70 transition hover:bg-white hover:text-black md:col-span-2"
                >
                📍 Знайти координати по адресі
                </button>

              <input
                placeholder="Поверх"
                value={formData.floor}
                onChange={(e) =>
                  setFormData({ ...formData, floor: e.target.value })
                }
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none placeholder:text-white/30"
              />

              <input
                placeholder="Поверховість"
                value={formData.floors}
                onChange={(e) =>
                  setFormData({ ...formData, floors: e.target.value })
                }
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none placeholder:text-white/30"
              />

                <div className="md:col-span-2">
                <ImageUploader
                    onUploaded={(url) =>
                    setFormData({ ...formData, image: url })
                    }
                />

                {formData.image && (
                    <Image
                    src={formData.image}
                    alt="Preview"
                    width={960}
                    height={320}
                    sizes="100vw"
                    unoptimized
                    className="mt-4 h-48 w-full rounded-2xl object-cover"
                    />
                )}
                </div>

              <input
                required
                placeholder="Головне фото URL"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none placeholder:text-white/30 md:col-span-2"
              />

              <div className="md:col-span-2">
                <MultiImageUploader
                  onUploaded={(urls) =>
                    setFormData({
                      ...formData,
                      images: [...formData.images.split("\n").filter(Boolean), ...urls].join(
                        "\n"
                      ),
                    })
                  }
                />
              </div>

              <textarea
                placeholder="Додаткові фото URL — кожне з нового рядка"
                value={formData.images}
                onChange={(e) =>
                  setFormData({ ...formData, images: e.target.value })
                }
                className="min-h-28 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none placeholder:text-white/30 md:col-span-2"
              />

              {formData.images && (
                <div className="grid gap-3 md:col-span-2 md:grid-cols-4">
                  {formData.images
                    .split("\n")
                    .filter(Boolean)
                    .map((image) => (
                      <img
                        key={image}
                        src={image}
                        alt="Gallery preview"
                        className="h-28 w-full rounded-2xl object-cover"
                      />
                    ))}
                </div>
              )}

              <textarea
                required
                placeholder="Опис"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="min-h-32 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none placeholder:text-white/30 md:col-span-2"
              />

              <input
                placeholder="Latitude"
                value={formData.lat}
                onChange={(e) =>
                  setFormData({ ...formData, lat: e.target.value })
                }
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none placeholder:text-white/30"
              />

              <input
                placeholder="Longitude"
                value={formData.lng}
                onChange={(e) =>
                  setFormData({ ...formData, lng: e.target.value })
                }
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none placeholder:text-white/30"
              />

              <div className="grid gap-3 md:col-span-2 md:grid-cols-4">
                {[
                  ["parking", "Парковка"],
                  ["internet", "Інтернет"],
                  ["security", "Охорона"],
                  ["bathroom", "Санвузол"],
                ].map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-5 py-4"
                  >
                    <input
                      type="checkbox"
                      checked={formData[key as keyof typeof formData] as boolean}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [key]: e.target.checked,
                        })
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>

              <input
                placeholder="Опалення: автономне, центральне..."
                value={formData.heating}
                onChange={(e) =>
                  setFormData({ ...formData, heating: e.target.value })
                }
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none placeholder:text-white/30 md:col-span-2"
              />

            <div className="flex flex-col gap-3 md:col-span-2 md:flex-row">
              <button
                type="submit"
                className="rounded-full bg-white px-6 py-4 font-medium text-black transition hover:opacity-80"
              >
                {editingId ? "Підтвердити зміни" : "Зберегти в Supabase"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-full border border-white/20 px-6 py-4 font-medium text-white transition hover:bg-white hover:text-black"
                >
                  Відмінити
                </button>
              )}

              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-full border border-white/20 px-6 py-4 font-medium text-white/70 transition hover:bg-white hover:text-black"
              >
                Назад в адмін панель
              </button>
            </div>
            </div>
          </form>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/40">Всього об’єктів</p>
            <p className="mt-3 text-4xl font-bold">{properties.length}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/40">Активні</p>
            <p className="mt-3 text-4xl font-bold">{activeCount}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/40">Перегляди</p>
            <p className="mt-3 text-4xl font-bold">{totalViews}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/40">База</p>
            <p className="mt-3 text-4xl font-bold">DB</p>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Пошук в адмінці: назва, адреса, тип, статус..."
            value={adminSearch}
            onChange={(e) => setAdminSearch(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none transition placeholder:text-white/30 focus:border-white/30"
          />
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            Завантаження...
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <div className="grid grid-cols-12 border-b border-white/10 bg-white/5 px-5 py-4 text-sm text-white/40">
              <div className="col-span-4">Об’єкт</div>
              <div className="col-span-2">Тип</div>
              <div className="col-span-2">Ціна</div>
              <div className="col-span-1">Площа</div>
              <div className="col-span-1">Views</div>
              <div className="col-span-2 flex flex-wrap items-center gap-2">Дії</div>
            </div>

            {filteredAdminProperties.map((property) => (
              <div
                key={property.id}
                className="grid grid-cols-12 items-center border-b border-white/10 px-5 py-4 last:border-b-0"
              >
                <div className="col-span-4 flex items-center gap-4">
                  <Image
                    src={property.image}
                    alt={property.title}
                    width={80}
                    height={64}
                    sizes="80px"
                    unoptimized
                    className="h-16 w-20 rounded-xl object-cover"
                  />

                  <div>
                    <p className="font-medium">{property.title}</p>

                    <select
                      value={property.status}
                      onChange={(e) =>
                        changeStatus(property.id, e.target.value)
                      }
                      className="mt-2 rounded-full border border-white/10 bg-black px-3 py-1 text-xs text-white"
                    >
                      <option>Активний</option>
                      <option>Чернетка</option>
                      <option>Здано</option>
                    </select>
                  </div>
                </div>

                <div className="col-span-2 text-white/60">
                  {property.type} / {property.deal_type}
                </div>

                <div className="col-span-2 font-medium">
                  {property.price_total}
                </div>

                <div className="col-span-1 text-white/60">
                  {property.area}
                </div>

                <div className="col-span-1 text-white/60">
                  {property.views}
                </div>

                <div className="col-span-2 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => startEdit(property)}
                    className="rounded-full border border-white/15 px-3 py-2 text-xs transition hover:bg-white hover:text-black"
                  >
                    Редагувати
                  </button>

                  <a
                    href={`/objects/${property.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/15 px-3 py-2 text-xs transition hover:bg-white hover:text-black"
                  >
                    Відкрити
                  </a>

                  <button
                    onClick={() => copyPropertyLink(property.id)}
                    className="rounded-full border border-white/15 px-3 py-2 text-xs transition hover:bg-white hover:text-black"
                  >
                    Копіювати
                  </button>

                  <button
                    onClick={() => deleteProperty(property.id)}
                    className="rounded-full border border-red-500/40 px-3 py-2 text-xs text-red-300 transition hover:bg-red-500 hover:text-white"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
