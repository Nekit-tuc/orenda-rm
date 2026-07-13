"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { Property } from "@/types/property";
import ImageUploader from "@/components/ImageUploader";
import MultiImageUploader from "@/components/MultiImageUploader";
import { useRouter } from "next/navigation";
import { createSlug } from "@/lib/createSlug";
import { getPropertySlug } from "@/lib/getPropertySlug";
import { propertyTypeOptions } from "@/lib/propertyCategories";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminObjectsTable from "@/components/admin/AdminObjectsTable";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { RouteIcon } from "@/components/PremiumIcons";
import {
  createEmptyRealEstateBlock,
  defaultHomepageSettings,
  type HomepageSettings,
  type RealEstateBlockSettings,
} from "@/lib/homepageSettings";

type AdminSection = "overview" | "objects" | "homepage" | "leads" | "submissions";

type PropertyLead = {
  id: string;
  full_name: string;
  phone: string;
  property_id: number | null;
  property_title: string | null;
  property_slug: string | null;
  source: string | null;
  user_agent: string | null;
  created_at: string;
};

type SubmissionStatus = "new" | "contacted" | "rejected" | "approved";

type PropertySubmission = {
  id: string;
  full_name: string;
  phone: string;
  telegram: string | null;
  email: string | null;
  property_type: "Земля" | "Комерція" | "Будинок";
  address: string;
  area: string;
  price: string;
  cadastral_number: string | null;
  cadastral_photo: string | null;
  description: string | null;
  photos: string[];
  status: SubmissionStatus;
  created_at: string;
};

const submissionStatusLabels: Record<SubmissionStatus, string> = {
  new: "Нові",
  contacted: "Звʼязались",
  rejected: "Відхилені",
  approved: "Схвалені",
};

