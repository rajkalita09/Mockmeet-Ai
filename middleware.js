// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define your protected routes
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/forum(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect only specific routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // ✅ Completely disable Clerk's automatic noindex injection
  // This ensures no 'X-Robots-Tag: noindex' is added
  const res = new Response();
  res.headers.delete("X-Robots-Tag"); // Remove if already set by Clerk
  return res;
});

// ✅ Make sure matcher still matches all pages & APIs you need
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
