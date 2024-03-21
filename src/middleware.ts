// Import necessary functions and modules from next-auth and next/server
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

// Define a Next.js API route using the withAuth middleware
export default withAuth(
  async function middleware(req: NextRequest) {
    // Extract the pathname from the request URL
    const pathname = req.nextUrl.pathname;

    // Check if the user is authenticated by attempting to get the JWT token from the request
    const isAuth = await getToken({ req });

    // Check if the current route is the login page
    const isLogin = pathname.startsWith("/login");

    // Define an array of sensitive routes that require authentication
    const sensitiveRoutes = ["/dashboard"];

    // Check if the user is accessing any of the sensitive routes
    const isAccessingSensitiveRoutes = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Redirect authenticated users trying to access the login page to the dashboard
    if (isLogin && isAuth)
      return NextResponse.redirect(new URL("/dashboard", req.url));

    // Redirect unauthenticated users trying to access sensitive routes to the login page
    if (!isAuth && isAccessingSensitiveRoutes)
      return NextResponse.redirect(new URL("/login", req.url));

    // Redirect users accessing the root ("/") to the dashboard if authenticated
    if (pathname == "/")
      return NextResponse.redirect(new URL("/dashboard", req.url));
  },
  {
    // Define callback functions for the withAuth middleware
    callbacks: {
      // Callback function triggered when the user is authorized
      async authorized() {
        // Always return true for simplicity; you might implement more complex logic here
        return true;
      },
    },
  }
);

// Configure the route matcher for the Next.js API route
export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
