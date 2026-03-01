
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hnygqubocyzrnqqmbpeg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhueWdxdWJvY3l6cm5xcW1icGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwODY1NTUsImV4cCI6MjA4NzY2MjU1NX0.2tATlgjAQ_y4i9PE-nArtMtaa0L3DVRnsGtdmKbVrH4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log("Attempting to insert a test meeting into gt_meetings...");
    const testMeeting = {
        name: 'Test User',
        email: 'test@example.com',
        topic: 'Test Topic',
        date: '2023-11-01',
        time: '10:00 AM',
        status: 'Scheduled',
        link: 'https://meet.google.com/test'
    };

    const { data, error } = await supabase
        .from('gt_meetings')
        .insert([testMeeting])
        .select();

    if (error) {
        console.error("Insert failed:", error);
    } else {
        console.log("Insert successful:", data);
    }
}

testInsert();
