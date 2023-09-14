import { NextResponse } from "next/server";

export function middleware(request) {
  // Rewrite warpcast /~/conversations URLs:
  // /~/conversations/0xb95619fb043df85198da3034464f4fa1c7989367 => /cast/0xb95619fb043df85198da3034464f4fa1c7989367
  if (request.nextUrl.pathname.startsWith("/~")) {
    const newUrl = new URL(
      request.nextUrl.pathname.replace("/~/conversations", "/cast"),
      request.url
    );

    return NextResponse.rewrite(newUrl);
  }
}
