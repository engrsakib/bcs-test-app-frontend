const PROXY_BASE = "/api/proxy/notifications/campaigns";

export type CampaignAudienceMode = "all" | "selected";

export type CampaignStatus = "queued" | "processing" | "completed" | "failed";

export type NotificationCampaignStats = {
  totalRecipients: number;
  inboxCreated: number;
  pushSent: number;
  pushSkippedNoToken: number;
  pushFailed: number;
};

export type NotificationCampaign = {
  _id: string;
  subject: string;
  body: string;
  audienceMode: CampaignAudienceMode;
  selectedPhoneNumbers: string[];
  status: CampaignStatus;
  stats: NotificationCampaignStats;
  unresolvedPhones?: string[];
  errorMessage?: string;
  senderAdminName?: string;
  createdAt: string;
  completedAt?: string;
};

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
};

export type CreateCampaignPayload = {
  subject: string;
  body: string;
  audienceMode: CampaignAudienceMode;
  phoneNumbers?: string[];
};

export async function createNotificationCampaign(
  payload: CreateCampaignPayload
): Promise<ApiEnvelope<NotificationCampaign>> {
  const res = await fetch(PROXY_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function fetchNotificationCampaigns(page = 1, limit = 10) {
  const res = await fetch(`${PROXY_BASE}?page=${page}&limit=${limit}`, {
    credentials: "include",
  });
  return res.json() as Promise<
    ApiEnvelope<{
      data: NotificationCampaign[];
      meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
        hasMore: boolean;
      };
    }>
  >;
}

export async function fetchNotificationCampaign(id: string) {
  const res = await fetch(`${PROXY_BASE}/${id}`, { credentials: "include" });
  return res.json() as Promise<ApiEnvelope<NotificationCampaign>>;
}
