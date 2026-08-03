import { createClient } from "@supabase/supabase-js";

const URL = process.env.SUPABASE_URL || "https://ikvpozgtzdnvsiprtkbn.supabase.co";
const KEY =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrdnBvemd0emRudnNpcHJ0a2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3Mjg0MzcsImV4cCI6MjEwMTMwNDQzN30.uGiLT5Wty5FmppUAaqsojnjOiuEdM-yZ9ItrNWO28WE";

export function serverClient() {
  return createClient(URL, KEY, { auth: { persistSession: false } });
}

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Elisha@123";
export const ID_PATTERN = /^\d{6,8}$/; // Weltrade account IDs e.g. 1336557
