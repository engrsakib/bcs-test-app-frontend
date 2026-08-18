import { NextResponse } from "next/server";
import { asyncHandler } from "@/server/middleware/async-handler";
import { proxyToBackend } from "@/server/services/proxy-client";

export const GET = asyncHandler(async () => {
  const { data, status } = await proxyToBackend({
    path: "/sms/otp-blocks",
    method: "GET",
  });

  return NextResponse.json(data, { status });
});

export const DELETE = asyncHandler(async (req: Request) => {
  const body = await req.json();

  const { data, status } = await proxyToBackend({
    path: "/sms/otp-blocks",
    method: "DELETE",
    body,
  });

  return NextResponse.json(data, { status });
});
