"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileUpload } from "@/components/file-upload"
import { OfficeReviewsForm } from "@/components/forms/office-reviews-form"
import { CheckCircle, AlertCircle } from "lucide-react"
import type { ApplicationFormData } from "@/lib/types"

interface RenewalFormProps {
  initialData: any
}

export function RenewalForm({ initialData }: RenewalFormProps) {
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
        if (formData.applicationInfo.is_owned_property && !String(value).trim()) {
          error = "Property registered name is required"
        }
        break
      case "real_property_tax_receipt_no":
        if (formData.applicationInfo.is_owned_property && !String(value).trim()) {
          error = "Real property tax receipt number is required"
        }
        break
      case "period_date":
        if (formData.applicationInfo.is_owned_property && !String(value).trim()) {
          error = "Period date is required"
        }
        break
      case "lessor_name":
        if (formData.applicationInfo.is_leased_property && !String(value).trim()) {
          error = "Lessor name is required"
        }
        break
      case "leased_area_sq_meter":
        if (formData.applicationInfo.is_leased_property) {
          error = validatePositiveNumber(Number(value), "Leased area")
        }
        break
      case "rent_per_month":
        if (formData.applicationInfo.is_leased_property) {
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

  const [formData, setFormData] = useState<ApplicationFormData>({
    taxpayerInfo: initialData.taxpayerInfo,
    businessInfo: initialData.businessInfo,
    applicationInfo: {
      ...initialData.applicationInfo,
      // Reset renewal-specific fields
      barangay_clearance_file_url: "",
      insurance_issuing_company: initialData.applicationInfo.insurance_issuing_company || "",
      insurance_date: initialData.applicationInfo.insurance_date || "",
      proof_of_ownership_type: initialData.applicationInfo.proof_of_ownership_type || "",
      proof_of_ownership_file_url: "",
      mayor_permit_no: "",
      mayor_permit_received_by: "",
      mayor_permit_date: "",
      mayor_permit_file_url: "",
    },
    officeReviews: [],
  })

  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [applicationId, setApplicationId] = useState("")

  const validateForm = (): string[] => {
    const formErrors: string[] = []

    if (!formData.applicationInfo.barangay_clearance_file_url.trim())
      formErrors.push("Barangay clearance document is required")
    if (!formData.applicationInfo.proof_of_ownership_type.trim()) formErrors.push("Proof of ownership type is required")
    if (!formData.applicationInfo.mayor_permit_no.trim()) formErrors.push("Mayor permit number is required")
    if (!formData.applicationInfo.mayor_permit_received_by.trim())
      formErrors.push("Mayor permit received by is required")
    if (!formData.applicationInfo.mayor_permit_date.trim()) formErrors.push("Mayor permit date is required")
    if (!formData.applicationInfo.mayor_permit_file_url.trim()) formErrors.push("Mayor permit document is required")

    // Property validation
    if (!formData.applicationInfo.is_owned_property && !formData.applicationInfo.is_leased_property) {
      formErrors.push("Please select either owned or leased property")
    }

    if (formData.applicationInfo.is_owned_property) {
      if (!formData.applicationInfo.property_registered_name?.trim())
        formErrors.push("Property registered name is required")
      if (!formData.applicationInfo.real_property_tax_receipt_no?.trim())
        formErrors.push("Real property tax receipt number is required")
      if (!formData.applicationInfo.period_date?.trim()) formErrors.push("Period date is required")
      if (!formData.applicationInfo.owned_property_document_file_url?.trim())
        formErrors.push("Owned property document is required")
    }

    if (formData.applicationInfo.is_leased_property) {
      if (!formData.applicationInfo.lessor_name?.trim()) formErrors.push("Lessor name is required")
      if (!formData.applicationInfo.leased_area_sq_meter || formData.applicationInfo.leased_area_sq_meter <= 0)
        formErrors.push("Leased area must be greater than 0")
      if (!formData.applicationInfo.rent_per_month || formData.applicationInfo.rent_per_month <= 0)
        formErrors.push("Rent per month must be greater than 0")
      if (!formData.applicationInfo.leased_property_document_file_url?.trim())
        formErrors.push("Leased property document is required")
    }

    // Insurance validation - both fields required if one is provided
    if (formData.applicationInfo.insurance_issuing_company && !formData.applicationInfo.insurance_date) {
      formErrors.push("Insurance date is required when insurance company is provided")
    }
    if (formData.applicationInfo.insurance_date && !formData.applicationInfo.insurance_issuing_company) {
      formErrors.push("Insurance company is required when insurance date is provided")
    }

    // Applicant validation - both fields required if one is provided
    if (formData.applicationInfo.applicant_name && !formData.applicationInfo.applicant_position) {
      formErrors.push("Applicant position is required when applicant name is provided")
    }
    if (formData.applicationInfo.applicant_position && !formData.applicationInfo.applicant_name) {
      formErrors.push("Applicant name is required when applicant position is provided")
    }

    // Validate required offices
    const requiredOffices = [
      "City Planning & Dev't Office",
      "City Engineer's Office",
      "City Fire Marshal's Office",
      "City Health Office",
      "Business Permit & License Office",
    ]
    const officeNames = formData.officeReviews.map((review) => review.office_name)

    for (const office of requiredOffices) {
      if (!officeNames.includes(office)) {
        formErrors.push(`${office} review is required`)
      }
    }

    // Validate each office review
    formData.officeReviews.forEach((review) => {
      if (!review.office_reviewed_by.trim()) formErrors.push(`Office reviewed by is required for ${review.office_name}`)
      if (!review.office_reviewed_date.trim())
        formErrors.push(`Office reviewed date is required for ${review.office_name}`)
    })

    return formErrors
  }

  const handleSubmit = async () => {
    const formErrors = validateForm()
    if (formErrors.length > 0) {
      setErrors(formErrors)
      return
    }

    setSubmitting(true)
    setErrors([])

    try {
      const response = await fetch("/api/applications/renew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          businessAccountNo: initialData.businessInfo.business_account_no,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit renewal")
      }

      setApplicationId(result.applicationId)
      setSubmitted(true)
    } catch (err: any) {
      setErrors([err.message])
    } finally {
      setSubmitting(false)
    }
  }

  const updateFormData = (section: keyof ApplicationFormData, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      applicationInfo: {
        ...prev.applicationInfo,
        [field]: value,
      },
    }))

    validateField(field, value)
  }

  const handleFileUpload = (field: string, url: string) => {
    setFormData((prev) => ({
      ...prev,
      applicationInfo: {
        ...prev.applicationInfo,
        [field]: url,
      },
    }))
  }

  const handlePropertyTypeChange = (type: "owned" | "leased", checked: boolean) => {
    if (type === "owned") {
      setFormData((prev) => ({
        ...prev,
        applicationInfo: {
          ...prev.applicationInfo,
          is_owned_property: checked,
          is_leased_property: checked ? false : prev.applicationInfo.is_leased_property,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        applicationInfo: {
          ...prev.applicationInfo,
          is_leased_property: checked,
          is_owned_property: checked ? false : prev.applicationInfo.is_owned_property,
        },
      }))
    }
  }

  if (submitted) {
    return (
      <Card className="ph-card max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-green-600">Renewal Submitted Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>Your business permit renewal has been submitted and is now being processed.</p>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="font-semibold">Application ID:</p>
            <p className="text-sm font-mono bg-white p-2 rounded border">{applicationId}</p>
            <p className="text-xs text-gray-600 mt-2">Please save this ID to track your renewal status</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => (window.location.href = "/track")} className="ph-button">
              Track Application
            </Button>
            <Button onClick={() => (window.location.href = "/")} variant="outline">
              Return Home
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Business Information Display */}
      <Card className="ph-card">
        <CardHeader>
          <CardTitle className="text-blue-800">Business Information</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p>
              <strong>Business Name:</strong> {initialData.businessInfo.business_trade_name}
            </p>
            <p>
              <strong>Taxpayer:</strong> {initialData.taxpayerInfo.taxpayer_name}
            </p>
            <p>
              <strong>Business Type:</strong> {initialData.businessInfo.business_ownership_type}
            </p>
          </div>
          <div>
            <p>
              <strong>Address:</strong> {initialData.businessInfo.commercial_address_street}
            </p>
            <p>
              <strong>Phone:</strong> {initialData.businessInfo.business_telephone_no}
            </p>
            <p>
              <strong>Capital:</strong> ₱{initialData.businessInfo.business_capital?.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-semibold">Please fix the following errors:</p>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Renewal Form */}
      <Card className="ph-card">
        <CardHeader>
          <CardTitle className="text-blue-800">Renewal Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Required Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-800">Required Documents</h3>

            <div>
              <Label className="required-field">Barangay Clearance Document</Label>
              <FileUpload
                onUpload={(url) => handleFileUpload("barangay_clearance_file_url", url)}
                currentFile={formData.applicationInfo.barangay_clearance_file_url}
                accept=".pdf,.jpg,.jpeg,.png"
                label="Upload Barangay Clearance"
              />
            </div>

            <div>
              <Label htmlFor="proof_of_ownership_type" className="required-field">
                Proof of Ownership Type
              </Label>
              <Input
                id="proof_of_ownership_type"
                value={formData.applicationInfo.proof_of_ownership_type}
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
                    formData.applicationInfo.insurance_date && !formData.applicationInfo.insurance_issuing_company
                      ? "required-field"
                      : ""
                  }
                >
                  Insurance Issuing Company
                </Label>
                <Input
                  id="insurance_issuing_company"
                  value={formData.applicationInfo.insurance_issuing_company || ""}
                  onChange={(e) => handleChange("insurance_issuing_company", e.target.value)}
                  placeholder="Enter insurance company name"
                />
              </div>
              <div>
                <Label
                  htmlFor="insurance_date"
                  className={
                    formData.applicationInfo.insurance_issuing_company && !formData.applicationInfo.insurance_date
                      ? "required-field"
                      : ""
                  }
                >
                  Insurance Date
                </Label>
                <Input
                  id="insurance_date"
                  type="date"
                  value={formData.applicationInfo.insurance_date || ""}
                  onChange={(e) => handleChange("insurance_date", e.target.value)}
                />
              </div>
            </div>
            {((formData.applicationInfo.insurance_issuing_company && !formData.applicationInfo.insurance_date) ||
              (formData.applicationInfo.insurance_date && !formData.applicationInfo.insurance_issuing_company)) && (
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
                  checked={formData.applicationInfo.is_owned_property}
                  onCheckedChange={(checked) => handlePropertyTypeChange("owned", checked as boolean)}
                />
                <Label htmlFor="is_owned_property" className="font-medium">
                  Owned Property
                </Label>
              </div>

              {formData.applicationInfo.is_owned_property && (
                <div className="ml-6 space-y-4 p-4 bg-blue-50 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="property_registered_name" className="required-field">
                        Property Registered Name
                      </Label>
                      <Input
                        id="property_registered_name"
                        value={formData.applicationInfo.property_registered_name || ""}
                        onChange={(e) => handleChange("property_registered_name", e.target.value)}
                        placeholder="Enter registered property name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="real_property_tax_receipt_no" className="required-field">
                        Real Property Tax Receipt No.
                      </Label>
                      <Input
                        id="real_property_tax_receipt_no"
                        value={formData.applicationInfo.real_property_tax_receipt_no || ""}
                        onChange={(e) => handleChange("real_property_tax_receipt_no", e.target.value)}
                        placeholder="Enter receipt number"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="period_date" className="required-field">
                      Period Date
                    </Label>
                    <Input
                      id="period_date"
                      type="date"
                      value={formData.applicationInfo.period_date || ""}
                      onChange={(e) => handleChange("period_date", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="required-field">Owned Property Document (e.g., Land Title)</Label>
                    <FileUpload
                      onUpload={(url) => handleFileUpload("owned_property_document_file_url", url)}
                      currentFile={formData.applicationInfo.owned_property_document_file_url}
                      accept=".pdf,.jpg,.jpeg,.png"
                      label="Upload Owned Property Document"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_leased_property"
                  checked={formData.applicationInfo.is_leased_property}
                  onCheckedChange={(checked) => handlePropertyTypeChange("leased", checked as boolean)}
                />
                <Label htmlFor="is_leased_property" className="font-medium">
                  Leased Property
                </Label>
              </div>

              {formData.applicationInfo.is_leased_property && (
                <div className="ml-6 space-y-4 p-4 bg-green-50 rounded-lg">
                  <div>
                    <Label htmlFor="lessor_name" className="required-field">
                      Lessor Name
                    </Label>
                    <Input
                      id="lessor_name"
                      value={formData.applicationInfo.lessor_name || ""}
                      onChange={(e) => handleChange("lessor_name", e.target.value)}
                      placeholder="Enter lessor's name"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="leased_area_sq_meter" className="required-field">
                        Leased Area (sq. meters)
                      </Label>
                      <Input
                        id="leased_area_sq_meter"
                        type="number"
                        value={formData.applicationInfo.leased_area_sq_meter || 0}
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
                      <Label htmlFor="rent_per_month" className="required-field">
                        Rent per Month (₱)
                      </Label>
                      <Input
                        id="rent_per_month"
                        type="number"
                        value={formData.applicationInfo.rent_per_month || 0}
                        onChange={(e) => handleChange("rent_per_month", Number.parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="required-field">Leased Property Document (e.g., Lease Contract)</Label>
                    <FileUpload
                      onUpload={(url) => handleFileUpload("leased_property_document_file_url", url)}
                      currentFile={formData.applicationInfo.leased_property_document_file_url}
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
                    formData.applicationInfo.applicant_position && !formData.applicationInfo.applicant_name
                      ? "required-field"
                      : ""
                  }
                >
                  Applicant Name
                </Label>
                <Input
                  id="applicant_name"
                  value={formData.applicationInfo.applicant_name || ""}
                  onChange={(e) => handleChange("applicant_name", e.target.value)}
                  placeholder="Enter applicant name"
                />
              </div>
              <div>
                <Label
                  htmlFor="applicant_position"
                  className={
                    formData.applicationInfo.applicant_name && !formData.applicationInfo.applicant_position
                      ? "required-field"
                      : ""
                  }
                >
                  Applicant Position
                </Label>
                <Input
                  id="applicant_position"
                  value={formData.applicationInfo.applicant_position || ""}
                  onChange={(e) => handleChange("applicant_position", e.target.value)}
                  placeholder="Enter applicant position"
                />
              </div>
            </div>
            {((formData.applicationInfo.applicant_name && !formData.applicationInfo.applicant_position) ||
              (formData.applicationInfo.applicant_position && !formData.applicationInfo.applicant_name)) && (
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
                <Label htmlFor="mayor_permit_no" className="required-field">
                  Mayor's Permit Number
                </Label>
                <Input
                  id="mayor_permit_no"
                  value={formData.applicationInfo.mayor_permit_no}
                  onChange={(e) => handleChange("mayor_permit_no", e.target.value)}
                  placeholder="Enter permit number"
                />
              </div>
              <div>
                <Label htmlFor="mayor_permit_received_by" className="required-field">
                  Permit Received By
                </Label>
                <Input
                  id="mayor_permit_received_by"
                  value={formData.applicationInfo.mayor_permit_received_by}
                  onChange={(e) => handleChange("mayor_permit_received_by", e.target.value)}
                  placeholder="Enter name of person who received permit"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="mayor_permit_date" className="required-field">
                Mayor's Permit Date
              </Label>
              <Input
                id="mayor_permit_date"
                type="date"
                value={formData.applicationInfo.mayor_permit_date}
                onChange={(e) => handleChange("mayor_permit_date", e.target.value)}
              />
            </div>
            <div>
              <Label className="required-field">Mayor's Permit Document</Label>
              <FileUpload
                onUpload={(url) => handleFileUpload("mayor_permit_file_url", url)}
                currentFile={formData.applicationInfo.mayor_permit_file_url}
                accept=".pdf,.jpg,.jpeg,.png"
                label="Upload Mayor's Permit Document"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Office Reviews */}
      <OfficeReviewsForm data={formData} updateData={updateFormData} />

      {/* Submit Button */}
      <Card className="ph-card">
        <CardContent className="pt-6">
          <Button onClick={handleSubmit} disabled={submitting} className="w-full ph-button">
            {submitting ? "Submitting Renewal..." : "Submit Renewal Application"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
