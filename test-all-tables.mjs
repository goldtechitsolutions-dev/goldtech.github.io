import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hnygqubocyzrnqqmbpeg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhueWdxdWJvY3l6cm5xcW1icGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwODY1NTUsImV4cCI6MjA4NzY2MjU1NX0.2tATlgjAQ_y4i9PE-nArtMtaa0L3DVRnsGtdmKbVrH4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    // List tables that might be relevant
    const tables = ['settings', 'config', 'company_info', 'users', 'Users', 'profiles', 'system_config', 'site_settings'];
    for (const t of tables) {
        const res = await supabase.from(t).select('*').limit(1);
        console.log(t, res.error ? res.error.message : "EXISTS! Data length: " + res.data.length);
    }
}
test();
