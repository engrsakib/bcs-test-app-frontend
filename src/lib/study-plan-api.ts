import { CACHE_TTL } from "@/config/offline";
import { createCachedProxy } from "./offline/cached-proxy";

export const studyPlanProxy = createCachedProxy(
  "/api/proxy/study-plan",
  "study-plans",
  CACHE_TTL.studyPlans
);
