import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  (await cookieStore).delete("access");
  (await cookieStore).delete("refresh");

  return NextResponse.json({ message: "Logged out" });
}
