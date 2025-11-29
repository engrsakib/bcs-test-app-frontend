// import { NextResponse, NextRequest } from "next/server";

// export function PROXY(request: NextRequest) {
//   const url = request.nextUrl;
//   const pathname = url.pathname;

//   // Read cookies (server-side)
//   const accessToken = request.cookies.get("access_token")?.value;

//   // Protect all dashboard pages
//   if (pathname.startsWith("/dashboard") && !accessToken) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // Prevent logged-in user from visiting login page
//   if (pathname === "/login" && accessToken) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/dashboard/:path*", // Protect dashboard
//     "/login",            // Prevent /login access for logged users
//   ],
// };









// import { NextRequest, NextResponse } from "next/server";

// export function PROXY(request: NextRequest) {
//   const backendURL = "https://mcq-analysis.vercel.app";

//   const accessToken = request.cookies.get("cbd_atkn_91f2a")?.value;
//   const refreshToken = request.cookies.get("cbd_rtkn_7c4d1")?.value;

//   const pathname = request.nextUrl.pathname;

//   // Protect dashboard routes
//   if (pathname.startsWith("/dashboard") && !accessToken) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // Prevent logged users visiting login
//   if (pathname === "/login" && accessToken) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/login",
//     "/(api|API)/:path*",
//   ],
// };














// import { NextRequest, NextResponse } from "next/server";

// const BACKEND_URL = "https://mcq-analysis.vercel.app";

// export async function middleware(req: NextRequest) {
//   const { pathname, search } = req.nextUrl;
//   const accessToken = req.cookies.get("cbd_atkn_91f2a")?.value;
//   const refreshToken = req.cookies.get("cbd_rtkn_7c4d1")?.value;

  
//   console.log("Access Token in Middleware:", accessToken);
//   console.log("Refresh Token in Middleware:", refreshToken);

//   // 🔒 Protect dashboard pages
//   if (pathname.startsWith("/dashboard") && !accessToken) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // 🚫 Prevent logged-in user from visiting login
//   if (pathname === "/login" && accessToken) {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   // 🟢 Proxy APIs `/api/**`
//   if (pathname.startsWith("/api/")) {
//     const backendPath = pathname.replace("/api", "/api/v1"); // adjust as needed
//     const backendURL = `${BACKEND_URL}${backendPath}${search}`;

//     // ⬇ Forward request to backend with tokens
//     const fetchRes = await fetch(backendURL, {
//       method: req.method,
//       headers: {
//         "Content-Type": req.headers.get("Content-Type") || "",
//         Cookie: `cbd_atkn_91f2a=${accessToken}; cbd_rtkn_7c4d1=${refreshToken}`,
//       },
//       body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined,
//       credentials: "include",
//     });

//     // Create new response
//     const res = new NextResponse(fetchRes.body, {
//       status: fetchRes.status,
//       headers: fetchRes.headers,
//     });

//     return res;
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/login",
//     "/api/:path*", 
//   ],
// };














import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://mcq-analysis.vercel.app";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Read cookies
  const accessToken = req.cookies.get("cbd_atkn_91f2a")?.value;
  const refreshToken = req.cookies.get("cbd_rtkn_7c4d1")?.value;

  const  accessData = {
    accessToken
  }

  console.log("AccessToken", accessToken)
  console.log("RefreshToken", refreshToken)

  // Debug token log
  console.log("🔐 Access Token:", accessToken);

  // 🔒 Protect dashboard routes
  if (pathname.startsWith("/dashboard") && !accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🚫 Prevent logged-in users from visiting /login
  if (pathname === "/login" && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 🟢 PROXY API REQUESTS
  if (pathname.startsWith("/api/")) {
    const backendPath = pathname.replace("/api", "/api/v1"); // Adjust backend path
    const backendURL = `${BACKEND_URL}${backendPath}${search}`;

    // Forward request to backend with token
    const fetchRes = await fetch(backendURL, {
      method: req.method,
      headers: {
        "Content-Type": req.headers.get("Content-Type") || "",
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        "x-refresh-token": refreshToken || "",
      },
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? await req.text()
          : undefined,
    });

    // Return backend response to frontend
    return new NextResponse(fetchRes.body, {
      status: fetchRes.status,
      headers: fetchRes.headers,
    });
  }

  return NextResponse.next();
}

// Which routes middleware will run on
export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/login",            
    "/api/:path*",      
  ],
};










