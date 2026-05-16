import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = await cookieStore.get("cbd_atkn_91f2a")?.value;
    console.log("Token:", token);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token found" },
        { status: 401 }
      );
    }

    // আপনার ইএনভিতে অলরেডি /api/v1 আছে (যেমন: https://...com/api/v1)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      console.error("Missing NEXT_PUBLIC_BASE_URL in environment variables");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // /api/v1 বাদ দিয়ে সরাসরি /admin যোগ করা হলো যেহেতু ওটা ইএনভিতেই আছে
    const backendUrl = `${baseUrl}/admin${req.url.split("/proxy/admin")[1]}`;
    console.log("Proxying to:", backendUrl);

    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: token, 
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("Proxy Error:", e);
    return NextResponse.json(
      { success: false, message: "Proxy error" },
      { status: 500 }
    );
  }
}