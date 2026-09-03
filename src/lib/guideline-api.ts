import { CACHE_TTL } from "@/config/offline";
import { createCachedProxy } from "./offline/cached-proxy";

export const guidelineProxy = createCachedProxy(
  "/api/proxy/guideline",
  "guidelines",
  CACHE_TTL.guidelines
);
