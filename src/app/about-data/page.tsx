import type { Metadata } from "next";

import { DataTransparencyPage } from "@/components/DataTransparencyPage";

export const metadata: Metadata = {
  title: "About the data",
  description:
    "How Wolves History sources live NBA.com stats, uses caches and tags, and maintains editorial JSON and longreads.",
};

export default function AboutDataPage() {
  return <DataTransparencyPage />;
}
