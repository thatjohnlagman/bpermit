"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Database, ExternalLink } from "lucide-react"

export default function SetupDatabasePage() {
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const checkDatabase = async () => {
    setChecking(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/init-database", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || "Failed to check database")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">Database Setup</h1>
        <p className="text-gray-600">Initialize and verify your database configuration</p>
      </div>

      <Card className="ph-card">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Database Status Check
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={checkDatabase} disabled={checking} className="ph-button">
            {checking ? "Checking..." : "Check Database Status"}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold">Database Error:</p>
                  <p>{error}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {result && result.success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card className="ph-card">
        <CardHeader>
          <CardTitle className="text-blue-800">Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Step 1: Access Supabase Dashboard</h3>
              <p className="text-sm text-gray-700 mb-2">
                Go to your Supabase project dashboard and navigate to the SQL Editor.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                  Open Supabase Dashboard
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Step 2: Run SQL Script</h3>
              <p className="text-sm text-gray-700 mb-2">
                Copy and run the following SQL script in your Supabase SQL Editor:
              </p>
              <div className="bg-gray-900 text-green-400 p-4 rounded text-xs font-mono overflow-x-auto">
                <pre>{`-- Enable the pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create TAXPAYER_INFO table
CREATE TABLE IF NOT EXISTS taxpayer_info (
    taxpayer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    taxpayer_name VARCHAR(255) NOT NULL,
    taxpayer_telephone_no VARCHAR(20) NOT NULL,
    taxpayer_address TEXT NOT NULL,
    taxpayer_barangay_no VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create BUSINESS_INFO table
CREATE TABLE IF NOT EXISTS business_info (
    business_account_no UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_capital NUMERIC(15, 2) NOT NULL,
    business_trade_name VARCHAR(255) NOT NULL,
    business_telephone_no VARCHAR(20) NOT NULL,
    business_fax_no VARCHAR(20),
    commercial_address_building_name VARCHAR(255) NOT NULL,
    commercial_address_building_no VARCHAR(20) NOT NULL,
    commercial_address_street VARCHAR(255) NOT NULL,
    commercial_address_barangay_no VARCHAR(20) NOT NULL,
    main_line_of_business VARCHAR(255) NOT NULL,
    main_products_services TEXT NOT NULL,
    other_lines_of_business TEXT,
    other_products_services TEXT,
    business_ownership_type VARCHAR(50) NOT NULL CHECK (business_ownership_type IN ('Sole Proprietorship', 'Partnership', 'Corporation')),
    no_of_employees INTEGER DEFAULT 0,
    sec_registration_no VARCHAR(100),
    sec_registration_file_url TEXT,
    dti_registration_no VARCHAR(100),
    dti_registration_file_url TEXT,
    taxpayer_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_taxpayer FOREIGN KEY (taxpayer_id) REFERENCES taxpayer_info(taxpayer_id) ON DELETE CASCADE
);

-- Create BUSINESS_APPLICATION_INFO table
CREATE TABLE IF NOT EXISTS business_application_info (
    application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_account_no UUID NOT NULL,
    date_of_application DATE NOT NULL,
    official_receipt_date DATE NOT NULL,
    amount_paid NUMERIC(10,2) DEFAULT 1500,
    barangay_clearance_file_url TEXT NOT NULL,
    insurance_issuing_company VARCHAR(255),
    insurance_date DATE,
    proof_of_ownership_type VARCHAR(255) NOT NULL,
    is_owned_property BOOLEAN NOT NULL DEFAULT FALSE,
    property_registered_name VARCHAR(255),
    real_property_tax_receipt_no VARCHAR(100),
    period_date DATE,
    owned_property_document_file_url TEXT,
    is_leased_property BOOLEAN NOT NULL DEFAULT FALSE,
    lessor_name VARCHAR(255),
    leased_area_sq_meter NUMERIC(10,2),
    rent_per_month NUMERIC(10,2),
    leased_property_document_file_url TEXT,
    applicant_name VARCHAR(255),
    applicant_position VARCHAR(100),
    business_plate_no VARCHAR(100) UNIQUE,
    business_plate_date DATE,
    mayor_permit_no VARCHAR(100) NOT NULL,
    mayor_permit_received_by VARCHAR(255) NOT NULL,
    mayor_permit_date DATE NOT NULL,
    mayor_permit_file_url TEXT NOT NULL,
    permit_date_of_release DATE,
    permit_time_of_release TIME,
    permit_released_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_business_info FOREIGN KEY (business_account_no) REFERENCES business_info(business_account_no) ON DELETE CASCADE
);

-- Create REVIEWED_BY_OFFICE table
CREATE TABLE IF NOT EXISTS reviewed_by_office (
    reviewed_by_office_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL,
    office_name VARCHAR(100) NOT NULL,
    remarks_and_recommendation TEXT,
    office_reviewed_by VARCHAR(255) NOT NULL,
    office_reviewed_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_application FOREIGN KEY (application_id) REFERENCES business_application_info(application_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_info_taxpayer_id ON business_info(taxpayer_id);
CREATE INDEX IF NOT EXISTS idx_business_application_info_business_account_no ON business_application_info(business_account_no);
CREATE INDEX IF NOT EXISTS idx_reviewed_by_office_application_id ON reviewed_by_office(application_id);
CREATE INDEX IF NOT EXISTS idx_business_application_info_business_plate_no ON business_application_info(business_plate_no);
CREATE INDEX IF NOT EXISTS idx_business_application_info_mayor_permit_no ON business_application_info(mayor_permit_no);`}</pre>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Step 3: Verify Setup</h3>
              <p className="text-sm text-gray-700">
                After running the SQL script, click "Check Database Status" above to verify everything is working
                correctly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="ph-card">
        <CardHeader>
          <CardTitle className="text-blue-800">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Button asChild variant="outline">
              <a href="/test-upload">Test File Upload</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/apply">Test Application Form</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
