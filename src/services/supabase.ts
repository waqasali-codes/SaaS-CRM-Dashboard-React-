import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xcedmmysggjqxdqjsgcd.supabase.co";
const supabaseKey = "sb_publishable_RE97zcgOBLZI6dWD4n22cA_phhRhVVj";

export const supabase = createClient(supabaseUrl, supabaseKey);
