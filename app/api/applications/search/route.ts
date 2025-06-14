import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { applicationId } = await request.json()

    if (!applicationId) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Query application with all related data
    const { data, error } = await supabase
      .from("business_application_info")
      .select(`
        *,
        business_info!inner(
          *,
          taxpayer_info!inner(*)
        ),
        reviewed_by_office(*)
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

    // Restructure data for the form
    const formData = {
      taxpayerInfo: {
        taxpayer_id: data.business_info.taxpayer_info.taxpayer_id,
        taxpayer_name: data.business_info.taxpayer_info.taxpayer_name,
        taxpayer_telephone_no: data.business_info.taxpayer_info.taxpayer_telephone_no,
        taxpayer_address: data.business_info.taxpayer_info.taxpayer_address,
        taxpayer_barangay_no: data.business_info.taxpayer_info.taxpayer_barangay_no,
      },
      businessInfo: {
        ...data.business_info,
        // Remove the nested taxpayer_info to avoid confusion
        taxpayer_info: undefined,
      },
      applicationInfo: {
        ...data,
        // Remove nested objects to avoid confusion
        business_info: undefined,
        reviewed_by_office: undefined,
      },
      officeReviews: data.reviewed_by_office || [],
    }

    return NextResponse.json(formData)
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
