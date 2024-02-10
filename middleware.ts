import { NextResponse, NextRequest } from "next/server";

export const middleware = (req: NextRequest) => {
  // Returns true or false
  const authToken = req.cookies.has("x-auth-token");

  //  If authToken isn't present, run this code;
  if (!authToken) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }
  return NextResponse.next();
};

export const config = {
  matcher: ["/", "/upload/:path*", "/dashboard/:path*"],
};
