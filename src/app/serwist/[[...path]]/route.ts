import { spawnSync } from "node:child_process";
import type { NextRequest } from "next/server";
import { createSerwistRoute } from "@serwist/turbopack";

const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout?.trim() ||
  crypto.randomUUID();

const serwistRoute = createSerwistRoute({
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
  swSrc: "src/app/sw.ts",
  useNativeEsbuild: true,
});

export const { dynamic, dynamicParams, revalidate } = serwistRoute;

export async function generateStaticParams() {
  const entries = await serwistRoute.generateStaticParams();

  return entries.map(({ path }: { path: string }) => ({
    path: path ? path.split("/").filter(Boolean) : [],
  }));
}

type SerwistRouteContext = {
  params: Promise<{ path?: string[] }>;
};

export async function GET(request: NextRequest, context: SerwistRouteContext) {
  const { path: pathSegments } = await context.params;
  const path = pathSegments?.join("/") ?? "";

  return serwistRoute.GET(request, {
    params: Promise.resolve({ path }),
  });
}
