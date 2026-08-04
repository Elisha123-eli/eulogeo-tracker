import { createClient } from "@supabase/supabase-js";

const URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase environment variables");
}

export function serverClient() {
  return createClient(URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });
}

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Elisha@123";
export const ID_PATTERN = /^\d{6,8}$/; // Weltrade account IDs e.g. 1336557
