import { NextResponse } from "next/server";
import { serverClient, ID_PATTERN } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { id, weltradeId } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Session expired. Please start again." }, { status: 400 });
    }
    if (!ID_PATTERN.test(weltradeId || "")) {
      return NextResponse.json(
        { error: "That doesn't look like a valid Weltrade ID. It should be 6–8 digits, e.g. 1336557." },
        { status: 400 }
      );
    }
    const supabase = serverClient();
    const { error } = await supabase
      .from("eulogeo_registrations")
      .update({ weltrade_id: weltradeId, status: "pending", completed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      if ((error as any).code === "23505") {
        return NextResponse.json(
          { error: "This Weltrade ID is already registered. Each ID can only be used once." },
          { status: 409 }
        );
      }
      throw error;
    }
    return NextResponse.json({
      telegram: process.env.TELEGRAM_LINK || "https://t.me/+o7sRW23XhrcwZTdk",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
