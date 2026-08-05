import { cookies } from "next/headers";
import { runtimeEnv } from "@/server/config/runtime-env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getAccessToken(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return (
    cookieStore.get("access_token")?.value ||
    cookieStore.get("cbd_atkn_91f2a")?.value ||
    null
  );
}

export async function GET() {
  const cookieStore = await cookies();
  const token = getAccessToken(cookieStore);

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const upstream = await fetch(`${runtimeEnv.backendBaseUrl}/notifications/stream`, {
    headers: {
      Authorization: token,
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
    },
    cache: "no-store",
  });

  if (!upstream.ok || !upstream.body) {
    return new Response("Failed to connect notification stream", {
      status: upstream.status || 502,
    });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
