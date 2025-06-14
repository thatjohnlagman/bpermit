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

export async function POST(request: NextRequest) {
  try {
    const { businessAccountNo, ...formData }: ApplicationFormData & { businessAccountNo: string } = await request.json()

    if (!businessAccountNo || !formData.applicationInfo) {
      return NextResponse.json({ error: "Missing required renewal data" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // First, get the existing application for this business
    const { data: existingApplications, error: fetchError } = await supabase
      .from("business_application_info")
      .select("application_id")
      .eq("business_account_no", businessAccountNo)
      .order("date_of_application", { ascending: false })
      .limit(1)

    if (fetchError) {
      console.error("Fetch existing application error:", fetchError)
      return NextResponse.json({ error: "Failed to fetch existing application" }, { status: 500 })
    }

    const currentDate = new Date().toISOString().split("T")[0]
    const sanitizedApplicationInfo = sanitizeDateFields(formData.applicationInfo)

    if (existingApplications && existingApplications.length > 0) {
      // Update existing application
      const existingApplicationId = existingApplications[0].application_id

      // Prepare update data (exclude system fields that shouldn't be updated)
      const {
        application_id,
        business_account_no: appBusinessAccountNo,
        date_of_application,
        business_plate_no,
        business_plate_date,
        permit_date_of_release,
        permit_time_of_release,
        permit_released_by,
        created_at,
        updated_at,
        ...updateableFields
      } = sanitizedApplicationInfo

      // Update the renewal fields
      const renewalUpdateData = {
        ...updateableFields,
        official_receipt_date: currentDate, // Update receipt date for renewal
        amount_paid: 1500, // Renewal fee
        // Clear pickup/release information for new renewal cycle
        permit_date_of_release: null,
        permit_time_of_release: null,
        permit_released_by: null,
      }

      const { error: updateError } = await supabase
        .from("business_application_info")
        .update(renewalUpdateData)
        .eq("application_id", existingApplicationId)

      if (updateError) {
        console.error("Application update error:", updateError)
        return NextResponse.json(
          {
            error: "Failed to update renewal application",
            details: updateError.message,
          },
          { status: 500 },
        )
      }

      // Delete existing office reviews for this application
      const { error: deleteReviewsError } = await supabase
        .from("reviewed_by_office")
        .delete()
        .eq("application_id", existingApplicationId)

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

      // Insert new office reviews if provided
      if (formData.officeReviews && formData.officeReviews.length > 0) {
        const officeReviewsWithApplicationId = formData.officeReviews.map((review) => ({
          ...review,
          application_id: existingApplicationId,
          office_reviewed_date: sanitizeDateField(review.office_reviewed_date),
        }))

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
        message: "Renewal application updated successfully",
        applicationId: existingApplicationId,
      })
    } else {
      // Create new application if none exists
      const currentYear = new Date().getFullYear()
      const randomNumber = Math.floor(Math.random() * 99999)
        .toString()
        .padStart(5, "0")
      const businessPlateNo = `${currentYear}-${randomNumber}`

      const renewalApplicationInfo = {
        ...sanitizedApplicationInfo,
        business_account_no: businessAccountNo,
        date_of_application: currentDate,
        official_receipt_date: currentDate,
        amount_paid: 1500,
        business_plate_no: businessPlateNo,
        business_plate_date: currentDate,
        // Ensure pickup/release fields are cleared for renewal
        permit_date_of_release: null,
        permit_time_of_release: null,
        permit_released_by: null,
      }

      // Insert new application record
      const { data: applicationData, error: applicationError } = await supabase
        .from("business_application_info")
        .insert([renewalApplicationInfo])
        .select()
        .single()

      if (applicationError) {
        console.error("Renewal application insert error:", applicationError)
        return NextResponse.json(
          {
            error: "Failed to create renewal application",
            details: applicationError.message,
          },
          { status: 500 },
        )
      }

      // Insert office reviews if provided
      if (formData.officeReviews && formData.officeReviews.length > 0) {
        const officeReviewsWithApplicationId = formData.officeReviews.map((review) => ({
          ...review,
          application_id: applicationData.application_id,
          office_reviewed_date: sanitizeDateField(review.office_reviewed_date),
        }))

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
        message: "Renewal application created successfully",
        applicationId: applicationData.application_id,
        businessPlateNo: businessPlateNo,
      })
    }
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
