import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json()

    if (!filePath) {
      return NextResponse.json({ error: "File path is required" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Create a signed URL that expires in 7 days
    const { data, error } = await supabase.storage
      .from("business-permit-documents")
      .createSignedUrl(filePath, 60 * 60 * 24 * 7) // 7 days in seconds

    if (error) {
      console.error("Error creating signed URL:", error)
      return NextResponse.json({ error: "Failed to create signed URL" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      signedUrl: data.signedUrl,
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
