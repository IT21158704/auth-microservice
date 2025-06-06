import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongo";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });

  return NextResponse.json({ message: "User created", user: { id: user._id, email: user.email } });
}
