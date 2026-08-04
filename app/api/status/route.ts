import { NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id?.trim()) {
      return NextResponse.json({ error: "Registration ID is required." }, { status: 400 });
    }

    const supabase = serverClient();
    const { data, error } = await supabase
      .from("eulogeo_registrations")
      .select("id, full_name, institution, phone, weltrade_id, status, created_at, completed_at")
      .eq("id", id.trim())
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
