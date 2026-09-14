import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect();
  },
  {
    // Production Clerk on *.vercel.app can only be reached through this proxy
    frontendApiProxy: { enabled: process.env.NODE_ENV === "production" },
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and standard static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Clerk proxy requests, including .js files the first pattern skips
    "/__clerk/(.*)",
  ],
};
