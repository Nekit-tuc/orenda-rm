"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import ClientLeadsAdmin from "@/components/admin/ClientLeadsAdmin";
import type { AdminSection } from "@/components/admin/AdminSidebar";

export default function AdminLeadsShell() {
  function handleSectionChange(section: AdminSection) {
    if (section !== "clientLeads") {
      window.location.href = "/admin";
    }
  }

  return (
    <AdminLayout
      activeSection="clientLeads"
      onSectionChange={handleSectionChange}
    >
      <ClientLeadsAdmin />
    </AdminLayout>
  );
}
