import { CACHE_TTL } from "@/config/offline";
import { createCachedProxy } from "./offline/cached-proxy";

export const bookProxy = createCachedProxy(
  "/api/proxy/books",
  "books",
  CACHE_TTL.books
);
