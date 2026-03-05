import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hnygqubocyzrnqqmbpeg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhueWdxdWJvY3l6cm5xcW1icGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwODY1NTUsImV4cCI6MjA4NzY2MjU1NX0.2tATlgjAQ_y4i9PE-nArtMtaa0L3DVRnsGtdmKbVrH4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

    if (error) {
        console.error(error);
        return;
    }

    data.forEach(blog => {
        let unpacked = { ...blog };
        console.log(`\n\n--- BLOG: ${unpacked.title} ---`);
        if (unpacked.content) {
            const match = unpacked.content.match(/<!-- GTMETA: (.*?) -->/);
            if (match) {
                try {
                    const meta = JSON.parse(match[1]);
                    console.log('META extracted:');
                    console.log(meta);
                } catch (e) {
                    console.log("JSON Parse Error", e);
                }
            } else {
                console.log("NO GTMETA in content.");
            }
        }
    });
}
test();
