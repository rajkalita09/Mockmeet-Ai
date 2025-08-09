import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Run Clerk's normal protection for protected routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // 🔹 Force remove Clerk's noindex header for ALL pages
  const res = await fetch(req.url); // Forward the request
  const newHeaders = new Headers(res.headers);
  newHeaders.delete('x-robots-tag');
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: newHeaders,
  });
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
