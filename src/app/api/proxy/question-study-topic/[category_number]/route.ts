import { NextResponse } from "next/server";
import { asyncHandler } from "@/server/middleware/async-handler";
import { proxyToBackend } from "@/server/services/proxy-client";

type RouteContext = {
  params: Promise<{ category_number: string }>;
};

export const GET = asyncHandler<RouteContext>(async (_req, context) => {
  const { category_number } = await context!.params;

  const { data, status } = await proxyToBackend({
    path: `/question-study-topic/${category_number}`,
    method: "GET",
  });

  return NextResponse.json(data, { status });
});

export const PATCH = asyncHandler<RouteContext>(async (req, context) => {
  const { category_number } = await context!.params;
  const body = await req.json();

  const { data, status } = await proxyToBackend({
    path: `/question-study-topic/${category_number}`,
    method: "PATCH",
    body,
  });

  return NextResponse.json(data, { status });
});

export const DELETE = asyncHandler<RouteContext>(async (_req, context) => {
  const { category_number } = await context!.params;

  const { data, status } = await proxyToBackend({
    path: `/question-study-topic/${category_number}`,
    method: "DELETE",
  });

  return NextResponse.json(data, { status });
});
