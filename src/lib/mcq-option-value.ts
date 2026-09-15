export type McqOptionValue = { text: string; image_url: string };

export function isImageUrl(value: unknown): boolean {
  const lower = String(value || "").trim().toLowerCase();
  if (!(lower.startsWith("http://") || lower.startsWith("https://"))) {
    return false;
  }
  return (
    lower.includes("res.cloudinary.com") ||
    /\.(jpe?g|png)(\?|$)/i.test(lower)
  );
}

export function parseOptionValue(value: unknown): McqOptionValue {
  if (!value) return { text: "", image_url: "" };
  if (typeof value === "object") {
    const record = value as {
      text?: string;
      image_url?: string;
      imageUrl?: string;
    };
    return {
      text: record.text || "",
      image_url: record.image_url || record.imageUrl || "",
    };
  }

  const raw = String(value).trim();
  if (raw.startsWith("{")) {
    try {
      const parsed = JSON.parse(raw) as { text?: string; image_url?: string };
      if (
        parsed &&
        typeof parsed === "object" &&
        (parsed.text != null || parsed.image_url)
      ) {
        return {
          text: parsed.text || "",
          image_url: parsed.image_url || "",
        };
      }
    } catch {
      // keep as plain text
    }
  }

  if (isImageUrl(raw)) return { text: "", image_url: raw };
  return { text: raw, image_url: "" };
}

export function serializeOptionValue({
  text = "",
  image_url = "",
}: Partial<McqOptionValue> = {}): string {
  const trimmedText = String(text || "").trim();
  const trimmedImage = String(image_url || "").trim();
  if (trimmedText && trimmedImage) {
    return JSON.stringify({ text: trimmedText, image_url: trimmedImage });
  }
  return trimmedImage || trimmedText;
}

export function optionHasContent(value: unknown): boolean {
  const parsed = parseOptionValue(value);
  return Boolean(parsed.text || parsed.image_url);
}

export function optionDisplayText(option: unknown): string {
  const parsed = parseOptionValue(option);
  if (parsed.text) return parsed.text;
  if (parsed.image_url) return "Image option";
  return String(option ?? "").trim();
}

export function hasQuestionImage(imageUrl: unknown): boolean {
  return String(imageUrl ?? "").trim().length > 0;
}
