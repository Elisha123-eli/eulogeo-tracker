import { NextResponse } from "next/server";
import { serverClient, ADMIN_PASSWORD } from "@/lib/supabase";

function authorized(req: Request) {
  return req.headers.get("x-admin-key") === ADMIN_PASSWORD;
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  let query = serverClient().from("eulogeo_registrations").select("id, full_name, institution, phone, weltrade_id, status, admin_note, rejection_reason, created_at, completed_at").order("created_at", { ascending: false });
  if (from) query = query.gte("created_at", `${from}T00:00:00.000Z`);
  if (to) query = query.lt("created_at", `${to}T00:00:00.000Z`);
  const { data, error } = await query;
  if (error) {
    console.error("[v0] admin list failed", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
  return NextResponse.json({ rows: data || [] });
}

export async function PATCH(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  const { id, status, note } = await req.json();
  if (!id || !["pending", "verified", "rejected"].includes(status)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const { data, error } = await serverClient().rpc("admin_set_status", { p_password: ADMIN_PASSWORD, p_id: id, p_status: status, p_note: note?.trim() || null });
  if (error || data !== true) {
    console.error("[v0] admin status update failed", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const ids = Array.isArray(body.ids) ? body.ids.filter(Boolean) : [];
  let query = serverClient().from("eulogeo_registrations").delete();
  query = ids.length ? query.in("id", ids) : query.neq("id", "00000000-0000-0000-0000-000000000000");
  const { error } = await query;
  if (error) {
    console.error("[v0] admin delete failed", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
