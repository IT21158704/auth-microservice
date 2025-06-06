import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ user: null });

  const decoded = verifyAccessToken(token);
  if (!decoded) return NextResponse.json({ user: null });

  return NextResponse.json({ user: decoded });
}
