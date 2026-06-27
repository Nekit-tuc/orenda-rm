import Image from "next/image";
import { getPropertySlug } from "@/lib/getPropertySlug";
import { formatArea } from "@/lib/formatArea";
import type { Property } from "@/types/property";

type AdminObjectsTableProps = {
  properties: Property[];
  totalCount: number;
  loading: boolean;
  error?: string;
  onRetry: () => void;
  onAddFirst: () => void;
  onEdit: (property: Property) => void;
  onStatusChange: (id: number, status: string) => void;
  onCopy: (property: Property) => void;
  onDelete: (id: number) => void;
};

const statusOptions = ["Активний", "Чернетка", "Здано"];

function AdminIcon({ type }: { type: "edit" | "open" | "copy" | "delete" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]"
    >
      {type === "edit" && (
        <>
          <path d="M4 20h4l10.5-10.5-4-4L4 16v4Z" />
          <path d="m13.5 6.5 4 4M15 5l1.3-1.3a1.7 1.7 0 0 1 2.4 0l1.6 1.6a1.7 1.7 0 0 1 0 2.4L19 9" />
        </>
      )}
      {type === "open" && (
        <>
          <path d="M14 4h6v6M20 4l-9 9" />
          <path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" />
        </>
      )}
      {type === "copy" && (
        <>
          <rect x="8" y="8" width="11" height="11" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
        </>
      )}
      {type === "delete" && (
        <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
      )}
    </svg>
  );
}
function ActionButtons({
  property,
  onEdit,
  onCopy,
  onDelete,
}: {
  property: Property;
  onEdit: (property: Property) => void;
  onCopy: (property: Property) => void;
  onDelete: (id: number) => void;
}) {
  const buttonClass =
    "grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-sm text-slate-200 transition hover:border-blue-300/40 hover:bg-blue-500/15 hover:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300";
  const propertySlug = getPropertySlug(property);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        title="Редагувати"
        aria-label="Редагувати"
        onClick={() => onEdit(property)}
        className={buttonClass}
      >
        <AdminIcon type="edit" />
      </button>

      <a
        href={`/objects/${propertySlug}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Відкрити"
        aria-label="Відкрити"
        className={buttonClass}
      >
        <AdminIcon type="open" />
      </a>

      <button
        type="button"
        title="Копіювати"
        aria-label="Копіювати"
        onClick={() => onCopy(property)}
        className={buttonClass}
      >
        <AdminIcon type="copy" />
      </button>

      <button
        type="button"
        title="Видалити"
        aria-label="Видалити"
        onClick={() => onDelete(property.id)}
        className="grid h-10 w-10 place-items-center rounded-xl border border-red-400/30 bg-red-500/10 text-sm text-red-200 transition hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-300"
      >
        <AdminIcon type="delete" />
      </button>
    </div>
  );
}

function StatusSelect({
  property,
  onStatusChange,
}: {
  property: Property;
  onStatusChange: (id: number, status: string) => void;
}) {
  return (
    <select
      value={property.status}
      onChange={(e) => onStatusChange(property.id, e.target.value)}
      className="w-full rounded-xl border border-blue-300/20 bg-[#030712] px-3 py-2 text-xs text-blue-100 outline-none transition focus:border-blue-300/60 focus:ring-2 focus:ring-blue-300/30 sm:w-auto"
    >
      {statusOptions.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}

export default function AdminObjectsTable({
  properties,
  totalCount,
  loading,
  error,
  onRetry,
  onAddFirst,
  onEdit,
  onStatusChange,
  onCopy,
  onDelete,
}: AdminObjectsTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center text-slate-300 backdrop-blur-xl sm:p-10">
        <div className="mx-auto h-10 w-10 animate-pulse rounded-full border border-blue-300/40 bg-blue-500/20" />
        <p className="mt-4 text-sm font-medium">Завантаження обʼєктів...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-6 text-center text-red-100 backdrop-blur-xl sm:p-10">
        <p className="text-lg font-semibold">Помилка завантаження</p>
        <p className="mx-auto mt-2 max-w-xl text-sm text-red-100/70">
          {error}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-2xl border border-red-200/30 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          Спробувати ще раз
        </button>
      </div>
    );
  }

  if (properties.length === 0) {
    if (totalCount === 0) {
      return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center text-slate-300 backdrop-blur-xl sm:p-10">
          <p className="text-xl font-semibold text-white">
            Обʼєктів поки немає
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
            Додайте перший обʼєкт, щоб він зʼявився в адмінці та каталозі.
          </p>
          <button
            type="button"
            onClick={onAddFirst}
            className="mt-5 w-full rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 sm:w-auto"
          >
            Додати перший обʼєкт
          </button>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-10 text-center text-slate-400 backdrop-blur-xl">
        Обʼєкти не знайдено.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] shadow-2xl shadow-blue-950/20 backdrop-blur-xl lg:block">
        <table className="w-full table-fixed border-collapse">
          <thead className="border-b border-white/10 bg-white/[0.04] text-left text-sm text-slate-400">
            <tr>
              <th className="w-[34%] px-5 py-4 font-medium">Обʼєкт</th>
              <th className="w-[13%] px-5 py-4 font-medium">Тип</th>
              <th className="w-[17%] px-5 py-4 font-medium">Ціна</th>
              <th className="w-[11%] px-5 py-4 font-medium">Площа</th>
              <th className="w-[13%] px-5 py-4 font-medium">Статус</th>
              <th className="w-[12%] px-5 py-4 font-medium">Дії</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {properties.map((property) => (
              <tr key={property.id} className="align-middle">
                <td className="px-5 py-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <Image
                      src={property.image}
                      alt={property.title}
                      width={88}
                      height={68}
                      sizes="88px"
                      unoptimized
                      className="h-16 w-20 shrink-0 rounded-2xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="line-clamp-2 break-words font-semibold text-white">
                        {property.title}
                      </p>
                      <p className="mt-1 line-clamp-1 break-words text-sm text-slate-400">
                        {property.address}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-slate-300">
                  <p className="line-clamp-2 break-words">
                    {property.type} / {property.deal_type}
                  </p>
                </td>

                <td className="px-5 py-4 text-sm font-medium text-white">
                  <p className="line-clamp-2 break-words">
                    {property.price_total}
                  </p>
                </td>

                <td className="px-5 py-4 text-sm text-slate-300">
                  <p className="break-words">{formatArea(property.area)}</p>
                </td>

                <td className="px-5 py-4">
                  <StatusSelect
                    property={property}
                    onStatusChange={onStatusChange}
                  />
                </td>

                <td className="px-5 py-4">
                  <ActionButtons
                    property={property}
                    onEdit={onEdit}
                    onCopy={onCopy}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {properties.map((property) => (
          <article
            key={property.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-blue-950/10 backdrop-blur-xl"
          >
            <div className="relative aspect-[16/10] w-full bg-slate-900 min-[390px]:aspect-[16/9]">
              <Image
                src={property.image}
                alt={property.title}
                fill
                sizes="100vw"
                unoptimized
                className="object-cover"
              />
            </div>

            <div className="grid gap-4 p-4 min-[390px]:p-5">
              <div className="min-w-0">
                <h3 className="line-clamp-2 break-words text-lg font-semibold leading-snug text-white">
                  {property.title}
                </h3>
                <p className="mt-2 line-clamp-2 break-words text-sm leading-5 text-slate-400">
                  {property.address}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 min-[375px]:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#030712]/70 p-3">
                  <p className="text-xs text-slate-500">Ціна</p>
                  <p className="mt-1 line-clamp-2 break-words text-sm font-semibold text-white">
                    {property.price_total}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#030712]/70 p-3">
                  <p className="text-xs text-slate-500">Площа</p>
                  <p className="mt-1 break-words text-sm font-semibold text-white">
                    {formatArea(property.area)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#030712]/70 p-3">
                  <p className="text-xs text-slate-500">Тип</p>
                  <p className="mt-1 line-clamp-2 break-words text-sm font-semibold text-white">
                    {property.type} / {property.deal_type}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#030712]/70 p-3">
                  <p className="text-xs text-slate-500">Статус</p>
                  <div className="mt-2">
                    <StatusSelect
                      property={property}
                      onStatusChange={onStatusChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2 border-t border-white/10 pt-4 min-[320px]:justify-start">
                <ActionButtons
                  property={property}
                  onEdit={onEdit}
                  onCopy={onCopy}
                  onDelete={onDelete}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
