import { CACHE_TTL } from "@/config/offline";
import { createCachedProxy } from "./offline/cached-proxy";

export const examSolutionProxy = createCachedProxy(
  "/api/proxy/exam-solution",
  "exam-solution",
  CACHE_TTL.examSolution
);
