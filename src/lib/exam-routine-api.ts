import { CACHE_TTL } from "@/config/offline";
import { createCachedProxy } from "./offline/cached-proxy";

export const examRoutineProxy = createCachedProxy(
  "/api/proxy/exam-routine",
  "exam-routine",
  CACHE_TTL.examRoutine
);
