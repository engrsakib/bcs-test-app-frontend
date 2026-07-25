import { NextResponse } from "next/server";
import { asyncHandler } from "@/server/middleware/async-handler";
import { proxyToBackend } from "@/server/services/proxy-client";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = asyncHandler<RouteContext>(async (_req, context) => {
  const { id } = await context!.params;

  const { data, status } = await proxyToBackend({
    path: `/books/${id}`,
    method: "GET",
  });

  return NextResponse.json(data, { status });
});

export const PUT = asyncHandler<RouteContext>(async (req, context) => {
  const { id } = await context!.params;
  const body = await req.json();

  const { data, status } = await proxyToBackend({
    path: `/books/${id}`,
    method: "PUT",
    body,
  });

  return NextResponse.json(data, { status });
});

export const PATCH = asyncHandler<RouteContext>(async (_req, context) => {
  const { id } = await context!.params;

  const { data, status } = await proxyToBackend({
    path: `/books/${id}`,
    method: "PATCH",
  });

  return NextResponse.json(data, { status });
});

export const DELETE = asyncHandler<RouteContext>(async (_req, context) => {
  const { id } = await context!.params;

  const { data, status } = await proxyToBackend({
    path: `/books/${id}`,
    method: "DELETE",
  });

  return NextResponse.json(data, { status });
});
