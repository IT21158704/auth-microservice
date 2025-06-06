import { cookies } from "next/headers";
import { verifyRefreshToken, signAccessToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { JwtPayload } from "jsonwebtoken";

export async function GET() {
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("refresh")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "Refresh token missing" }, { status: 401 });
  }

  const payload = verifyRefreshToken(refreshToken);

  // Ensure payload is a JwtPayload (not string or null)
  if (!payload || typeof payload === "string") {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }

  const accessToken = signAccessToken(payload);

  (await cookieStore).set("access", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 15,
  });

  return NextResponse.json({ message: "Access token refreshed" });
}
