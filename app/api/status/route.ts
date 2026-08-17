import { NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    const normalizedPhone = String(phone || "").trim();
    if (!normalizedPhone) return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    const { data, error } = await serverClient()
      .from("eulogeo_registrations")
      .select("id, full_name, institution, phone, weltrade_id, status, admin_note, rejection_reason, created_at, completed_at")
      .eq("phone", normalizedPhone)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ error: "No registration found for that phone number." }, { status: 404 });
    return NextResponse.json({ data, telegram: process.env.TELEGRAM_LINK || "https://t.me/+o7sRW23XhrcwZTdk" });
  } catch (error) {
    console.error("[v0] status lookup failed", error);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
