import { createClient } from "@supabase/supabase-js";

export function serverClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !serviceRoleKey) throw new Error("Missing Supabase environment variables");
  return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
}

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Elisha@123";
export const ID_PATTERN = /^\d{6,8}$/; // Weltrade account IDs e.g. 1336557
