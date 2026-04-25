import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { isAdminRequest } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Admin data",
  description: "Restricted data-source and cache documentation for Wolves History.",
};

export default async function AboutDataPage() {
  if (!(await isAdminRequest())) notFound();

  redirect("/admin");
}
