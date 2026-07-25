import { NextResponse } from "next/server";
import { asyncHandler } from "@/server/middleware/async-handler";
import { proxyToBackend } from "@/server/services/proxy-client";

export const PATCH = asyncHandler(async (req: Request) => {
  const body = await req.json();

  const { data, status } = await proxyToBackend({
    path: "/youtube/reorder",
    method: "PATCH",
    body,
  });

  return NextResponse.json(data, { status });
});
