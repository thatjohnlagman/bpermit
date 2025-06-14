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
  const dateFields = ["insurance_date", "period_date", "mayor_permit_date"]

  dateFields.forEach((field) => {
    if (field in sanitized) {
      sanitized[field] = sanitizeDateField(sanitized[field])
    }
  })

  return sanitized
}

export async function PUT(request: NextRequest) {
  try {
    const { applicationId, ...formData }: ApplicationFormData & { applicationId: string } = await request.json()

    if (!applicationId || !formData.taxpayerInfo || !formData.businessInfo || !formData.applicationInfo) {
      return NextResponse.json({ error: "Missing required modification data" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Update taxpayer info
    const { error: taxpayerError } = await supabase
      .from("taxpayer_info")
      .update({
        taxpayer_name: formData.taxpayerInfo.taxpayer_name,
        taxpayer_telephone_no: formData.taxpayerInfo.taxpayer_telephone_no,
        taxpayer_address: formData.taxpayerInfo.taxpayer_address,
        taxpayer_barangay_no: formData.taxpayerInfo.taxpayer_barangay_no,
      })
      .eq("taxpayer_id", formData.businessInfo.taxpayer_id)

    if (taxpayerError) {
      console.error("Taxpayer update error:", taxpayerError)
      return NextResponse.json(
        {
          error: "Failed to update taxpayer information",
          details: taxpayerError.message,
        },
        { status: 500 },
      )
    }

    // Update business info (exclude taxpayer_info nested object)
    const { taxpayer_info, business_account_no, created_at, updated_at, ...updateableBusinessInfo } =
      formData.businessInfo

    const { error: businessError } = await supabase
      .from("business_info")
      .update(updateableBusinessInfo)
      .eq("business_account_no", formData.businessInfo.business_account_no)

    if (businessError) {
      console.error("Business update error:", businessError)
      return NextResponse.json(
        {
          error: "Failed to update business information",
          details: businessError.message,
        },
        { status: 500 },
      )
    }

    // Update application info (excluding system-generated fields)
    const sanitizedApplicationInfo = sanitizeDateFields(formData.applicationInfo)

    // Remove system-generated fields that shouldn't be updated
    const {
      application_id,
      business_account_no: appBusinessAccountNo,
      date_of_application,
      official_receipt_date,
      amount_paid,
      business_plate_no,
      business_plate_date,
      permit_date_of_release,
      permit_time_of_release,
      permit_released_by,
      created_at: appCreatedAt,
      updated_at: appUpdatedAt,
      ...updateableApplicationInfo
    } = sanitizedApplicationInfo

    const { error: applicationError } = await supabase
      .from("business_application_info")
      .update(updateableApplicationInfo)
      .eq("application_id", applicationId)

    if (applicationError) {
      console.error("Application update error:", applicationError)
      return NextResponse.json(
        {
          error: "Failed to update application information",
          details: applicationError.message,
        },
        { status: 500 },
      )
    }

    // Delete existing office reviews and insert new ones
    const { error: deleteReviewsError } = await supabase
      .from("reviewed_by_office")
      .delete()
      .eq("application_id", applicationId)

    if (deleteReviewsError) {
      console.error("Delete reviews error:", deleteReviewsError)
      return NextResponse.json(
        {
          error: "Failed to update office reviews",
          details: deleteReviewsError.message,
        },
        { status: 500 },
      )
    }

    // Insert updated office reviews
    if (formData.officeReviews && formData.officeReviews.length > 0) {
      const officeReviewsWithApplicationId = formData.officeReviews.map((review) => ({
        office_name: review.office_name,
        remarks_and_recommendation: review.remarks_and_recommendation,
        office_reviewed_by: review.office_reviewed_by,
        office_reviewed_date: sanitizeDateField(review.office_reviewed_date),
        application_id: applicationId,
      }))

      const { error: reviewsError } = await supabase.from("reviewed_by_office").insert(officeReviewsWithApplicationId)

      if (reviewsError) {
        console.error("Office reviews insert error:", reviewsError)
        return NextResponse.json(
          {
            error: "Failed to save updated office reviews",
            details: reviewsError.message,
          },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: "Application updated successfully",
      applicationId: applicationId,
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
