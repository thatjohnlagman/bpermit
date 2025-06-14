import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { type NextRequest, NextResponse } from "next/server"
import type { ApplicationFormData } from "@/lib/types"

// Helper function to convert empty date strings to null
function sanitizeDateField(dateValue: string | undefined): string | null {
  if (!dateValue || dateValue.trim() === "") {
    return null
  }
  return dateValue
}

// Helper function to sanitize all date fields in an object
function sanitizeDateFields(obj: any): any {
  const sanitized = { ...obj }

  // List of date fields that might be empty
  const dateFields = ["insurance_date", "period_date", "mayor_permit_date"]

  dateFields.forEach((field) => {
    if (field in sanitized) {
      sanitized[field] = sanitizeDateField(sanitized[field])
    }
  })

  return sanitized
}

export async function POST(request: NextRequest) {
  try {
    const formData: ApplicationFormData = await request.json()
    const supabase = getSupabaseAdmin()

    // Validate that required data exists
    if (!formData.taxpayerInfo || !formData.businessInfo || !formData.applicationInfo) {
      return NextResponse.json({ error: "Missing required form data" }, { status: 400 })
    }

    // Start a transaction-like operation
    // 1. Insert taxpayer info
    console.log("Inserting taxpayer info:", formData.taxpayerInfo)

    const { data: taxpayerData, error: taxpayerError } = await supabase
      .from("taxpayer_info")
      .insert([formData.taxpayerInfo])
      .select()
      .single()

    if (taxpayerError) {
      console.error("Taxpayer insert error:", taxpayerError)

      // Check if it's a table not found error
      if (taxpayerError.code === "42P01") {
        return NextResponse.json(
          {
            error: "Database tables not found. Please initialize the database first.",
            details: "Run the SQL scripts to create the required tables.",
          },
          { status: 500 },
        )
      }

      return NextResponse.json(
        {
          error: "Failed to save taxpayer information",
          details: taxpayerError.message,
        },
        { status: 500 },
      )
    }

    if (!taxpayerData) {
      return NextResponse.json({ error: "Failed to create taxpayer record" }, { status: 500 })
    }

    // 2. Insert business info with taxpayer_id
    const businessInfoWithTaxpayerId = {
      ...formData.businessInfo,
      taxpayer_id: taxpayerData.taxpayer_id,
    }

    console.log("Inserting business info:", businessInfoWithTaxpayerId)

    const { data: businessData, error: businessError } = await supabase
      .from("business_info")
      .insert([businessInfoWithTaxpayerId])
      .select()
      .single()

    if (businessError) {
      console.error("Business insert error:", businessError)
      return NextResponse.json(
        {
          error: "Failed to save business information",
          details: businessError.message,
        },
        { status: 500 },
      )
    }

    if (!businessData) {
      return NextResponse.json({ error: "Failed to create business record" }, { status: 500 })
    }

    // 3. Insert application info with business_account_no and auto-generated fields
    const currentDate = new Date().toISOString().split("T")[0] // YYYY-MM-DD format
    const currentYear = new Date().getFullYear()
    const randomNumber = Math.floor(Math.random() * 99999)
      .toString()
      .padStart(5, "0")
    const businessPlateNo = `${currentYear}-${randomNumber}`

    // Sanitize the application info to handle empty date strings
    const sanitizedApplicationInfo = sanitizeDateFields(formData.applicationInfo)

    const applicationInfoWithDefaults = {
      ...sanitizedApplicationInfo,
      business_account_no: businessData.business_account_no,
      date_of_application: currentDate,
      official_receipt_date: currentDate,
      amount_paid: 1500, // Static amount as specified
      business_plate_no: businessPlateNo,
      business_plate_date: currentDate,
    }

    console.log("Inserting application info:", applicationInfoWithDefaults)

    const { data: applicationData, error: applicationError } = await supabase
      .from("business_application_info")
      .insert([applicationInfoWithDefaults])
      .select()
      .single()

    if (applicationError) {
      console.error("Application insert error:", applicationError)
      return NextResponse.json(
        {
          error: "Failed to save application information",
          details: applicationError.message,
        },
        { status: 500 },
      )
    }

    if (!applicationData) {
      return NextResponse.json({ error: "Failed to create application record" }, { status: 500 })
    }

    // 4. Insert office reviews with application_id
    if (formData.officeReviews && formData.officeReviews.length > 0) {
      const officeReviewsWithApplicationId = formData.officeReviews.map((review) => ({
        ...review,
        application_id: applicationData.application_id,
        office_reviewed_date: sanitizeDateField(review.office_reviewed_date),
      }))

      console.log("Inserting office reviews:", officeReviewsWithApplicationId)

      const { error: reviewsError } = await supabase.from("reviewed_by_office").insert(officeReviewsWithApplicationId)

      if (reviewsError) {
        console.error("Office reviews insert error:", reviewsError)
        return NextResponse.json(
          {
            error: "Failed to save office reviews",
            details: reviewsError.message,
          },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      applicationId: applicationData.application_id,
      businessPlateNo: businessPlateNo,
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
