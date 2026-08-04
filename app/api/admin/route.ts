import { NextResponse } from "next/server";
import { serverClient, ADMIN_PASSWORD } from "@/lib/supabase";

function key(req: Request) {
  return req.headers.get("x-admin-key") || "";
}

export async function GET(req: Request) {
  const k = key(req);
  if (k !== ADMIN_PASSWORD) return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  const supabase = serverClient();
  const { data, error } = await supabase.rpc("admin_list_registrations", { p_password: k });
  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
  return NextResponse.json({ rows: data || [] });
}

export async function PATCH(req: Request) {
  const k = key(req);
  if (k !== ADMIN_PASSWORD) return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  const { id, status } = await req.json();
  if (!id || !["verified", "rejected", "pending"].includes(status)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const supabase = serverClient();
  const { data, error } = await supabase.rpc("admin_set_status", {
    p_password: k, p_id: id, p_status: status,
  });
  if (error || data !== true) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const k = key(req);
  if (k !== ADMIN_PASSWORD) return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  const supabase = serverClient();
  const { error } = await supabase.from("eulogeo_registrations").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
