import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function getCloudinaryConfig() {
  const cloud_name =
    process.env.CLOUDINARY_CLOUD_NAME?.trim() ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const api_key = process.env.CLOUDINARY_API_KEY?.trim();
  const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloud_name || !api_key || !api_secret) {
    return null;
  }

  return { cloud_name, api_key, api_secret };
}

function signCloudinaryParams(
  params: Record<string, string | number>,
  apiSecret: string
) {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");
}

function friendlyCloudinaryError(message: string | undefined): string {
  if (!message) return "Upload failed";
  if (message === "cloud_name is disabled") {
    return "Cloudinary cloud is disabled. In the Cloudinary dashboard, re-enable the account or set CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to your active cloud name (Dashboard → API Keys).";
  }
  if (message === "cloud_name mismatch") {
    return "Cloudinary cloud name does not match your API key. Copy the Cloud name from the same API Keys page as your key and update both CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env, then restart the dev server.";
  }
  return message;
}

export async function POST(req: NextRequest) {
  const config = getCloudinaryConfig();
  if (!config) {
    return NextResponse.json(
      {
        error: {
          message:
            "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.",
        },
      },
      { status: 500 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid upload payload" } },
      { status: 400 }
    );
  }

  const file = form.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json(
      { error: { message: "Missing image file" } },
      { status: 400 }
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = signCloudinaryParams({ timestamp }, config.api_secret);

  const uploadData = new FormData();
  uploadData.append("file", file);
  uploadData.append("api_key", config.api_key);
  uploadData.append("timestamp", String(timestamp));
  uploadData.append("signature", signature);

  const cloudinaryRes = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloud_name}/image/upload`,
    { method: "POST", body: uploadData }
  );

  const data = (await cloudinaryRes.json()) as {
    secure_url?: string;
    error?: { message?: string };
  };

  if (!cloudinaryRes.ok || !data.secure_url) {
    const raw = data.error?.message;
    return NextResponse.json(
      { error: { message: friendlyCloudinaryError(raw) } },
      { status: cloudinaryRes.status || 502 }
    );
  }

  return NextResponse.json(data);
}
