import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { businessAccountNo } = await request.json()

    if (!businessAccountNo) {
      return NextResponse.json({ error: "Business Account Number is required" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // First, let's query for businesses with the given account number
    const { data: matchingBusiness, error: businessError } = await supabase
      .from("business_info")
      .select(`
        *,
        taxpayer_info!inner(*)
      `)
      .eq("business_account_no", businessAccountNo)
      .single()

    if (businessError) {
      console.error("Business query error:", businessError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    // Check if any businesses were found
    if (!matchingBusiness) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    // Get the latest application for this business
    const { data: applicationList, error: applicationError } = await supabase
      .from("business_application_info")
      .select("*")
      .eq("business_account_no", businessAccountNo)
      .order("date_of_application", { ascending: false })
      .limit(1)

    if (applicationError) {
      console.error("Application query error:", applicationError)
      return NextResponse.json({ error: "Failed to fetch application data" }, { status: 500 })
    }

    // Use the latest application or create empty defaults
    const latestApplication =
      applicationList && applicationList.length > 0
        ? applicationList[0]
        : {
            barangay_clearance_file_url: "",
            insurance_issuing_company: "",
            insurance_date: "",
            proof_of_ownership_type: "",
            proof_of_ownership_file_url: "",
            is_owned_property: false,
            property_registered_name: "",
            real_property_tax_receipt_no: "",
            period_date: "",
            owned_property_document_file_url: "",
            is_leased_property: false,
            lessor_name: "",
            leased_area_sq_meter: 0,
            rent_per_month: 0,
            leased_property_document_file_url: "",
            applicant_name: "",
            applicant_position: "",
            mayor_permit_no: "",
            mayor_permit_received_by: "",
            mayor_permit_date: "",
            mayor_permit_file_url: "",
          }

    // Restructure data for the renewal form
    const formData = {
      taxpayerInfo: {
        taxpayer_id: matchingBusiness.taxpayer_info.taxpayer_id,
        taxpayer_name: matchingBusiness.taxpayer_info.taxpayer_name,
        taxpayer_telephone_no: matchingBusiness.taxpayer_info.taxpayer_telephone_no,
        taxpayer_address: matchingBusiness.taxpayer_info.taxpayer_address,
        taxpayer_barangay_no: matchingBusiness.taxpayer_info.taxpayer_barangay_no,
      },
      businessInfo: {
        business_account_no: matchingBusiness.business_account_no,
        business_capital: matchingBusiness.business_capital,
        business_trade_name: matchingBusiness.business_trade_name,
        business_telephone_no: matchingBusiness.business_telephone_no,
        business_fax_no: matchingBusiness.business_fax_no,
        commercial_address_building_name: matchingBusiness.commercial_address_building_name,
        commercial_address_building_no: matchingBusiness.commercial_address_building_no,
        commercial_address_street: matchingBusiness.commercial_address_street,
        commercial_address_barangay_no: matchingBusiness.commercial_address_barangay_no,
        main_line_of_business: matchingBusiness.main_line_of_business,
        main_products_services: matchingBusiness.main_products_services,
        other_lines_of_business: matchingBusiness.other_lines_of_business,
        other_products_services: matchingBusiness.other_products_services,
        business_ownership_type: matchingBusiness.business_ownership_type,
        no_of_employees: matchingBusiness.no_of_employees,
        sec_registration_no: matchingBusiness.sec_registration_no,
        sec_registration_file_url: matchingBusiness.sec_registration_file_url,
        dti_registration_no: matchingBusiness.dti_registration_no,
        dti_registration_file_url: matchingBusiness.dti_registration_file_url,
        taxpayer_id: matchingBusiness.taxpayer_id,
      },
      applicationInfo: latestApplication,
    }

    return NextResponse.json(formData)
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
