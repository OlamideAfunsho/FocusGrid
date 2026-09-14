import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // 1. Protect routes requiring authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // 2. Clear stale handshake cookies if present
  if (req.cookies.has("__clerk_handshake")) {
    const response = NextResponse.next();
    response.cookies.delete("__clerk_handshake");
    return response;
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};