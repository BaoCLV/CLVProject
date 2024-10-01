import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Middleware is running!");
  const token = request.cookies.get("access_token")?.value;

  // Define routes that don't require authentication
  const publicRoutes = ["/"];

  // Allow access to public routes
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // If the token doesn't exist, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url)); // Redirect to root or landing page
  }

  return NextResponse.next(); // Allow the request to continue if authenticated
}

// Apply middleware to all routes
export const config = {
  matcher: ["/:path*"], // Protect all routes
};
