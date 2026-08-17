import { NextResponse } from "next/server";
import { asyncHandler } from "@/server/middleware/async-handler";
import { proxyToBackend } from "@/server/services/proxy-client";

export const POST = asyncHandler(async (req: Request) => {
  const body = await req.json();

  const { data, status } = await proxyToBackend({
    path: "/sms/test",
    method: "POST",
    body,
  });

  return NextResponse.json(data, { status });
});
