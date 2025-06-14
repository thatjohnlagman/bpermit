import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    // Fetch all applications with related data
    const { data: applications, error } = await supabase
      .from("business_application_info")
      .select(`
        *,
        business_info!inner(
          *,
          taxpayer_info!inner(*)
        ),
        reviewed_by_office(*)
      `)
      .order("date_of_application", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
    }

    // Flatten the data structure for easier use
    const flattenedApplications = applications.map((app) => ({
      ...app,
      // Business info
      business_trade_name: app.business_info.business_trade_name,
      business_capital: app.business_info.business_capital,
      business_ownership_type: app.business_info.business_ownership_type,
      business_telephone_no: app.business_info.business_telephone_no,
      business_fax_no: app.business_info.business_fax_no,
      no_of_employees: app.business_info.no_of_employees,
      main_line_of_business: app.business_info.main_line_of_business,
      main_products_services: app.business_info.main_products_services,
      commercial_address_building_name: app.business_info.commercial_address_building_name,
      commercial_address_building_no: app.business_info.commercial_address_building_no,
      commercial_address_street: app.business_info.commercial_address_street,
      commercial_address_barangay_no: app.business_info.commercial_address_barangay_no,
      sec_registration_no: app.business_info.sec_registration_no,
      sec_registration_file_url: app.business_info.sec_registration_file_url,
      dti_registration_no: app.business_info.dti_registration_no,
      dti_registration_file_url: app.business_info.dti_registration_file_url,
      business_account_no: app.business_info.business_account_no,
      // Taxpayer info
      taxpayer_id: app.business_info.taxpayer_info.taxpayer_id,
      taxpayer_name: app.business_info.taxpayer_info.taxpayer_name,
      taxpayer_telephone_no: app.business_info.taxpayer_info.taxpayer_telephone_no,
      taxpayer_address: app.business_info.taxpayer_info.taxpayer_address,
      taxpayer_barangay_no: app.business_info.taxpayer_info.taxpayer_barangay_no,
      // Office reviews
      office_reviews: app.reviewed_by_office,
    }))

    // Calculate stats
    const stats = {
      total: applications.length,
      processing: applications.filter((app) => !app.permit_date_of_release && !app.permit_time_of_release).length,
      ready: applications.filter(
        (app) => app.permit_date_of_release && app.permit_time_of_release && !app.permit_released_by,
      ).length,
      completed: applications.filter((app) => app.permit_released_by).length,
    }

    return NextResponse.json({
      applications: flattenedApplications,
      stats,
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const applicationData = await request.json()

    if (!applicationData.application_id) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 })
    }

    // Validate insurance information
    if (
      (applicationData.insurance_issuing_company && !applicationData.insurance_date) ||
      (applicationData.insurance_date && !applicationData.insurance_issuing_company)
    ) {
      return NextResponse.json(
        {
          error: "Both insurance company and insurance date are required when providing insurance information",
        },
        { status: 400 },
      )
    }

    // Validate applicant information
    if (
      (applicationData.applicant_name && !applicationData.applicant_position) ||
      (applicationData.applicant_position && !applicationData.applicant_name)
    ) {
      return NextResponse.json(
        {
          error: "Both applicant name and position are required when providing applicant information",
        },
        { status: 400 },
      )
    }

    const supabase = getSupabaseAdmin()

    // Update application info with all editable fields
    const applicationUpdateData = {
      amount_paid: applicationData.amount_paid,
      mayor_permit_no: applicationData.mayor_permit_no,
      mayor_permit_received_by: applicationData.mayor_permit_received_by,
      mayor_permit_date: applicationData.mayor_permit_date,
      proof_of_ownership_type: applicationData.proof_of_ownership_type,
      insurance_issuing_company: applicationData.insurance_issuing_company,
      insurance_date: applicationData.insurance_date || null,
      permit_date_of_release: applicationData.permit_date_of_release || null,
      permit_time_of_release: applicationData.permit_time_of_release || null,
      permit_released_by: applicationData.permit_released_by || null,
      applicant_name: applicationData.applicant_name,
      applicant_position: applicationData.applicant_position,
      property_registered_name: applicationData.property_registered_name,
      real_property_tax_receipt_no: applicationData.real_property_tax_receipt_no,
      period_date: applicationData.period_date || null,
      lessor_name: applicationData.lessor_name,
      leased_area_sq_meter: applicationData.leased_area_sq_meter,
      rent_per_month: applicationData.rent_per_month,
      // Document URLs
      barangay_clearance_file_url: applicationData.barangay_clearance_file_url,
      mayor_permit_file_url: applicationData.mayor_permit_file_url,
      owned_property_document_file_url: applicationData.owned_property_document_file_url,
      leased_property_document_file_url: applicationData.leased_property_document_file_url,
    }

    const { error: appError } = await supabase
      .from("business_application_info")
      .update(applicationUpdateData)
      .eq("application_id", applicationData.application_id)

    if (appError) {
      console.error("Application update error:", appError)
      return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
    }

    // Update business info if business_account_no is provided
    if (applicationData.business_account_no) {
      const businessUpdateData = {
        business_trade_name: applicationData.business_trade_name,
        business_capital: applicationData.business_capital,
        business_telephone_no: applicationData.business_telephone_no,
        business_fax_no: applicationData.business_fax_no,
        main_line_of_business: applicationData.main_line_of_business,
        main_products_services: applicationData.main_products_services,
        business_ownership_type: applicationData.business_ownership_type,
        no_of_employees: applicationData.no_of_employees,
        commercial_address_building_name: applicationData.commercial_address_building_name,
        commercial_address_building_no: applicationData.commercial_address_building_no,
        commercial_address_street: applicationData.commercial_address_street,
        commercial_address_barangay_no: applicationData.commercial_address_barangay_no,
        sec_registration_no: applicationData.sec_registration_no,
        sec_registration_file_url: applicationData.sec_registration_file_url,
        dti_registration_no: applicationData.dti_registration_no,
        dti_registration_file_url: applicationData.dti_registration_file_url,
      }

      const { error: businessError } = await supabase
        .from("business_info")
        .update(businessUpdateData)
        .eq("business_account_no", applicationData.business_account_no)

      if (businessError) {
        console.error("Business update error:", businessError)
        return NextResponse.json({ error: "Failed to update business info" }, { status: 500 })
      }
    }

    // Update taxpayer info if taxpayer_id is provided
    if (applicationData.taxpayer_id) {
      const taxpayerUpdateData = {
        taxpayer_name: applicationData.taxpayer_name,
        taxpayer_telephone_no: applicationData.taxpayer_telephone_no,
        taxpayer_address: applicationData.taxpayer_address,
        taxpayer_barangay_no: applicationData.taxpayer_barangay_no,
      }

      const { error: taxpayerError } = await supabase
        .from("taxpayer_info")
        .update(taxpayerUpdateData)
        .eq("taxpayer_id", applicationData.taxpayer_id)

      if (taxpayerError) {
        console.error("Taxpayer update error:", taxpayerError)
        return NextResponse.json({ error: "Failed to update taxpayer info" }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Application updated successfully",
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get("id")

    if (!applicationId) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Delete application (cascading deletes will handle related records)
    const { error } = await supabase.from("business_application_info").delete().eq("application_id", applicationId)

    if (error) {
      console.error("Delete error:", error)
      return NextResponse.json({ error: "Failed to delete application" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Application deleted successfully",
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
