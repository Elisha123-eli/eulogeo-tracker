import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { serverClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { name, institution, phone } = await req.json();
    if (!name?.trim() || !institution?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    const supabase = serverClient();
    const normalizedPhone = phone.trim();
    const { data: existing, error: existingError } = await supabase
      .from("eulogeo_registrations")
      .select("id, full_name, institution, phone, weltrade_id, status")
      .eq("phone", normalizedPhone)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (existingError) throw existingError;
    if (existing) {
      return NextResponse.json({
        id: existing.id,
        resumed: true,
        existing,
        partnerLink: process.env.PARTNER_LINK || "https://tinyurl.com/yvrjfn2e",
      });
    }
    const id = randomUUID();
    const { error } = await supabase.from("eulogeo_registrations").insert({
      id,
      full_name: name.trim(),
      institution: institution.trim(),
      phone: normalizedPhone,
      status: "pending",
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
