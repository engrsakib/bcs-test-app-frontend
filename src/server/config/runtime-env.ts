import { SERVER_API_BASE_URL } from "@/config/env";

const normalizeBaseUrl = (url: string): string => url.replace(/\/+$/, "");

export const runtimeEnv = {
  get backendBaseUrl() {
    return normalizeBaseUrl(SERVER_API_BASE_URL);
  },
};
