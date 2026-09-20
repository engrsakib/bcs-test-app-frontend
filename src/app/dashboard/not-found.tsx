import type { Metadata } from "next";

import { NotFoundView } from "@/components/ui/not-found-view";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function DashboardNotFound() {
  return <NotFoundView compact />;
}
