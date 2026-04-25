import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DataTransparencyPage } from "@/components/DataTransparencyPage";
import { isAdminRequest } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Admin",
  description: "Restricted Wolves History data-source and cache documentation.",
};

export default async function AdminPage() {
  if (!(await isAdminRequest())) notFound();

  return <DataTransparencyPage />;
}
