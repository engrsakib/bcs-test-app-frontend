import { NextResponse } from "next/server";
import { asyncHandler } from "@/server/middleware/async-handler";
import { proxyToBackend } from "@/server/services/proxy-client";

export const GET = asyncHandler(async (req: Request) => {
  const requestUrl = new URL(req.url);

  const { data, status } = await proxyToBackend({
    path: "/guideline",
    method: "GET",
    query: Object.fromEntries(requestUrl.searchParams.entries()),
  });

  return NextResponse.json(data, { status });
});

export const POST = asyncHandler(async (req: Request) => {
  const body = await req.json();

  const { data, status } = await proxyToBackend({
    path: "/guideline",
    method: "POST",
    body,
  });

  return NextResponse.json(data, { status });
});
