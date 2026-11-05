"use client";

import { io, type Socket } from "socket.io-client";
import { SERVER_API_BASE_URL } from "@/config/env";
import getCookie from "@/util/GetCookie";

export const STUDY_ROOM_SOCKET_EVENTS = {
  CAPACITY_UPDATED: "study-room:capacity-updated",
  CREATED: "study-room:created",
  UPDATED: "study-room:updated",
  OPENED: "study-room:opened",
  CLOSED: "study-room:closed",
  DELETED: "study-room:deleted",
  PARTICIPANT_JOINED: "study-room:participant-joined",
  PARTICIPANT_LEFT: "study-room:participant-left",
} as const;

function getSocketBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SOCKET_URL?.trim();
  if (explicit && explicit !== "undefined") {
    return explicit.replace(/\/+$/, "");
  }
  return SERVER_API_BASE_URL.replace(/\/api\/v1\/?$/i, "");
}

export function connectStudyRoomAdminSocket(): Socket | null {
  const token = getCookie("access_token");
  if (!token) return null;
  return io(getSocketBaseUrl(), {
    path: "/socket.io",
    auth: { token },
    transports: ["websocket", "polling"],
  });
}
