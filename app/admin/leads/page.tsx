import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLeadsShell from "@/components/admin/AdminLeadsShell";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminClientLeadsPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("investal-admin-session")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  return <AdminLeadsShell />;
}
