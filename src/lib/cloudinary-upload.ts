/**
 * Upload via Next.js API (signed server-side). Uses CLOUDINARY_* from .env —
 * not the old browser unsigned preset to disabled/wrong clouds.
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const response = await fetch("/api/cloudinary/upload", {
    method: "POST",
    body: form,
  });

  const data = (await response.json()) as {
    secure_url?: string;
    error?: { message?: string };
  };

  if (!response.ok || !data.secure_url) {
    throw new Error(data.error?.message || "Upload failed");
  }

  return data.secure_url;
}
