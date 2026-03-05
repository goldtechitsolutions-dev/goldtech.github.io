import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hnygqubocyzrnqqmbpeg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhueWdxdWJvY3l6cm5xcW1icGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwODY1NTUsImV4cCI6MjA4NzY2MjU1NX0.2tATlgjAQ_y4i9PE-nArtMtaa0L3DVRnsGtdmKbVrH4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    // Try to query a hypothetical 'company_info' table
    const res1 = await supabase.from('company_info').select('*').limit(1);
    console.log("company_info table:", res1.error ? res1.error.message : res1.data);

    // Try to query a hypothetical 'settings' table
    const res2 = await supabase.from('settings').select('*').limit(1);
    console.log("settings table:", res2.error ? res2.error.message : res2.data);
}
test();
