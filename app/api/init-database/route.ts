import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = getSupabaseAdmin()

    // Check if tables exist by trying to query them
    const { data: taxpayerCheck, error: taxpayerError } = await supabase.from("taxpayer_info").select("count").limit(1)

    if (taxpayerError && taxpayerError.code === "42P01") {
      return NextResponse.json(
        {
          success: false,
          error: "Database tables not found. Please run the SQL scripts to create the tables first.",
          details: "Go to your Supabase dashboard > SQL Editor and run the table creation scripts.",
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Database tables are properly configured",
    })
  } catch (error) {
    console.error("Database initialization check error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check database configuration",
        details: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
