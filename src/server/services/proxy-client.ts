import { cookies } from "next/headers";
import { runtimeEnv } from "@/server/config/runtime-env";
import { ApiError } from "@/server/errors/api-error";

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type ProxyRequestOptions = {
  path: string;
  method: Method;
  body?: unknown;
  query?: Record<string, string | null | undefined>;
};

const buildUrl = (
  baseUrl: string,
  path: string,
  query?: Record<string, string | null | undefined>
) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${baseUrl}${cleanPath}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value) {
        url.searchParams.set(key, value);
      }
    }
  }

  return url.toString();
};

export async function proxyToBackend<T = unknown>({
  path,
  method,
  body,
  query,
}: ProxyRequestOptions): Promise<{ data: T; status: number }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new ApiError(401, "Unauthorized. Missing access token.");
  }

  const backendUrl = buildUrl(runtimeEnv.backendBaseUrl, path, query);

  const response = await fetch(backendUrl, {
    method,
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  const data = await response.json().catch(() => {
    throw new ApiError(
      502,
      "Invalid response received from upstream service."
    );
  });

  return {
    data,
    status: response.status,
  };
}
