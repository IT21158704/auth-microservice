import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  await connectDB();

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const accessToken = signAccessToken({ id: user._id, email: user.email });
  const refreshToken = signRefreshToken({ id: user._id, email: user.email });

  const cookieStore = cookies();
  (await cookieStore).set("access", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 15,
  });

  (await cookieStore).set("refresh", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ message: "Logged in", user: { id: user._id, email: user.email } });
}