export default function AdminPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>("objects");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [adminSearch, setAdminSearch] = useState("");
  const [adminTypeFilter, setAdminTypeFilter] = useState("Всі типи");
  const [adminStatusFilter, setAdminStatusFilter] = useState("Всі статуси");
  const [homepageContent, setHomepageContent] = useState<HomepageSettings>(
    defaultHomepageSettings
  );
  const [homepageMessage, setHomepageMessage] = useState("");
  const [homepageSaving, setHomepageSaving] = useState(false);
  const [leads, setLeads] = useState<PropertyLead[]>([]);
  const [leadsSearch, setLeadsSearch] = useState("");
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<PropertySubmission[]>([]);
  const [submissionsSearch, setSubmissionsSearch] = useState("");
  const [submissionsStatusFilter, setSubmissionsStatusFilter] = useState<"all" | SubmissionStatus>("all");
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionsError, setSubmissionsError] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<PropertySubmission | null>(null);

  async function loadHomepageSettingsFromAdmin() {
    const response = await fetch("/api/admin/homepage-settings", {
      cache: "no-store",
    });

    const result = (await response.json().catch(() => null)) as {
      ok?: boolean;
      settings?: HomepageSettings;
      message?: string;
    } | null;

    if (!response.ok || !result?.ok || !result.settings) {
      throw new Error(result?.message || "Не вдалося завантажити налаштування.");
    }

    return result.settings;
  }

  async function saveHomepageSettingsFromAdmin() {
    const response = await fetch("/api/admin/homepage-settings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(homepageContent),
    });

    const result = (await response.json().catch(() => null)) as {
      ok?: boolean;
      settings?: HomepageSettings;
      message?: string;
    } | null;

    if (!response.ok || !result?.ok || !result.settings) {
      throw new Error(result?.message || "Помилка при збереженні.");
    }

    return result.settings;
  }

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
      let isMounted = true;

      async function checkAdminSession() {
        const response = await fetch("/api/admin/session", {
          cache: "no-store",
        });
        const result = (await response.json().catch(() => null)) as {
          ok?: boolean;
        } | null;

        if (isMounted && !result?.ok) {
          router.replace("/admin/login");
        }
      }

      void checkAdminSession();

      return () => {
        isMounted = false;
      };
    }, [router]);

  async function loadProperties() {
    setLoading(true);
    setLoadError("");

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

      if (error) {
        console.error("SUPABASE LOAD ERROR:", error);
        setLoadError("Не вдалося завантажити обʼєкти. Спробуйте оновити список.");
        alert(error.message);
      } else {
        setProperties(data || []);
      }

    setLoading(false);
  }

  const loadLeads = useCallback(async function loadLeads() {
    setLeadsLoading(true);
    setLeadsError("");

    const response = await fetch("/api/admin/leads", {
      cache: "no-store",
    });

    const result = (await response.json().catch(() => null)) as {
      ok?: boolean;
      leads?: PropertyLead[];
      message?: string;
    } | null;

    if (!response.ok || !result?.ok) {
      setLeadsError(result?.message || "Не вдалося завантажити ліди.");
      setLeads([]);
    } else {
      setLeads(result.leads || []);
    }

    setLeadsLoading(false);
  }, []);

  const loadSubmissions = useCallback(async function loadSubmissions() {
    setSubmissionsLoading(true);
    setSubmissionsError("");

    const response = await fetch("/api/admin/property-submissions", {
      cache: "no-store",
    });
    const result = (await response.json().catch(() => null)) as {
      ok?: boolean;
      submissions?: PropertySubmission[];
      message?: string;
    } | null;

    if (!response.ok || !result?.ok) {
      setSubmissionsError(
        result?.message || "Не вдалося завантажити пропозиції."
      );
      setSubmissions([]);
    } else {
      setSubmissions(result.submissions || []);
    }

    setSubmissionsLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      const [propertiesResult, settingsResult] = await Promise.allSettled([
        supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false }),
        loadHomepageSettingsFromAdmin(),
      ]);

      if (!isMounted) {
        return;
      }

      const propertyResponse =
        propertiesResult.status === "fulfilled"
          ? propertiesResult.value
          : { data: null, error: propertiesResult.reason };

      if (propertyResponse.error) {
        console.error(propertyResponse.error);
        setLoadError("Не вдалося завантажити обʼєкти. Спробуйте оновити список.");
      } else {
        setProperties(propertyResponse.data || []);
      }

      if (settingsResult.status === "fulfilled") {
        setHomepageContent(settingsResult.value);
      } else {
        console.error("Homepage settings load error:", settingsResult.reason);
      }
      setLoading(false);
    }

    void loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (activeSection === "leads") {
      const timeoutId = window.setTimeout(() => {
        void loadLeads();
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [activeSection, loadLeads]);

  useEffect(() => {
    if (activeSection === "submissions") {
      const timeoutId = window.setTimeout(() => {
        void loadSubmissions();
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [activeSection, loadSubmissions]);
        
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

        const initialSlug = createSlug({
          title: formData.title,
          type: formData.type,
          deal_type: formData.deal_type,
          address: formData.address,
          area: formData.area,
        });
 
        const { data: createdProperty, error } = await supabase.from("properties").insert({
      title: formData.title,
      type: formData.type,
      deal_type: formData.deal_type,
      price_total: formattedPriceTotal,
        price_per_meter: formattedPricePerMeter,
        slug: initialSlug,
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
    }).select("id").single();

    if (error) {
      console.error(error);
      alert("Помилка при додаванні об’єкта");
      return;
    }

    if (createdProperty?.id) {
      const slug = createSlug({
        id: createdProperty.id,
        title: formData.title,
        type: formData.type,
        deal_type: formData.deal_type,
        address: formData.address,
        area: formData.area,
      });

      const { error: slugError } = await supabase
        .from("properties")
        .update({ slug })
        .eq("id", createdProperty.id);

      if (slugError) {
        console.error(slugError);
      }
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

            const slug = createSlug({
              id: editingId,
              title: formData.title,
              type: formData.type,
              deal_type: formData.deal_type,
              address: formData.address,
              area: formData.area,
            });

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

  const archivedCount = properties.filter((property) => {
    const status = property.status.toLowerCase();

    return status.includes("арх") || status.includes("видал");
  }).length;

  const inactiveCount = properties.length - activeCount - archivedCount;

  const adminTypeOptions = Array.from(
    new Set([
      ...propertyTypeOptions,
      ...properties.map((property) => property.type).filter(Boolean),
    ])
  );

  const adminStatusOptions = Array.from(
    new Set(properties.map((property) => property.status).filter(Boolean))
  );

  const filteredAdminProperties = properties.filter((property) => {
    const searchValue = adminSearch.toLowerCase().trim();
    const typeMatch =
      adminTypeFilter === "Всі типи" || property.type === adminTypeFilter;
    const statusMatch =
      adminStatusFilter === "Всі статуси" ||
      property.status === adminStatusFilter;

    const searchMatch =
      searchValue === "" ||
      property.title.toLowerCase().includes(searchValue) ||
      property.address.toLowerCase().includes(searchValue) ||
      property.type.toLowerCase().includes(searchValue) ||
      property.deal_type.toLowerCase().includes(searchValue) ||
      property.status.toLowerCase().includes(searchValue);

    return typeMatch && statusMatch && searchMatch;
  });

  const filteredLeads = leads.filter((lead) => {
    const searchValue = leadsSearch.toLowerCase().trim();

    if (!searchValue) {
      return true;
    }

    return (
      lead.full_name.toLowerCase().includes(searchValue) ||
      lead.phone.toLowerCase().includes(searchValue) ||
      (lead.property_title || "").toLowerCase().includes(searchValue)
    );
  });

  function formatLeadDate(value: string) {
    return new Intl.DateTimeFormat("uk-UA", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  }

  function escapeCsvValue(value: string | number | null | undefined) {
    const normalized = String(value ?? "").replace(/"/g, '""');

    return `"${normalized}"`;
  }

  function downloadLeadsCsv() {
    const rows = [
      ["Дата", "ПІБ", "Телефон", "Об'єкт", "Slug", "Джерело"],
      ...leads.map((lead) => [
        formatLeadDate(lead.created_at),
        lead.full_name,
        lead.phone,
        lead.property_title || "",
        lead.property_slug || "",
        lead.source || "",
      ]),
    ];

    const csv = rows
      .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `investal-estate-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function deleteLead(lead: PropertyLead) {
    const confirmed = window.confirm(
      "Ви точно хочете видалити цього клієнта/ліда?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingLeadId(lead.id);
    setLeadMessage("");
    setLeadsError("");

    try {
      const response = await fetch(`/api/admin/property-leads/${lead.id}`, {
        method: "DELETE",
      });
      const result = (await response.json().catch(() => null)) as {
        ok?: boolean;
        message?: string;
      } | null;

      if (!response.ok || !result?.ok) {
        throw new Error(result?.message || "Не вдалося видалити ліда.");
      }

      setLeads((current) => current.filter((item) => item.id !== lead.id));
      setLeadMessage("Лід видалено");
    } catch (error) {
      console.error("Lead delete error:", error);
      setLeadsError(
        error instanceof Error ? error.message : "Не вдалося видалити ліда."
      );
    } finally {
      setDeletingLeadId(null);
    }
  }

  const filteredSubmissions = submissions.filter((submission) => {
    const searchValue = submissionsSearch.toLowerCase().trim();
    const statusMatch =
      submissionsStatusFilter === "all" ||
      submission.status === submissionsStatusFilter;

    const searchMatch =
      !searchValue ||
      submission.full_name.toLowerCase().includes(searchValue) ||
      submission.phone.toLowerCase().includes(searchValue) ||
      submission.address.toLowerCase().includes(searchValue) ||
      (submission.cadastral_number || "").toLowerCase().includes(searchValue);

    return statusMatch && searchMatch;
  });

  function downloadSubmissionsCsv() {
    const rows = [
      [
        "Дата",
        "ПІБ",
        "Телефон",
        "Telegram",
        "Тип",
        "Адреса",
        "Площа",
        "Ціна",
        "Кадастр",
        "Статус",
      ],
      ...submissions.map((submission) => [
        formatLeadDate(submission.created_at),
        submission.full_name,
        submission.phone,
        submission.telegram || "",
        submission.property_type,
        submission.address,
        submission.area,
        submission.price,
        submission.cadastral_number || "",
        submissionStatusLabels[submission.status],
      ]),
    ];

    const csv = rows
      .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `investal-estate-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function updateSubmissionStatus(id: string, status: SubmissionStatus) {
    const response = await fetch("/api/admin/property-submissions", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });
    const result = (await response.json().catch(() => null)) as {
      ok?: boolean;
      message?: string;
    } | null;

    if (!response.ok || !result?.ok) {
      alert(result?.message || "Не вдалося змінити статус.");
      return;
    }

    setSubmissions((current) =>
      current.map((submission) =>
        submission.id === id ? { ...submission, status } : submission
      )
    );
    setSelectedSubmission((current) =>
      current?.id === id ? { ...current, status } : current
    );
  }

    async function copyPropertyLink(property: Property) {
      const slug = getPropertySlug(property);
      const url = `${window.location.origin}/objects/${slug}`;

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

    function startNewProperty() {
      setActiveSection("objects");
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
    }

    async function saveHomepageContent(e: React.FormEvent) {
      e.preventDefault();
      setHomepageSaving(true);
      setHomepageMessage("");

      try {
        const savedSettings = await saveHomepageSettingsFromAdmin();
        setHomepageContent(savedSettings);
      } catch (error) {
        console.error("Homepage content save error:", error);
        setHomepageMessage(
          error instanceof Error ? error.message : "Помилка при збереженні."
        );
        setHomepageSaving(false);
        return;
      }

      setHomepageSaving(false);
      setHomepageMessage("Контент головної сторінки оновлено");
    }

    function updateRealEstateBlock(
      index: number,
      field: keyof RealEstateBlockSettings,
      value: string
    ) {
      setHomepageContent((current) => ({
        ...current,
        realEstateBlocks: current.realEstateBlocks.map((block, blockIndex) =>
          blockIndex === index ? { ...block, [field]: value } : block
        ),
      }));
    }

    function addRealEstateBlock() {
      setHomepageContent((current) => ({
        ...current,
        realEstateBlocks: [
          ...current.realEstateBlocks,
          createEmptyRealEstateBlock(),
        ],
      }));
    }

    function removeRealEstateBlock(index: number) {
      setHomepageContent((current) => ({
        ...current,
        realEstateBlocks: current.realEstateBlocks.filter(
          (_, blockIndex) => blockIndex !== index
        ),
      }));
    }

  return (
    <AdminLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      <AdminHeader
        onLogout={async () => {
          await fetch("/api/admin/logout", { method: "POST" });
          router.replace("/admin/login");
        }}
      />

      {activeSection === "overview" && (
        <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-blue-950/10 backdrop-blur-xl">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.28em] text-blue-300">
              Огляд
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              Стан адмін-панелі
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Коротка зводка по обʼєктах, статусах і швидких діях.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              label="Всі обʼєкти"
              value={properties.length}
              helper="Загальна кількість записів"
            />
            <AdminStatCard
              label="Активні"
              value={activeCount}
              helper="Показуються на сайті"
            />
            <AdminStatCard
              label="Неактивні"
              value={inactiveCount}
              helper="Інші статуси"
            />
            <AdminStatCard
              label="Архівні"
              value={archivedCount}
              helper="Видалені або архівні статуси"
            />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-4">
            <button
              type="button"
              onClick={() => setActiveSection("objects")}
              className="rounded-2xl border border-blue-400/30 bg-blue-500/10 p-5 text-left transition hover:bg-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <span className="text-sm font-semibold text-blue-100">
                Перейти до обʼєктів
              </span>
              <span className="mt-2 block text-sm text-slate-400">
                Пошук, фільтри, таблиця та картки обʼєктів.
              </span>
            </button>

            <button
              type="button"
              onClick={startNewProperty}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-blue-300/40 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <span className="text-sm font-semibold text-white">
                Додати обʼєкт
              </span>
              <span className="mt-2 block text-sm text-slate-400">
                Відкриє форму створення у вкладці обʼєктів.
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("homepage")}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-blue-300/40 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <span className="text-sm font-semibold text-white">
                Контент головної
              </span>
              <span className="mt-2 block text-sm text-slate-400">
                Редагування головного заголовка та підзаголовка.
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("leads")}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-blue-300/40 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <span className="text-sm font-semibold text-white">
                Клієнти / Ліди
              </span>
              <span className="mt-2 block text-sm text-slate-400">
                Заявки з карток обʼєктів та сторінок перегляду.
              </span>
            </button>
          </div>
        </section>
      )}

      {activeSection === "homepage" && (
        <form
          id="homepage-content"
          onSubmit={saveHomepageContent}
          className="mb-8 rounded-2xl border border-blue-400/20 bg-white/[0.04] p-6 shadow-2xl shadow-blue-950/10 backdrop-blur-xl"
        >
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-300">
              Контент головної
            </p>
            <h3 className="mt-2 text-2xl font-bold">
              Контент головної сторінки
            </h3>
            <p className="mt-2 text-sm text-white/50">
              Редагуйте тексти головної сторінки без зміни коду.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm text-white/60">Головний заголовок</span>
              <input
                value={homepageContent.heroTitle}
                onChange={(e) =>
                  setHomepageContent({
                    ...homepageContent,
                    heroTitle: e.target.value,
                  })
                }
                className="rounded-2xl border border-white/10 bg-[#030712] px-5 py-4 outline-none transition focus:border-blue-300/50"
              />
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm text-white/60">Підзаголовок</span>
              <textarea
                value={homepageContent.heroSubtitle}
                onChange={(e) =>
                  setHomepageContent({
                    ...homepageContent,
                    heroSubtitle: e.target.value,
                  })
                }
                className="min-h-28 rounded-2xl border border-white/10 bg-[#030712] px-5 py-4 outline-none transition focus:border-blue-300/50"
              />
            </label>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h4 className="text-xl font-bold text-white">
                  Новини ринку нерухомості
                </h4>
                <p className="mt-2 text-sm text-white/50">
                  Додавайте новини для головної сторінки: фото, заголовок,
                  текст, дату та посилання.
                </p>
              </div>

              <button
                type="button"
                onClick={addRealEstateBlock}
                className="rounded-2xl border border-blue-400/40 bg-blue-500/10 px-5 py-3 text-sm font-semibold text-blue-100 transition hover:bg-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                + Додати новину
              </button>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {homepageContent.realEstateBlocks.map((block, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-[#030712]/70 p-4"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-blue-200">
                      Новина {index + 1}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeRealEstateBlock(index)}
                      className="rounded-full border border-red-400/30 px-3 py-2 text-xs font-medium text-red-200 transition hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      Видалити
                    </button>
                  </div>

                  <div className="grid gap-3">
                    <label className="grid gap-2">
                      <span className="text-sm text-white/60">
                        Категорія / бейдж
                      </span>
                      <input
                        value={block.tag}
                        onChange={(e) =>
                          updateRealEstateBlock(index, "tag", e.target.value)
                        }
                        className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none transition focus:border-blue-300/50"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm text-white/60">
                        Заголовок новини
                      </span>
                      <input
                        value={block.title}
                        onChange={(e) =>
                          updateRealEstateBlock(index, "title", e.target.value)
                        }
                        className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none transition focus:border-blue-300/50"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm text-white/60">
                        Текст новини
                      </span>
                      <textarea
                        value={block.text}
                        onChange={(e) =>
                          updateRealEstateBlock(index, "text", e.target.value)
                        }
                        className="min-h-24 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none transition focus:border-blue-300/50"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm text-white/60">Дата</span>
                      <input
                        value={block.date}
                        onChange={(e) =>
                          updateRealEstateBlock(index, "date", e.target.value)
                        }
                        placeholder="25 червня 2026"
                        className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none transition placeholder:text-white/30 focus:border-blue-300/50"
                      />
                    </label>

                    <div className="grid gap-3">
                      <ImageUploader
                        onUploaded={(url) =>
                          updateRealEstateBlock(index, "image", url)
                        }
                      />

                      <label className="grid gap-2">
                        <span className="text-sm text-white/60">
                          Фото новини URL
                        </span>
                        <input
                          value={block.image}
                          onChange={(e) =>
                            updateRealEstateBlock(
                              index,
                              "image",
                              e.target.value
                            )
                          }
                          placeholder="https://..."
                          className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none transition placeholder:text-white/30 focus:border-blue-300/50"
                        />
                      </label>

                      {block.image && (
                        <Image
                          src={block.image}
                          alt={block.title}
                          width={640}
                          height={220}
                          sizes="(min-width: 1280px) 50vw, 100vw"
                          unoptimized
                          className="h-44 w-full rounded-2xl object-cover"
                        />
                      )}
                    </div>

                    <label className="grid gap-2">
                      <span className="text-sm text-white/60">
                        Посилання при натисканні
                      </span>
                      <input
                        value={block.href}
                        onChange={(e) =>
                          updateRealEstateBlock(index, "href", e.target.value)
                        }
                        placeholder="/#objects або https://..."
                        className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none transition placeholder:text-white/30 focus:border-blue-300/50"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
            <button
              type="submit"
              disabled={homepageSaving}
              className="rounded-2xl bg-blue-500 px-6 py-4 font-medium text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {homepageSaving ? "Збереження..." : "Зберегти зміни"}
            </button>

            {homepageMessage && (
              <p className="text-sm text-white/60">{homepageMessage}</p>
            )}
          </div>
        </form>
      )}

      {activeSection === "leads" && (
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-blue-950/10 backdrop-blur-xl">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-blue-300">
                CRM
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Клієнти / Ліди
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Заявки від користувачів, які запросили доступ до ціни та деталей.
              </p>
            </div>

            <button
              type="button"
              onClick={downloadLeadsCsv}
              disabled={leads.length === 0}
              className="w-full rounded-2xl border border-[#b89652]/45 bg-[#b89652]/10 px-5 py-4 text-sm font-semibold text-white shadow-[0_0_22px_rgba(184,150,82,0.14)] transition hover:border-[#d4af37] hover:bg-[#b89652] hover:text-black disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
            >
              Скачати CSV
            </button>
          </div>

          <div className="mb-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
            <input
              type="text"
              placeholder="Пошук: імʼя, телефон, назва обʼєкта..."
              value={leadsSearch}
              onChange={(e) => setLeadsSearch(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#030712] px-5 py-4 outline-none transition placeholder:text-slate-500 focus:border-blue-300/50"
            />

            <button
              type="button"
              onClick={loadLeads}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Оновити
            </button>
          </div>

          {leadsLoading && (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-slate-300">
              Завантажуємо ліди...
            </div>
          )}

          {leadsError && (
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-sm text-red-100">
              {leadsError}
            </div>
          )}

          {leadMessage && !leadsError && (
            <div className="mb-5 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              {leadMessage}
            </div>
          )}

          {!leadsLoading && !leadsError && filteredLeads.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-center">
              <h3 className="text-xl font-bold text-white">
                Лідів поки немає
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Коли користувач залишить контакти перед переглядом ціни, заявка зʼявиться тут.
              </p>
            </div>
          )}

          {!leadsLoading && !leadsError && filteredLeads.length > 0 && (
            <>
              <div className="hidden overflow-hidden rounded-2xl border border-white/10 lg:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-400">
                    <tr>
                      <th className="px-4 py-4">Дата</th>
                      <th className="px-4 py-4">ПІБ</th>
                      <th className="px-4 py-4">Телефон</th>
                      <th className="px-4 py-4">Обʼєкт</th>
                      <th className="px-4 py-4">Джерело</th>
                      <th className="px-4 py-4 text-right">Дії</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="bg-black/20">
                        <td className="px-4 py-4 text-slate-300">
                          {formatLeadDate(lead.created_at)}
                        </td>
                        <td className="px-4 py-4 font-semibold text-white">
                          {lead.full_name}
                        </td>
                        <td className="px-4 py-4 text-[#d8ba68]">
                          {lead.phone}
                        </td>
                        <td className="px-4 py-4 text-slate-300">
                          {lead.property_title || "Не вказано"}
                        </td>
                        <td className="px-4 py-4 text-slate-400">
                          {lead.source || "price_access"}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => deleteLead(lead)}
                            disabled={deletingLeadId === lead.id}
                            className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingLeadId === lead.id
                              ? "Видалення..."
                              : "Видалити"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 lg:hidden">
                {filteredLeads.map((lead) => (
                  <article
                    key={lead.id}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-base font-bold text-white">
                          {lead.full_name}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#d8ba68]">
                          {lead.phone}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-[11px] text-slate-400">
                        {lead.source || "price_access"}
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm text-slate-300">
                      {lead.property_title || "Обʼєкт не вказано"}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {formatLeadDate(lead.created_at)}
                    </p>
                    <button
                      type="button"
                      onClick={() => deleteLead(lead)}
                      disabled={deletingLeadId === lead.id}
                      className="mt-4 w-full rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingLeadId === lead.id
                        ? "Видалення..."
                        : "Видалити"}
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {activeSection === "submissions" && (
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-blue-950/10 backdrop-blur-xl">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-blue-300">
                Пропозиції
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Запропоновані обʼєкти
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Ці заявки не публікуються на сайті та доступні тільки адміністратору.
              </p>
            </div>

            <button
              type="button"
              onClick={downloadSubmissionsCsv}
              disabled={submissions.length === 0}
              className="w-full rounded-2xl border border-[#b89652]/45 bg-[#b89652]/10 px-5 py-4 text-sm font-semibold text-white shadow-[0_0_22px_rgba(184,150,82,0.14)] transition hover:border-[#d4af37] hover:bg-[#b89652] hover:text-black disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
            >
              Скачати CSV
            </button>
          </div>

          <div className="mb-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
            <input
              type="text"
              placeholder="Пошук: ПІБ, телефон, адреса, кадастр..."
              value={submissionsSearch}
              onChange={(e) => setSubmissionsSearch(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#030712] px-5 py-4 outline-none transition placeholder:text-slate-500 focus:border-blue-300/50"
            />

            <select
              value={submissionsStatusFilter}
              onChange={(e) =>
                setSubmissionsStatusFilter(
                  e.target.value as "all" | SubmissionStatus
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-[#030712] px-5 py-4 text-slate-100 outline-none transition focus:border-blue-300/50"
            >
              <option value="all">Всі</option>
              <option value="new">Нові</option>
              <option value="contacted">Звʼязались</option>
              <option value="rejected">Відхилені</option>
              <option value="approved">Схвалені</option>
            </select>

            <button
              type="button"
              onClick={loadSubmissions}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Оновити
            </button>
          </div>

          {submissionsLoading && (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-slate-300">
              Завантажуємо пропозиції...
            </div>
          )}

          {submissionsError && (
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-sm text-red-100">
              {submissionsError}
            </div>
          )}

          {!submissionsLoading &&
            !submissionsError &&
            filteredSubmissions.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-center">
                <h3 className="text-xl font-bold text-white">
                  Пропозицій поки немає
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Коли власник запропонує обʼєкт, заявка зʼявиться тут.
                </p>
              </div>
            )}

          {!submissionsLoading &&
            !submissionsError &&
            filteredSubmissions.length > 0 && (
              <>
                <div className="hidden overflow-hidden rounded-2xl border border-white/10 xl:block">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-400">
                      <tr>
                        <th className="px-4 py-4">Дата</th>
                        <th className="px-4 py-4">ПІБ</th>
                        <th className="px-4 py-4">Телефон</th>
                        <th className="px-4 py-4">Тип</th>
                        <th className="px-4 py-4">Адреса</th>
                        <th className="px-4 py-4">Площа</th>
                        <th className="px-4 py-4">Ціна</th>
                        <th className="px-4 py-4">Кадастр</th>
                        <th className="px-4 py-4">Статус</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredSubmissions.map((submission) => (
                        <tr
                          key={submission.id}
                          onClick={() => setSelectedSubmission(submission)}
                          className="cursor-pointer bg-black/20 transition hover:bg-white/[0.04]"
                        >
                          <td className="px-4 py-4 text-slate-300">
                            {formatLeadDate(submission.created_at)}
                          </td>
                          <td className="px-4 py-4 font-semibold text-white">
                            {submission.full_name}
                          </td>
                          <td className="px-4 py-4 text-[#d8ba68]">
                            {submission.phone}
                          </td>
                          <td className="px-4 py-4 text-slate-300">
                            {submission.property_type}
                          </td>
                          <td className="max-w-[220px] px-4 py-4 text-slate-300">
                            <span className="line-clamp-2">
                              {submission.address}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-slate-300">
                            {submission.area}
                          </td>
                          <td className="px-4 py-4 text-slate-300">
                            {submission.price}
                          </td>
                          <td className="px-4 py-4 text-slate-300">
                            {submission.cadastral_number || "Не вказано"}
                          </td>
                          <td className="px-4 py-4 text-slate-300">
                            {submissionStatusLabels[submission.status]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-3 xl:hidden">
                  {filteredSubmissions.map((submission) => (
                    <button
                      key={submission.id}
                      type="button"
                      onClick={() => setSelectedSubmission(submission)}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-[#b89652]/45"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-base font-bold text-white">
                            {submission.full_name}
                          </p>
                          <p className="mt-1 text-sm text-[#d8ba68]">
                            {submission.phone}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-[11px] text-slate-300">
                          {submissionStatusLabels[submission.status]}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-300">
                        {submission.property_type} · {submission.area} · {submission.price}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                        {submission.address}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        Кадастр: {submission.cadastral_number || "не вказано"}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}

          {selectedSubmission && (
            <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/80 px-4 py-6 backdrop-blur-xl">
              <button
                type="button"
                aria-label="Закрити"
                onClick={() => setSelectedSubmission(null)}
                className="fixed inset-0 cursor-default"
              />

              <div className="relative mx-auto max-w-5xl rounded-3xl border border-[#b89652]/30 bg-[#070707] p-5 text-white shadow-[0_24px_90px_rgba(0,0,0,0.65)]">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#b89652]">
                      Деталі пропозиції
                    </p>
                    <h3 className="mt-2 text-2xl font-black">
                      {selectedSubmission.property_type} · {selectedSubmission.address}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(null)}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
                  <div className="min-w-0">
                    {selectedSubmission.cadastral_photo && (
                      <div className="mb-4 rounded-2xl border border-[#b89652]/30 bg-[#b89652]/10 p-3">
                        <p className="mb-3 text-sm font-semibold text-[#d8ba68]">
                          Кадастрове фото
                        </p>
                        <Image
                          src={selectedSubmission.cadastral_photo}
                          alt="Кадастровий план"
                          width={960}
                          height={520}
                          sizes="(min-width: 1024px) 60vw, 100vw"
                          unoptimized
                          className="h-64 w-full rounded-2xl object-cover"
                        />
                      </div>
                    )}

                    <div className="grid gap-3 sm:grid-cols-2">
                      {selectedSubmission.photos.map((photo, index) => (
                        <Image
                          key={`${photo}-${index}`}
                          src={photo}
                          alt={`Фото пропозиції ${index + 1}`}
                          width={640}
                          height={420}
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          unoptimized
                          className="h-52 w-full rounded-2xl object-cover"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="grid gap-3 text-sm">
                      <p><span className="text-white/45">Дата:</span> {formatLeadDate(selectedSubmission.created_at)}</p>
                      <p><span className="text-white/45">ПІБ:</span> {selectedSubmission.full_name}</p>
                      <p><span className="text-white/45">Телефон:</span> {selectedSubmission.phone}</p>
                      <p><span className="text-white/45">Telegram:</span> {selectedSubmission.telegram || "Не вказано"}</p>
                      <p><span className="text-white/45">Тип:</span> {selectedSubmission.property_type}</p>
                      <p><span className="text-white/45">Площа:</span> {selectedSubmission.area}</p>
                      <p><span className="text-white/45">Ціна:</span> {selectedSubmission.price}</p>
                      <p><span className="text-white/45">Email:</span> {selectedSubmission.email || "Не вказано"}</p>
                      <p><span className="text-white/45">Кадастр:</span> {selectedSubmission.cadastral_number || "Не вказано"}</p>
                      <p><span className="text-white/45">Опис:</span> {selectedSubmission.description || "Не вказано"}</p>
                    </div>

                    <div className="mt-5 grid gap-2">
                      <a
                        href={`tel:${selectedSubmission.phone}`}
                        className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#b89652]/45 bg-[#b89652]/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#b89652] hover:text-black"
                      >
                        Зателефонувати
                      </a>
                      {selectedSubmission.telegram && (
                        <a
                          href={`https://t.me/${selectedSubmission.telegram.replace(/^@/, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#b89652]/45 hover:text-[#d8ba68]"
                        >
                          Відкрити Telegram
                        </a>
                      )}

                      <select
                        value={selectedSubmission.status}
                        onChange={(e) =>
                          updateSubmissionStatus(
                            selectedSubmission.id,
                            e.target.value as SubmissionStatus
                          )
                        }
                        className="min-h-11 rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
                      >
                        <option value="new">Нові</option>
                        <option value="contacted">Звʼязались</option>
                        <option value="rejected">Відхилені</option>
                        <option value="approved">Схвалені</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {activeSection === "objects" && (
        <>
        {showForm && (
          <form
            onSubmit={editingId ? updateProperty : addProperty}
            className="mb-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-blue-950/10 backdrop-blur-xl"
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
                {propertyTypeOptions.map((type) => (
                  <option key={type}>{type}</option>
                ))}
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
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-left text-white/70 transition hover:bg-white hover:text-black md:col-span-2"
                >
                <RouteIcon />
                Знайти координати по адресі
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
                      <Image
                        key={image}
                        src={image}
                        alt="Gallery preview"
                        width={320}
                        height={112}
                        sizes="(min-width: 768px) 25vw, 100vw"
                        unoptimized
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

        <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-blue-950/10 backdrop-blur-xl">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-blue-300">
                Каталог
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">Обʼєкти</h2>
              <p className="mt-2 text-sm text-slate-400">
                Список усіх обʼєктів нерухомості
              </p>
            </div>

            <button
              type="button"
              onClick={startNewProperty}
              className="w-full rounded-2xl bg-blue-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400 lg:w-auto"
            >
              + Додати обʼєкт
            </button>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              label="Всі обʼєкти"
              value={properties.length}
              helper="Усі записи з адмінської бази"
            />
            <AdminStatCard
              label="Активні"
              value={activeCount}
              helper="Показуються на сайті"
            />
            <AdminStatCard
              label="Неактивні"
              value={inactiveCount}
              helper="Інші статуси"
            />
            <AdminStatCard
              label="Видалені або архівні"
              value={archivedCount}
              helper="Якщо є така логіка"
            />
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
            <input
              type="text"
              placeholder="Пошук: назва, адреса, тип..."
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#030712] px-5 py-4 outline-none transition placeholder:text-slate-500 focus:border-blue-300/50"
            />

            <select
              value={adminTypeFilter}
              onChange={(e) => setAdminTypeFilter(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#030712] px-5 py-4 text-slate-100 outline-none transition focus:border-blue-300/50"
            >
              <option>Всі типи</option>
              {adminTypeOptions.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            <select
              value={adminStatusFilter}
              onChange={(e) => setAdminStatusFilter(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#030712] px-5 py-4 text-slate-100 outline-none transition focus:border-blue-300/50"
            >
              <option>Всі статуси</option>
              {adminStatusOptions.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
        </section>

        <AdminObjectsTable
          properties={filteredAdminProperties}
          totalCount={properties.length}
          loading={loading}
          error={loadError}
          onRetry={loadProperties}
          onAddFirst={startNewProperty}
          onEdit={startEdit}
          onStatusChange={changeStatus}
          onCopy={copyPropertyLink}
          onDelete={deleteProperty}
        />
        </>
      )}
    </AdminLayout>
  );
}
