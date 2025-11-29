import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// GET - Single admin data with permissions
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cbd_atkn_91f2a")?.value;

    console.log("Fetching admin:", params.id);
    console.log("Token found:", token ? "Yes" : "No");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token not found" },
        { status: 401 }
      );
    }

    // Backend e admin by ID API call
    const backendUrl = `https://mcq-analysis.vercel.app/api/v1/admin/${params.id}`;

    console.log("Calling backend URL:", backendUrl);

    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log("Backend response:", data);

    return NextResponse.json(data);
  } catch (e) {
    console.error("Proxy error:", e);
    return NextResponse.json(
      { success: false, message: "Proxy error" },
      { status: 500 }
    );
  }
}
