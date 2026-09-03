import { CACHE_TTL } from "@/config/offline";
import { createCachedProxy } from "./offline/cached-proxy";

export const announcementsProxy = createCachedProxy(
  "/api/proxy/announcements",
  "announcements",
  CACHE_TTL.announcements
);
