import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://nqiwnvilvwjzdsdimshb.supabase.co";
const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xaXdudmlsdndqemRzZGltc2hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MzM0MDksImV4cCI6MjA5OTAwOTQwOX0.8GLzJAc47IO5dN3-UdIeRwJ0yG9XrB2mV_xjy425Fjg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
