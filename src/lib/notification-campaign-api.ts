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

export type CampaignListFilters = {
  status?: CampaignStatus | "";
  audienceMode?: CampaignAudienceMode | "";
  dateFrom?: string;
  dateTo?: string;
  search?: string;
};

export type CampaignRecipientSegment =
  | "browse"
  | "not_attended"
  | "top_by_exam";

export type CampaignRecipientRow = {
  userId?: string;
  name: string;
  phone_number: string;
  rank?: number;
  score?: number;
};

export type CampaignListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  hasMore: boolean;
};

function appendOptional(
  params: URLSearchParams,
  key: string,
  value: string | undefined
) {
  const v = value?.trim();
  if (v) params.set(key, v);
}

export async function fetchNotificationCampaigns(
  page = 1,
  limit = 10,
  filters: CampaignListFilters = {}
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  appendOptional(params, "status", filters.status);
  appendOptional(params, "audienceMode", filters.audienceMode);
  appendOptional(params, "dateFrom", filters.dateFrom);
  appendOptional(params, "dateTo", filters.dateTo);
  appendOptional(params, "search", filters.search);

  const res = await fetch(`${PROXY_BASE}?${params.toString()}`, {
    credentials: "include",
  });
  return res.json() as Promise<
    ApiEnvelope<{
      data: NotificationCampaign[];
      meta: CampaignListMeta;
    }>
  >;
}

export type FetchCampaignRecipientsParams = {
  segment: CampaignRecipientSegment;
  page?: number;
  limit?: number;
  search?: string;
  examNumber?: number;
  topN?: number;
};

export async function fetchCampaignRecipients(
  params: FetchCampaignRecipientsParams
) {
  const qs = new URLSearchParams({
    segment: params.segment,
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 20),
  });
  appendOptional(qs, "search", params.search);
  if (params.examNumber != null) {
    qs.set("examNumber", String(params.examNumber));
  }
  if (params.topN != null) {
    qs.set("topN", String(params.topN));
  }

  const res = await fetch(
    `${PROXY_BASE}/recipients?${qs.toString()}`,
    { credentials: "include" }
  );
  return res.json() as Promise<
    ApiEnvelope<{
      data: CampaignRecipientRow[];
      meta: CampaignListMeta;
    }>
  >;
}

export async function fetchNotificationCampaign(id: string) {
  const res = await fetch(`${PROXY_BASE}/${id}`, { credentials: "include" });
  return res.json() as Promise<ApiEnvelope<NotificationCampaign>>;
}
