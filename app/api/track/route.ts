import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { applicationId } = await request.json()

    if (!applicationId) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Query application with related data
    const { data, error } = await supabase
      .from("business_application_info")
      .select(`
        *,
        business_info!inner(
          business_trade_name,
          taxpayer_info!inner(
            taxpayer_name
          )
        )
      `)
      .eq("application_id", applicationId)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Application not found" }, { status: 404 })
      }
      console.error("Database error:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    // Flatten the response for easier access
    const result = {
      ...data,
      business_trade_name: data.business_info.business_trade_name,
      taxpayer_name: data.business_info.taxpayer_info.taxpayer_name,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
