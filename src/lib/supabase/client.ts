import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a dummy client or throw a better error if needed, but for now we throw
    throw new Error("Missing Supabase environment variables")
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
}
