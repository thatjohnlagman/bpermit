"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { ApplicationFormData } from "@/lib/types"
import { FileUpload } from "@/components/file-upload"
import { useState } from "react"

interface ApplicationDetailsFormProps {
  data: ApplicationFormData
  updateData: (section: keyof ApplicationFormData, data: any) => void
}

export function ApplicationDetailsForm({ data, updateData }: ApplicationDetailsFormProps) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validatePositiveNumber = (value: number, fieldName: string): string => {
    if (value < 0) return `${fieldName} cannot be negative`
    if (value === 0) return `${fieldName} must be greater than 0`
    return ""
  }

  const validateField = (field: string, value: string | number | boolean) => {
    let error = ""

    switch (field) {
      case "proof_of_ownership_type":
        if (!String(value).trim()) error = "Proof of ownership type is required"
        break
      case "property_registered_name":
        if (data.applicationInfo.is_owned_property && !String(value).trim()) {
          error = "Property registered name is required"
        }
        break
      case "real_property_tax_receipt_no":
        if (data.applicationInfo.is_owned_property && !String(value).trim()) {
          error = "Real property tax receipt number is required"
        }
        break
      case "period_date":
        if (data.applicationInfo.is_owned_property && !String(value).trim()) {
          error = "Period date is required"
        }
        break
      case "lessor_name":
        if (data.applicationInfo.is_leased_property && !String(value).trim()) {
          error = "Lessor name is required"
        }
        break
      case "leased_area_sq_meter":
        if (data.applicationInfo.is_leased_property) {
          error = validatePositiveNumber(Number(value), "Leased area")
        }
        break
      case "rent_per_month":
        if (data.applicationInfo.is_leased_property) {
          error = validatePositiveNumber(Number(value), "Rent per month")
        }
        break
      case "mayor_permit_no":
        if (!String(value).trim()) error = "Mayor permit number is required"
        break
      case "mayor_permit_received_by":
        if (!String(value).trim()) error = "Mayor permit received by is required"
        break
      case "mayor_permit_date":
        if (!String(value).trim()) error = "Mayor permit date is required"
        break
    }

    setFieldErrors((prev) => ({
      ...prev,
      [field]: error,
    }))

    return error === ""
  }

  const handleChange = (field: string, value: string | number | boolean) => {
    updateData("applicationInfo", {
      ...data.applicationInfo,
      [field]: value,
    })

    validateField(field, value)
  }

  const handleFileUpload = (field: string, url: string) => {
    updateData("applicationInfo", {
      ...data.applicationInfo,
      [field]: url,
    })
  }

  const handlePropertyTypeChange = (type: "owned" | "leased", checked: boolean) => {
    if (type === "owned") {
      updateData("applicationInfo", {
        ...data.applicationInfo,
        is_owned_property: checked,
        is_leased_property: checked ? false : data.applicationInfo.is_leased_property,
      })
    } else {
      updateData("applicationInfo", {
        ...data.applicationInfo,
        is_leased_property: checked,
        is_owned_property: checked ? false : data.applicationInfo.is_owned_property,
      })
    }
  }

  return (
    <Card className="ph-card">
      <CardHeader>
        <CardTitle className="text-blue-800">Application Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Required Documents */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-800">Required Documents</h3>

          <div>
            <Label className="required">Barangay Clearance Document</Label>
            <FileUpload
              onUpload={(url) => handleFileUpload("barangay_clearance_file_url", url)}
              currentFile={data.applicationInfo.barangay_clearance_file_url}
              accept=".pdf,.jpg,.jpeg,.png"
              label="Upload Barangay Clearance"
            />
          </div>

          <div>
            <Label htmlFor="proof_of_ownership_type" className="required">
              Proof of Ownership Type
            </Label>
            <Input
              id="proof_of_ownership_type"
              value={data.applicationInfo.proof_of_ownership_type}
              onChange={(e) => handleChange("proof_of_ownership_type", e.target.value)}
              placeholder="e.g., Deed of Sale, Lease Agreement"
            />
          </div>
        </div>

        {/* Insurance Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-800">Insurance Information</h3>
          <p className="text-sm text-gray-600">
            If you provide insurance information, both company name and date are required.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="insurance_issuing_company"
                className={
                  data.applicationInfo.insurance_date && !data.applicationInfo.insurance_issuing_company
                    ? "required"
                    : ""
                }
              >
                Insurance Issuing Company
              </Label>
              <Input
                id="insurance_issuing_company"
                value={data.applicationInfo.insurance_issuing_company || ""}
                onChange={(e) => handleChange("insurance_issuing_company", e.target.value)}
                placeholder="Enter insurance company name"
              />
            </div>
            <div>
              <Label
                htmlFor="insurance_date"
                className={
                  data.applicationInfo.insurance_issuing_company && !data.applicationInfo.insurance_date
                    ? "required"
                    : ""
                }
              >
                Insurance Date
              </Label>
              <Input
                id="insurance_date"
                type="date"
                value={data.applicationInfo.insurance_date || ""}
                onChange={(e) => handleChange("insurance_date", e.target.value)}
              />
            </div>
          </div>
          {((data.applicationInfo.insurance_issuing_company && !data.applicationInfo.insurance_date) ||
            (data.applicationInfo.insurance_date && !data.applicationInfo.insurance_issuing_company)) && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              Both insurance company and insurance date are required when providing insurance information.
            </div>
          )}
        </div>

        {/* Property Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-800">Property Information</h3>
          <p className="text-sm text-gray-600">Please select one option below:</p>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_owned_property"
                checked={data.applicationInfo.is_owned_property}
                onCheckedChange={(checked) => handlePropertyTypeChange("owned", checked as boolean)}
              />
              <Label htmlFor="is_owned_property" className="font-medium">
                Owned Property
              </Label>
            </div>

            {data.applicationInfo.is_owned_property && (
              <div className="ml-6 space-y-4 p-4 bg-blue-50 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="property_registered_name" className="required">
                      Property Registered Name
                    </Label>
                    <Input
                      id="property_registered_name"
                      value={data.applicationInfo.property_registered_name || ""}
                      onChange={(e) => handleChange("property_registered_name", e.target.value)}
                      placeholder="Enter registered property name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="real_property_tax_receipt_no" className="required">
                      Real Property Tax Receipt No.
                    </Label>
                    <Input
                      id="real_property_tax_receipt_no"
                      value={data.applicationInfo.real_property_tax_receipt_no || ""}
                      onChange={(e) => handleChange("real_property_tax_receipt_no", e.target.value)}
                      placeholder="Enter receipt number"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="period_date" className="required">
                    Period Date
                  </Label>
                  <Input
                    id="period_date"
                    type="date"
                    value={data.applicationInfo.period_date || ""}
                    onChange={(e) => handleChange("period_date", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="required">Owned Property Document (e.g., Land Title)</Label>
                  <FileUpload
                    onUpload={(url) => handleFileUpload("owned_property_document_file_url", url)}
                    currentFile={data.applicationInfo.owned_property_document_file_url}
                    accept=".pdf,.jpg,.jpeg,.png"
                    label="Upload Owned Property Document"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_leased_property"
                checked={data.applicationInfo.is_leased_property}
                onCheckedChange={(checked) => handlePropertyTypeChange("leased", checked as boolean)}
              />
              <Label htmlFor="is_leased_property" className="font-medium">
                Leased Property
              </Label>
            </div>

            {data.applicationInfo.is_leased_property && (
              <div className="ml-6 space-y-4 p-4 bg-green-50 rounded-lg">
                <div>
                  <Label htmlFor="lessor_name" className="required">
                    Lessor Name
                  </Label>
                  <Input
                    id="lessor_name"
                    value={data.applicationInfo.lessor_name || ""}
                    onChange={(e) => handleChange("lessor_name", e.target.value)}
                    placeholder="Enter lessor's name"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="leased_area_sq_meter" className="required">
                      Leased Area (sq. meters)
                    </Label>
                    <Input
                      id="leased_area_sq_meter"
                      type="number"
                      value={data.applicationInfo.leased_area_sq_meter || 0}
                      onChange={(e) => {
                        const value = Number.parseFloat(e.target.value) || 0
                        if (value >= 0) {
                          handleChange("leased_area_sq_meter", value)
                        }
                      }}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className={`${fieldErrors.leased_area_sq_meter ? "border-red-500" : ""}`}
                    />
                    {fieldErrors.leased_area_sq_meter && (
                      <p className="text-sm text-red-600 mt-1">{fieldErrors.leased_area_sq_meter}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="rent_per_month" className="required">
                      Rent per Month (₱)
                    </Label>
                    <Input
                      id="rent_per_month"
                      type="number"
                      value={data.applicationInfo.rent_per_month || 0}
                      onChange={(e) => {
                        const value = Number.parseFloat(e.target.value) || 0
                        if (value >= 0) {
                          handleChange("rent_per_month", value)
                        }
                      }}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <Label className="required">Leased Property Document (e.g., Lease Contract)</Label>
                  <FileUpload
                    onUpload={(url) => handleFileUpload("leased_property_document_file_url", url)}
                    currentFile={data.applicationInfo.leased_property_document_file_url}
                    accept=".pdf,.jpg,.jpeg,.png"
                    label="Upload Leased Property Document"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Applicant Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-800">Applicant Information</h3>
          <p className="text-sm text-gray-600">
            If you provide applicant information, both name and position are required.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="applicant_name"
                className={
                  data.applicationInfo.applicant_position && !data.applicationInfo.applicant_name ? "required" : ""
                }
              >
                Applicant Name
              </Label>
              <Input
                id="applicant_name"
                value={data.applicationInfo.applicant_name || ""}
                onChange={(e) => handleChange("applicant_name", e.target.value)}
                placeholder="Enter applicant name"
              />
            </div>
            <div>
              <Label
                htmlFor="applicant_position"
                className={
                  data.applicationInfo.applicant_name && !data.applicationInfo.applicant_position ? "required" : ""
                }
              >
                Applicant Position
              </Label>
              <Input
                id="applicant_position"
                value={data.applicationInfo.applicant_position || ""}
                onChange={(e) => handleChange("applicant_position", e.target.value)}
                placeholder="Enter applicant position"
              />
            </div>
          </div>
          {((data.applicationInfo.applicant_name && !data.applicationInfo.applicant_position) ||
            (data.applicationInfo.applicant_position && !data.applicationInfo.applicant_name)) && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              Both applicant name and position are required when providing applicant information.
            </div>
          )}
        </div>

        {/* Mayor's Permit Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-800">Mayor's Permit Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mayor_permit_no" className="required">
                Mayor's Permit Number
              </Label>
              <Input
                id="mayor_permit_no"
                value={data.applicationInfo.mayor_permit_no}
                onChange={(e) => handleChange("mayor_permit_no", e.target.value)}
                placeholder="Enter permit number"
              />
            </div>
            <div>
              <Label htmlFor="mayor_permit_received_by" className="required">
                Permit Received By
              </Label>
              <Input
                id="mayor_permit_received_by"
                value={data.applicationInfo.mayor_permit_received_by}
                onChange={(e) => handleChange("mayor_permit_received_by", e.target.value)}
                placeholder="Enter name of person who received permit"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="mayor_permit_date" className="required">
              Mayor's Permit Date
            </Label>
            <Input
              id="mayor_permit_date"
              type="date"
              value={data.applicationInfo.mayor_permit_date}
              onChange={(e) => handleChange("mayor_permit_date", e.target.value)}
            />
          </div>
          <div>
            <Label className="required">Mayor's Permit Document</Label>
            <FileUpload
              onUpload={(url) => handleFileUpload("mayor_permit_file_url", url)}
              currentFile={data.applicationInfo.mayor_permit_file_url}
              accept=".pdf,.jpg,.jpeg,.png"
              label="Upload Mayor's Permit Document"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
