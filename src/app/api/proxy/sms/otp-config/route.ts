import { NextResponse } from "next/server";
import { asyncHandler } from "@/server/middleware/async-handler";
import { proxyToBackend } from "@/server/services/proxy-client";

export const GET = asyncHandler(async () => {
  const { data, status } = await proxyToBackend({
    path: "/sms/otp-config",
    method: "GET",
  });

  return NextResponse.json(data, { status });
});

export const PATCH = asyncHandler(async (req: Request) => {
  const body = await req.json();

  const { data, status } = await proxyToBackend({
    path: "/sms/otp-config",
    method: "PATCH",
    body,
  });

  return NextResponse.json(data, { status });
});
