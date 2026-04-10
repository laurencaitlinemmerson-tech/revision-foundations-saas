import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Protected routes that REQUIRE authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/account(.*)',
  '/checkout(.*)',
  '/billing(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  // Only protect specific routes - everything else is public
  if (isProtectedRoute(request)) {
    const { isAuthenticated, redirectToSignIn } = await auth();

    if (!isAuthenticated) {
      return redirectToSignIn({ returnBackUrl: request.url });
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // The exported tools are served by dynamic route handlers, despite the legacy .html URLs.
    '/apps/(.*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
