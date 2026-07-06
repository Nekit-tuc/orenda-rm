"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

type AdminLayoutProps = {
  children: React.ReactNode;
  activeSection: "overview" | "objects" | "homepage" | "leads" | "submissions";
  onSectionChange: (section: "overview" | "objects" | "homepage" | "leads" | "submissions") => void;
};

export default function AdminLayout({
  children,
  activeSection,
  onSectionChange,
}: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#030712] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12rem] top-[-10rem] h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-[-14rem] right-[-10rem] h-[28rem] w-[28rem] rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
      />

      <div className="relative md:pl-24 lg:pl-72">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#030712]/85 px-4 py-3 backdrop-blur-xl md:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-2xl border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-100 transition hover:bg-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Меню
          </button>
          <p className="text-sm font-semibold text-white">OrendaRM Admin</p>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </div>
    </main>
  );
}
