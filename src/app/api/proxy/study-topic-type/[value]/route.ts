import { NextResponse } from "next/server";
import { asyncHandler } from "@/server/middleware/async-handler";
import { proxyToBackend } from "@/server/services/proxy-client";

type RouteContext = {
  params: Promise<{ value: string }>;
};

export const DELETE = asyncHandler<RouteContext>(async (_req, context) => {
  const { value } = await context!.params;

  const { data, status } = await proxyToBackend({
    path: `/study-topic-type/${encodeURIComponent(value)}`,
    method: "DELETE",
  });

  return NextResponse.json(data, { status });
});
