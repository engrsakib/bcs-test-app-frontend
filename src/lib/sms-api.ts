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

export type SmsLogEntry = {
  id: string;
  phone_number: string;
  message_type: "otp" | "forget_password_otp" | "general" | "test";
  success: boolean;
  response_code: number | null;
  error_message: string;
  created_at: string;
};

export type OtpBlockLogEntry = {
  id: string;
  phone_number: string;
  attempts_used: number;
  max_attempts: number;
  reset_at: string;
  created_at: string;
};

export type OtpRateLimitConfig = {
  maxAttempts: number;
  windowHours: number;
};

export type OtpRateLimitBlock = {
  phone_number: string;
  attempts_used: number;
  max_attempts: number;
  remaining_attempts: number;
  is_blocked: boolean;
  ttl_seconds: number;
  reset_at: string;
};

export type OtpBlocksData = {
  config: OtpRateLimitConfig;
  blocks: OtpRateLimitBlock[];
  total: number;
  blocked_count: number;
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

export async function fetchSmsLogs(limit = 50) {
  return smsProxy<SmsApiResponse<SmsLogEntry[]>>(`/logs?limit=${limit}`, {
    method: "GET",
  });
}

export async function fetchOtpBlockLogs(limit = 50) {
  return smsProxy<SmsApiResponse<OtpBlockLogEntry[]>>(
    `/otp-block-logs?limit=${limit}`,
    { method: "GET" }
  );
}

export async function fetchOtpBlocks() {
  return smsProxy<SmsApiResponse<OtpBlocksData>>("/otp-blocks", {
    method: "GET",
  });
}

export async function fetchOtpConfig() {
  return smsProxy<SmsApiResponse<OtpRateLimitConfig>>("/otp-config", {
    method: "GET",
  });
}

export async function updateOtpConfig(payload: OtpRateLimitConfig) {
  return smsProxy<SmsApiResponse<OtpRateLimitConfig>>("/otp-config", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function clearOtpBlock(payload: {
  phone_number?: string;
  clear_all?: boolean;
}) {
  return smsProxy<SmsApiResponse<{ deleted_count: number }>>("/otp-blocks", {
    method: "DELETE",
    body: JSON.stringify(payload),
  });
}
