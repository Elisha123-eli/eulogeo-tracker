import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { serverClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { name, institution, phone } = await req.json();
    if (!name?.trim() || !institution?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    const id = randomUUID();
    const supabase = serverClient();
    const { error } = await supabase.from("eulogeo_registrations").insert({
      id,
      full_name: name.trim(),
      institution: institution.trim(),
      phone: phone.trim(),
      status: "started",
    });
    if (error) throw error;
    return NextResponse.json({
      id,
      partnerLink: process.env.PARTNER_LINK || "https://tinyurl.com/yvrjfn2e",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
