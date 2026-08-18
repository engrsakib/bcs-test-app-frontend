import { NextResponse } from "next/server";
import { asyncHandler } from "@/server/middleware/async-handler";
import { proxyToBackend } from "@/server/services/proxy-client";

export const GET = asyncHandler(async (req: Request) => {
  const requestUrl = new URL(req.url);

  const { data, status } = await proxyToBackend({
    path: "/sms/logs",
    method: "GET",
    query: Object.fromEntries(requestUrl.searchParams.entries()),
  });

  return NextResponse.json(data, { status });
});
