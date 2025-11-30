





// import { NextRequest, NextResponse } from "next/server";

// const BACKEND_URL = "https://mcq-analysis.vercel.app";

// export async function middleware(req: NextRequest) {
//   const { pathname, search } = req.nextUrl;

//   // Read cookies
//   const accessToken = req.cookies.get("cbd_atkn_91f2a")?.value;
//   const refreshToken = req.cookies.get("cbd_rtkn_7c4d1")?.value;

//    console.log("From Middleware", accessToken)

//   console.log("AccessToken", accessToken)
//   console.log("RefreshToken", refreshToken)

//   // Debug token log
//   console.log("🔐 Access Token:", accessToken);

//   // 🔒 Protect dashboard routes
//   if (pathname.startsWith("/dashboard") && !accessToken) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // 🚫 Prevent logged-in users from visiting /login
//   if (pathname === "/login" && accessToken) {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   // 🟢 PROXY API REQUESTS
//   if (pathname.startsWith("/api/")) {
//     const backendPath = pathname.replace("/api", "/api/v1"); // Adjust backend path
//     const backendURL = `${BACKEND_URL}${backendPath}${search}`;

//     // Forward request to backend with token
//     const fetchRes = await fetch(backendURL, {
//       method: req.method,
//       headers: {
//         "Content-Type": req.headers.get("Content-Type") || "",
//         Authorization: accessToken ? `Bearer ${accessToken}` : "",
//         "x-refresh-token": refreshToken || "",
//       },
//       body:
//         req.method !== "GET" && req.method !== "HEAD"
//           ? await req.text()
//           : undefined,
//     });

//     // Return backend response to frontend
//     return new NextResponse(fetchRes.body, {
//       status: fetchRes.status,
//       headers: fetchRes.headers,
//     });
//   }

//   return NextResponse.next();
// }

// // Which routes middleware will run on
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

   console.log("MW Access Token:", accessToken);
console.log("MW Refresh Token:", refreshToken);


  // Protect dashboard
  if (pathname.startsWith("/dashboard") && !accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Prevent logged-in user going to login
  if (pathname === "/login" && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Proxy API request
  if (pathname.startsWith("/api/")) {
    const backendPath = pathname.replace("/api", "/api/v1");
    const backendURL = `${BACKEND_URL}${backendPath}${search}`;

    // ⭐ FIX: Forward headers manually
    const newHeaders: Record<string, string> = {};

    // Copy client headers
    req.headers.forEach((value, key) => {
      newHeaders[key] = value;
    });

    // Add tokens from cookies
    if (accessToken) newHeaders["authorization"] = accessToken;
    if (refreshToken) newHeaders["x-refresh-token"] = refreshToken;

    const fetchRes = await fetch(backendURL, {
      method: req.method,
      headers: newHeaders,
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? await req.text()
          : undefined,
    });

    // ⭐ FIX: return only body + status (not headers)
    const response = new NextResponse(fetchRes.body, {
      status: fetchRes.status,
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/api/:path*"],
};





