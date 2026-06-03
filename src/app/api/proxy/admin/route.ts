import { NextResponse } from "next/server";
import { asyncHandler } from "@/server/middleware/async-handler";
import { proxyToBackend } from "@/server/services/proxy-client";

export const GET = asyncHandler(async (req: Request) => {
  const requestUrl = new URL(req.url);
  const proxySuffix = requestUrl.pathname.split("/proxy/admin")[1] || "";
  const backendPath = `/admin${proxySuffix}`;

  const { data, status } = await proxyToBackend({
    path: backendPath,
    method: "GET",
    query: Object.fromEntries(requestUrl.searchParams.entries()),
  });

  return NextResponse.json(data, { status });
});