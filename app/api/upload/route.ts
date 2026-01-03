import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
    try {
        // Get Supabase credentials from env - try both naming conventions
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error("Missing Supabase credentials:", {
                hasUrl: !!supabaseUrl,
                hasKey: !!supabaseKey,
            });
            return NextResponse.json(
                { error: "Server configuration error - Supabase credentials missing" },
                { status: 500 }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Try to parse as JSON first (for base64 uploads from mobile)
        const contentType = request.headers.get("content-type") || "";

        let fileBuffer: Buffer;
        let fileName: string;
        let mimeType: string;

        if (contentType.includes("application/json")) {
            // Base64 upload from mobile
            const body = await request.json();
            const { base64, filename, type } = body;

            if (!base64) {
                return NextResponse.json(
                    { error: "No base64 data provided" },
                    { status: 400 }
                );
            }

            // Remove data URL prefix if present
            const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
            fileBuffer = Buffer.from(base64Data, "base64");
            fileName = filename || `image-${Date.now()}.jpg`;
            mimeType = type || "image/jpeg";
        } else if (contentType.includes("multipart/form-data")) {
            // FormData upload
            const formData = await request.formData();
            const file = formData.get("file") as File;

            if (!file) {
                return NextResponse.json(
                    { error: "No file provided" },
                    { status: 400 }
                );
            }

            const bytes = await file.arrayBuffer();
            fileBuffer = Buffer.from(bytes);
            fileName = file.name;
            mimeType = file.type;
        } else {
            return NextResponse.json(
                { error: "Invalid content type" },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(mimeType)) {
            return NextResponse.json(
                { error: "Invalid file type. Only images are allowed." },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (fileBuffer.length > maxSize) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 5MB." },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const extension = fileName.split(".").pop() || "jpg";
        const storagePath = `mobile/${timestamp}-${randomStr}.${extension}`;

        // Upload to Supabase Storage - bucket name is "reports"
        const { data, error } = await supabase.storage
            .from("reports")
            .upload(storagePath, fileBuffer, {
                contentType: mimeType,
                upsert: false,
            });

        if (error) {
            console.error("Supabase upload error:", error);
            return NextResponse.json(
                { error: `Upload failed: ${error.message}` },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from("reports")
            .getPublicUrl(storagePath);

        return NextResponse.json({
            success: true,
            url: urlData.publicUrl,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Failed to process upload" },
            { status: 500 }
        );
    }
}
