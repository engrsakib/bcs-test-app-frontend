import { ApiError } from "@/server/errors/api-error";

const normalizeBaseUrl = (url: string): string => url.replace(/\/+$/, "");

export const runtimeEnv = {
  get backendBaseUrl() {
    const value = process.env.NEXT_PUBLIC_BASE_URL;
    if (!value) {
      throw new ApiError(
        500,
        "Missing NEXT_PUBLIC_BASE_URL in environment variables."
      );
    }

    return normalizeBaseUrl(value);
  },
};
