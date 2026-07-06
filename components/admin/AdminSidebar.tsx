type AdminSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  activeSection: "overview" | "objects" | "homepage" | "leads";
  onSectionChange: (section: "overview" | "objects" | "homepage" | "leads") => void;
};

const navItems = [
  { id: "overview" as const, label: "Огляд", short: "О" },
  { id: "objects" as const, label: "Об'єкти", short: "ОБ" },
  { id: "leads" as const, label: "Клієнти / Ліди", short: "Л" },
  { id: "homepage" as const, label: "Контент головної", short: "К" },
];

export default function AdminSidebar({
  isOpen,
  onClose,
  activeSection,
  onSectionChange,
}: AdminSidebarProps) {
  return (
    <>
      <button
        type="button"
        aria-label="Закрити меню"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/60 transition md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-[#07111f]/95 p-4 shadow-2xl shadow-blue-950/30 backdrop-blur-xl transition-transform duration-300 md:w-24 md:translate-x-0 lg:w-72 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-500 text-sm font-bold text-white shadow-lg shadow-blue-500/25">
            RM
          </div>
          <div className="min-w-0 md:hidden lg:block">
            <p className="text-sm font-semibold text-white">OrendaRM</p>
            <p className="text-xs text-slate-400">Адмін-панель</p>
          </div>
        </div>

        <nav className="mt-6 grid gap-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                onSectionChange(item.id);
                onClose();
              }}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                activeSection === item.id
                  ? "border-blue-400/30 bg-blue-500/15 text-blue-100"
                  : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white"
              }`}
              aria-current={activeSection === item.id ? "page" : undefined}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/5 text-xs font-bold">
                {item.short}
              </span>
              <span className="md:hidden lg:inline">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-slate-400 md:hidden lg:block">
          <p className="font-medium text-slate-200">Панель керування</p>
          <p className="mt-2 leading-5">
            Обʼєкти, статуси, контент головної сторінки та швидкі дії.
          </p>
        </div>
      </aside>
    </>
  );
}
