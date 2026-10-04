
import { createClient } from
    "https://esm.sh/@supabase/supabase-js@2";

// Replace these placeholders with your own Supabase details.
const SUPABASE_URL = "https://xgrwxqhntnkqbmzgnwoh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_7ekJNCNfmoxgoTPgJtBfeQ_W8PE0tAX";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
