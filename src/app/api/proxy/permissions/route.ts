// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";

// // GET - Permission load korar jonno
// export async function GET(req: Request) {
//   try {
//     const cookieStore = cookies();
//     const token = await cookieStore.get("cbd_atkn_91f2a")?.value;

//     if (!token) {
//       return NextResponse.json(
//         { success: false, message: "Token paoa jay nai" },
//         { status: 401 }
//       );
//     }

//     // URL theke id parameter nite hobe
//     const { searchParams } = new URL(req.url);
//     const adminId = searchParams.get("id");

//     const backendUrl = `https://mcq-analysis.vercel.app/api/v1/permissions?id=${adminId}`;

//     const res = await fetch(backendUrl, {
//       method: "GET",
//       headers: {
//         Authorization: token,
//       },
//     });

//     const data = await res.json();
//     return NextResponse.json(data);
//   } catch (e) {
//     console.error(e);
//     return NextResponse.json(
//       { success: false, message: "Proxy error" },
//       { status: 500 }
//     );
//   }
// }

// // PATCH - Permission save korar jonno
// export async function PATCH(req: Request) {
//   try {
//     const cookieStore = cookies();
//     const token = await cookieStore.get("cbd_atkn_91f2a")?.value;

//     if (!token) {
//       return NextResponse.json(
//         { success: false, message: "Token paoa jay nai" },
//         { status: 401 }
//       );
//     }

//     const body = await req.json();

//     const backendUrl = `https://mcq-analysis.vercel.app/api/v1/permissions`;

//     const res = await fetch(backendUrl, {
//       method: "PATCH",
//       headers: {
//         Authorization: token,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });

//     const data = await res.json();
//     return NextResponse.json(data);
//   } catch (e) {
//     console.error(e);
//     return NextResponse.json(
//       { success: false, message: "Proxy error" },
//       { status: 500 }
//     );
//   }
// }









import { NextResponse } from "next/server";
import { ApiError } from "@/server/errors/api-error";
import { asyncHandler } from "@/server/middleware/async-handler";
import { proxyToBackend } from "@/server/services/proxy-client";

export const GET = asyncHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const adminId = searchParams.get("id");

  if (!adminId) {
    throw new ApiError(400, "Admin ID is required.");
  }

  const { data, status } = await proxyToBackend({
    path: `/admin/${adminId}`,
    method: "GET",
  });

  return NextResponse.json(data, { status });
});

export const PATCH = asyncHandler(async (req: Request) => {
  const body = await req.json();

  const { data, status } = await proxyToBackend({
    path: "/permissions",
    method: "PATCH",
    body,
  });

  return NextResponse.json(data, { status });
});