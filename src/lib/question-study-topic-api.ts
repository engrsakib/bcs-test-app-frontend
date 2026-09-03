import { CACHE_TTL } from "@/config/offline";
import { createCachedProxy } from "./offline/cached-proxy";

export const questionStudyTopicProxy = createCachedProxy(
  "/api/proxy/question-study-topic",
  "question-study-topic",
  CACHE_TTL.questions
);
