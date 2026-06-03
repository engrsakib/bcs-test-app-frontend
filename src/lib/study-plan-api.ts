const PROXY_BASE = "/api/proxy/study-plan";

type ProxyResult<T> = {
  ok: boolean;
  status: number;
  data: T;
};

export async function studyPlanProxy<T = unknown>(
  suffix = "",
  options: RequestInit = {}
): Promise<ProxyResult<T>> {
  const path = suffix.startsWith("?")
    ? suffix
    : suffix
      ? suffix.startsWith("/")
        ? suffix
        : `/${suffix}`
      : "";

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const res = await fetch(`${PROXY_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  const data = (await res.json().catch(() => ({}))) as T;

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
}
