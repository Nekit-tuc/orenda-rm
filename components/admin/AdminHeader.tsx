import Link from "next/link";

type AdminHeaderProps = {
  onLogout: () => void;
};

export default function AdminHeader({
  onLogout,
}: AdminHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-blue-950/20 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.28em] text-blue-300">
          Адмін-панель
        </p>
        <h1 className="mt-3 break-words text-3xl font-bold text-white md:text-4xl">
          Керування обʼєктами
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Дані зберігаються в Supabase. Функції керування залишились без змін.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/"
          className="rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-medium text-slate-200 transition hover:border-blue-300/50 hover:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          На сайт
        </Link>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-2xl border border-red-400/30 px-5 py-3 text-sm font-medium text-red-200 transition hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          Вийти
        </button>
      </div>
    </header>
  );
}
