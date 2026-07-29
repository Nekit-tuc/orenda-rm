"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ClientLead, ClientLeadStatus } from "@/types/clientLead";

const statusLabels: Record<ClientLeadStatus, string> = {
  new: "Нова",
  in_progress: "В роботі",
  contacted: "Зв’язались",
  closed: "Закрита",
  spam: "Спам",
};

const statusOptions = Object.keys(statusLabels) as ClientLeadStatus[];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getLeadObjectUrl(lead: ClientLead) {
  if (lead.property_slug) {
    return `/objects/${lead.property_slug}`;
  }

  if (lead.property_id) {
    return `/objects/${lead.property_id}`;
  }

  return null;
}

export default function ClientLeadsAdmin() {
  const [leads, setLeads] = useState<ClientLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ClientLeadStatus>(
    "all"
  );
  const [dateFilter, setDateFilter] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadLeads() {
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/client-leads", {
      cache: "no-store",
    });
    const result = (await response.json().catch(() => null)) as {
      ok?: boolean;
      leads?: ClientLead[];
      message?: string;
    } | null;

    setLoading(false);

    if (!response.ok || !result?.ok) {
      setError(result?.message || "Не вдалося завантажити заявки.");
      return;
    }

    setLeads(result.leads || []);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadLeads();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const filteredLeads = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        !searchValue ||
        lead.client_name.toLowerCase().includes(searchValue) ||
        lead.phone.toLowerCase().includes(searchValue);
      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;
      const matchesDate =
        !dateFilter || lead.created_at.slice(0, 10) === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [dateFilter, leads, search, statusFilter]);

  async function updateLead(
    lead: ClientLead,
    changes: Partial<Pick<ClientLead, "status" | "admin_note">>
  ) {
    setSavingId(lead.id);
    setMessage("");
    setError("");

    const response = await fetch("/api/admin/client-leads", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: lead.id,
        status: changes.status,
        admin_note: changes.admin_note,
      }),
    });
    const result = (await response.json().catch(() => null)) as {
      ok?: boolean;
      message?: string;
    } | null;

    setSavingId(null);

    if (!response.ok || !result?.ok) {
      setError(result?.message || "Не вдалося оновити заявку.");
      return;
    }

    setLeads((current) =>
      current.map((item) =>
        item.id === lead.id
          ? {
              ...item,
              ...changes,
            }
          : item
      )
    );
    setMessage("Заявку оновлено.");
  }

  async function deleteLead(lead: ClientLead) {
    if (!window.confirm("Ви точно хочете видалити цю заявку клієнта?")) {
      return;
    }

    setSavingId(lead.id);
    setMessage("");
    setError("");

    const response = await fetch(`/api/admin/client-leads/${lead.id}`, {
      method: "DELETE",
    });
    const result = (await response.json().catch(() => null)) as {
      ok?: boolean;
      message?: string;
    } | null;

    setSavingId(null);

    if (!response.ok || !result?.ok) {
      setError(result?.message || "Не вдалося видалити заявку.");
      return;
    }

    setLeads((current) => current.filter((item) => item.id !== lead.id));
    setMessage("Заявку видалено.");
  }

  const newLeadsCount = leads.filter((lead) => lead.status === "new").length;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-blue-950/20 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.28em] text-blue-300">
          Investal Estate Admin
        </p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white md:text-4xl">
              Заявки клієнтів
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Заявки з форми “Залишити заявку на дзвінок” на сторінках
              об’єктів.
            </p>
          </div>
          <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
            Нові заявки: <span className="font-bold">{newLeadsCount}</span>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-blue-950/10 backdrop-blur-xl sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_190px_auto]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Пошук за ім’ям або телефоном"
            className="rounded-2xl border border-white/10 bg-[#030712] px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-blue-300/60"
          />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | ClientLeadStatus)
            }
            className="rounded-2xl border border-white/10 bg-[#030712] px-4 py-3 text-sm outline-none focus:border-blue-300/60"
          >
            <option value="all">Всі статуси</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-2xl border border-white/10 bg-[#030712] px-4 py-3 text-sm outline-none focus:border-blue-300/60"
          />
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setDateFilter("");
            }}
            className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-blue-300/50 hover:text-blue-100"
          >
            Скинути
          </button>
        </div>

        {message && <p className="mt-4 text-sm text-blue-200">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-blue-950/10 backdrop-blur-xl">
        {loading ? (
          <p className="p-5 text-sm text-slate-400">Завантаження заявок...</p>
        ) : filteredLeads.length === 0 ? (
          <p className="p-5 text-sm text-slate-400">Заявок поки немає.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-4 py-4">Дата і час</th>
                  <th className="px-4 py-4">Статус</th>
                  <th className="px-4 py-4">Ім’я</th>
                  <th className="px-4 py-4">Телефон</th>
                  <th className="px-4 py-4">Об’єкт</th>
                  <th className="px-4 py-4">Джерело</th>
                  <th className="px-4 py-4">Нотатка</th>
                  <th className="px-4 py-4">Дії</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredLeads.map((lead) => {
                  const objectUrl = getLeadObjectUrl(lead);

                  return (
                    <tr key={lead.id} className="align-top text-slate-200">
                      <td className="px-4 py-4 text-slate-400">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={lead.status}
                          disabled={savingId === lead.id}
                          onChange={(e) =>
                            void updateLead(lead, {
                              status: e.target.value as ClientLeadStatus,
                            })
                          }
                          className="rounded-xl border border-white/10 bg-[#030712] px-3 py-2 text-xs outline-none focus:border-blue-300/60"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {statusLabels[status]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 font-medium text-white">
                        {lead.client_name}
                      </td>
                      <td className="px-4 py-4">
                        <a
                          href={`tel:${lead.phone}`}
                          className="text-blue-200 transition hover:text-blue-100"
                        >
                          {lead.phone}
                        </a>
                      </td>
                      <td className="max-w-[220px] px-4 py-4">
                        {objectUrl ? (
                          <Link
                            href={objectUrl}
                            target="_blank"
                            className="line-clamp-2 text-blue-200 transition hover:text-blue-100"
                          >
                            {lead.property_title || `Об’єкт #${lead.property_id}`}
                          </Link>
                        ) : (
                          <span className="text-slate-500">Не вказано</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-slate-400">{lead.source}</td>
                      <td className="px-4 py-4">
                        <textarea
                          defaultValue={lead.admin_note || ""}
                          rows={2}
                          disabled={savingId === lead.id}
                          onBlur={(e) =>
                            void updateLead(lead, {
                              admin_note: e.target.value,
                            })
                          }
                          placeholder="Нотатка адміністратора"
                          className="w-56 resize-none rounded-xl border border-white/10 bg-[#030712] px-3 py-2 text-xs outline-none placeholder:text-slate-600 focus:border-blue-300/60"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          {objectUrl && (
                            <Link
                              href={objectUrl}
                              target="_blank"
                              className="rounded-xl border border-white/10 px-3 py-2 text-center text-xs transition hover:border-blue-300/50 hover:text-blue-100"
                            >
                              Відкрити об’єкт
                            </Link>
                          )}
                          <a
                            href={`tel:${lead.phone}`}
                            className="rounded-xl border border-white/10 px-3 py-2 text-center text-xs transition hover:border-blue-300/50 hover:text-blue-100"
                          >
                            Зателефонувати
                          </a>
                          <button
                            type="button"
                            disabled={savingId === lead.id}
                            onClick={() => void deleteLead(lead)}
                            className="rounded-xl border border-red-400/30 px-3 py-2 text-xs text-red-200 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Видалити
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
