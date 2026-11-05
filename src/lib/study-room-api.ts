import { ENV } from "@/config/env";
import getCookie from "@/util/GetCookie";

export type StudyRoomRow = {
  id: string;
  title: string;
  topic?: string;
  description?: string;
  status: string;
  maxParticipants: number;
  participantCount: number;
  scheduledStartAt?: string;
  scheduledEndAt?: string;
  createdAt?: string;
};

function authHeaders(): HeadersInit {
  return {
    Authorization: getCookie("access_token") || "",
    "Content-Type": "application/json",
  };
}

export async function fetchAdminStudyRooms(params?: {
  status?: string;
  page?: number;
}) {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.page) query.set("page", String(params.page));
  const res = await fetch(`${ENV.BASE_URL}/study-room/admin?${query}`, {
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to load rooms");
  return json.data as {
    overview: Record<string, number>;
    data: StudyRoomRow[];
    meta: { page: number; limit: number; total: number };
  };
}

export async function createStudyRoom(body: Record<string, unknown>) {
  const res = await fetch(`${ENV.BASE_URL}/study-room`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Create failed");
  return json.data;
}

export async function openStudyRoom(id: string) {
  const res = await fetch(`${ENV.BASE_URL}/study-room/admin/${id}/open`, {
    method: "POST",
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Open failed");
  return json.data;
}

export async function closeStudyRoom(id: string) {
  const res = await fetch(`${ENV.BASE_URL}/study-room/admin/${id}/close`, {
    method: "POST",
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Close failed");
  return json.data;
}

export async function deleteStudyRoom(id: string) {
  const res = await fetch(`${ENV.BASE_URL}/study-room/admin/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Delete failed");
  return json.data;
}

export type StudyRoomParticipant = {
  userId: string;
  userName?: string;
  state: string;
  livekitIdentity?: string;
  connectedAt?: string;
  reservedAt?: string;
};

export async function fetchAdminStudyRoomDetail(id: string) {
  const res = await fetch(`${ENV.BASE_URL}/study-room/admin/${id}`, {
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to load room");
  return json.data as {
    room: StudyRoomRow;
    participants: StudyRoomParticipant[];
  };
}

export async function removeStudyRoomParticipant(roomId: string, userId: string) {
  const res = await fetch(
    `${ENV.BASE_URL}/study-room/admin/${roomId}/remove-participant`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ userId }),
    }
  );
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Remove failed");
  return json.data;
}
