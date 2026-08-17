const PROXY_BASE = "/api/proxy/sms";

type ProxyResult<T> = {
  ok: boolean;
  status: number;
  data: T;
};

export type SmsApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

export type SmsBalanceData = {
  response_code: number;
  success: boolean;
  success_message: string;
  error_message: string;
  balance?: number;
};

export type SmsStatusData = {
  connected: boolean;
  balance: number | null;
  sender_id: string;
  provider: string;
  base_url: string;
  last_checked_at: string;
  response_code: number | null;
  message: string;
  error_codes: Record<string, string>;
};

export type SmsTestResult = {
  response_code: number;
  success: boolean;
  success_message: string;
  error_message: string;
};

async function smsProxy<T = unknown>(
  suffix: string,
  options: RequestInit = {}
): Promise<ProxyResult<T>> {
  const path = suffix.startsWith("/") ? suffix : `/${suffix}`;

  const res = await fetch(`${PROXY_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
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

export async function fetchSmsBalance() {
  return smsProxy<SmsApiResponse<SmsBalanceData>>("/balance", {
    method: "GET",
  });
}

export async function fetchSmsStatus() {
  return smsProxy<SmsApiResponse<SmsStatusData>>("/status", {
    method: "GET",
  });
}

export async function sendTestSms(payload: {
  number: string;
  message: string;
}) {
  return smsProxy<SmsApiResponse<SmsTestResult>>("/test", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
