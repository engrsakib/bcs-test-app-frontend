import { NextResponse } from "next/server";
import { asyncHandler } from "@/server/middleware/async-handler";
import { proxyToBackend } from "@/server/services/proxy-client";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = asyncHandler<RouteContext>(async (_req, context) => {
  const { id } = await context!.params;

  const { data, status } = await proxyToBackend({
    path: `/notifications/campaigns/${id}`,
    method: "GET",
  });

  return NextResponse.json(data, { status });
});
