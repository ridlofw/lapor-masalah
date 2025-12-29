
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqncpeshwvmzeuiyhoag.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_VAs2UXpIaqI6obNcvA0sRg_srvUN98k';

console.log(`Checking bucket on: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndCreate() {
    console.log("Checking Supabase Storage buckets...");
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error("Error listing buckets:", error.message);
    } else {
        const reportsBucket = data.find(b => b.name === 'reports');
        if (reportsBucket) {
            console.log("✅ Bucket 'reports' found!");
            return;
        }
    }

    console.log("⚠️ Bucket 'reports' not found. Attempting to create...");
    const { data: createData, error: createError } = await supabase.storage.createBucket('reports', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg']
    });

    if (createError) {
        console.error("❌ Failed to create bucket:", createError.message);
        console.log("👉 Please create it manually in Supabase Dashboard -> Storage -> New Bucket -> 'reports' (Public)");
    } else {
        console.log("✅ Bucket 'reports' created successfully!");
    }
}

checkAndCreate();
