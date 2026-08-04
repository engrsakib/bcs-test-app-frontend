import { NextResponse } from "next/server";
import { asyncHandler } from "@/server/middleware/async-handler";
import { proxyToBackend } from "@/server/services/proxy-client";

export const GET = asyncHandler(async () => {
  const { data, status } = await proxyToBackend({
    path: "/question-study-topic/dropdown",
    method: "GET",
  });

  return NextResponse.json(data, { status });
});
