"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ApplicationFormData } from "@/lib/types"
import { FileUpload } from "@/components/file-upload"
import { useState } from "react"

interface BusinessInfoFormProps {
  data: ApplicationFormData
  updateData: (section: keyof ApplicationFormData, data: any) => void
}

export function BusinessInfoForm({ data, updateData }: BusinessInfoFormProps) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validateTelephoneNumber = (value: string): string => {
    if (!value.trim()) return "Telephone number is required"
    const phonePattern = /^[\d\s\-$$$$+]+$/
    if (!phonePattern.test(value)) return "Only numbers, spaces, hyphens, parentheses, and plus signs are allowed"
    return ""
  }

  const validateFaxNumber = (value: string): string => {
    if (value.trim()) {
      const phonePattern = /^[\d\s\-$$$$+]+$/
      if (!phonePattern.test(value)) return "Only numbers, spaces, hyphens, parentheses, and plus signs are allowed"
    }
    return ""
  }

  const validateBarangayNumber = (value: string): string => {
    if (!value.trim()) return "Barangay number is required"
    const numberPattern = /^\d+$/
    if (!numberPattern.test(value)) return "Barangay number must contain only numbers"
    return ""
  }

  const validateBusinessCapital = (value: number): string => {
    if (value < 0) return "Business capital cannot be negative"
    if (value === 0) return "Business capital must be greater than 0"
    return ""
  }

  const validateEmployeeCount = (value: number): string => {
    if (value < 0) return "Number of employees cannot be negative"
    return ""
  }

  const validateField = (field: string, value: string | number) => {
    let error = ""

    switch (field) {
      case "business_trade_name":
        if (!String(value).trim()) error = "Business trade name is required"
        break
      case "business_capital":
        error = validateBusinessCapital(Number(value))
        break
      case "business_telephone_no":
        error = validateTelephoneNumber(String(value))
        break
      case "business_fax_no":
        error = validateFaxNumber(String(value))
        break
      case "commercial_address_building_name":
        if (!String(value).trim()) error = "Building name is required"
        break
      case "commercial_address_building_no":
        if (!String(value).trim()) error = "Building number is required"
        break
      case "commercial_address_street":
        if (!String(value).trim()) error = "Street is required"
        break
      case "commercial_address_barangay_no":
        error = validateBarangayNumber(String(value))
        break
      case "main_line_of_business":
        if (!String(value).trim()) error = "Main line of business is required"
        break
      case "main_products_services":
        if (!String(value).trim()) error = "Main products/services is required"
        break
      case "no_of_employees":
        error = validateEmployeeCount(Number(value))
        break
      case "sec_registration_no":
        if (
          (data.businessInfo.business_ownership_type === "Corporation" ||
            data.businessInfo.business_ownership_type === "Partnership") &&
          !String(value).trim()
        ) {
          error = "SEC registration number is required"
        }
        break
      case "dti_registration_no":
        if (data.businessInfo.business_ownership_type === "Sole Proprietorship" && !String(value).trim()) {
          error = "DTI registration number is required"
        }
        break
    }

    setFieldErrors((prev) => ({
      ...prev,
      [field]: error,
    }))

    return error === ""
  }

  const handleChange = (field: string, value: string | number) => {
    updateData("businessInfo", {
      ...data.businessInfo,
      [field]: value,
    })

    // Validate field on change
    validateField(field, value)
  }

  const handleFileUpload = (field: string, url: string) => {
    updateData("businessInfo", {
      ...data.businessInfo,
      [field]: url,
    })
  }

  const showSecRegistration =
    data.businessInfo.business_ownership_type === "Corporation" ||
    data.businessInfo.business_ownership_type === "Partnership"
  const showDtiRegistration = data.businessInfo.business_ownership_type === "Sole Proprietorship"

  return (
    <Card className="ph-card">
      <CardHeader>
        <CardTitle className="text-blue-800">Business Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Business Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="business_trade_name" className="required">
              Business Trade Name
            </Label>
            <Input
              id="business_trade_name"
              value={data.businessInfo.business_trade_name}
              onChange={(e) => handleChange("business_trade_name", e.target.value)}
              placeholder="Enter business trade name"
              className={`border-gray-300 focus:border-[#1A4D8C] focus:ring-[#1A4D8C] ${fieldErrors.business_trade_name ? "border-red-500" : ""}`}
            />
            {fieldErrors.business_trade_name && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.business_trade_name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="business_capital" className="required">
              Business Capital (₱)
            </Label>
            <Input
              id="business_capital"
              type="number"
              value={data.businessInfo.business_capital}
              onChange={(e) => {
                const value = Number.parseFloat(e.target.value) || 0
                if (value >= 0) {
                  handleChange("business_capital", value)
                }
              }}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={`border-gray-300 focus:border-[#1A4D8C] focus:ring-[#1A4D8C] ${fieldErrors.business_capital ? "border-red-500" : ""}`}
            />
            {fieldErrors.business_capital && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.business_capital}</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="business_telephone_no" className="required">
              Business Telephone
            </Label>
            <Input
              id="business_telephone_no"
              value={data.businessInfo.business_telephone_no}
              onChange={(e) => handleChange("business_telephone_no", e.target.value)}
              placeholder="+63-9XX-XXX-XXXX"
              className={`border-gray-300 focus:border-[#1A4D8C] focus:ring-[#1A4D8C] ${fieldErrors.business_telephone_no ? "border-red-500" : ""}`}
            />
            {fieldErrors.business_telephone_no && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.business_telephone_no}</p>
            )}
          </div>
          <div>
            <Label htmlFor="business_fax_no">Business Fax Number</Label>
            <Input
              id="business_fax_no"
              value={data.businessInfo.business_fax_no || ""}
              onChange={(e) => handleChange("business_fax_no", e.target.value)}
              placeholder="+63-2-XXX-XXXX"
              className={`border-gray-300 focus:border-[#1A4D8C] focus:ring-[#1A4D8C] ${fieldErrors.business_fax_no ? "border-red-500" : ""}`}
            />
            {fieldErrors.business_fax_no && <p className="text-sm text-red-600 mt-1">{fieldErrors.business_fax_no}</p>}
          </div>
        </div>

        {/* Commercial Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-800">Commercial Address</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="commercial_address_building_name" className="required">
                Building Name
              </Label>
              <Input
                id="commercial_address_building_name"
                value={data.businessInfo.commercial_address_building_name}
                onChange={(e) => handleChange("commercial_address_building_name", e.target.value)}
                placeholder="Enter building name"
                className={`border-gray-300 focus:border-[#1A4D8C] focus:ring-[#1A4D8C] ${fieldErrors.commercial_address_building_name ? "border-red-500" : ""}`}
              />
              {fieldErrors.commercial_address_building_name && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.commercial_address_building_name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="commercial_address_building_no" className="required">
                Building Number
              </Label>
              <Input
                id="commercial_address_building_no"
                value={data.businessInfo.commercial_address_building_no}
                onChange={(e) => handleChange("commercial_address_building_no", e.target.value)}
                placeholder="Enter building number"
                className={`border-gray-300 focus:border-[#1A4D8C] focus:ring-[#1A4D8C] ${fieldErrors.commercial_address_building_no ? "border-red-500" : ""}`}
              />
              {fieldErrors.commercial_address_building_no && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.commercial_address_building_no}</p>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="commercial_address_street" className="required">
                Street
              </Label>
              <Input
                id="commercial_address_street"
                value={data.businessInfo.commercial_address_street}
                onChange={(e) => handleChange("commercial_address_street", e.target.value)}
                placeholder="Enter street name"
                className={`border-gray-300 focus:border-[#1A4D8C] focus:ring-[#1A4D8C] ${fieldErrors.commercial_address_street ? "border-red-500" : ""}`}
              />
              {fieldErrors.commercial_address_street && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.commercial_address_street}</p>
              )}
            </div>
            <div>
              <Label htmlFor="commercial_address_barangay_no" className="required">
                Barangay Number
              </Label>
              <Input
                id="commercial_address_barangay_no"
                value={data.businessInfo.commercial_address_barangay_no}
                onChange={(e) => handleChange("commercial_address_barangay_no", e.target.value)}
                placeholder="Enter barangay number"
                className={`border-gray-300 focus:border-[#1A4D8C] focus:ring-[#1A4D8C] ${fieldErrors.commercial_address_barangay_no ? "border-red-500" : ""}`}
              />
              {fieldErrors.commercial_address_barangay_no && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.commercial_address_barangay_no}</p>
              )}
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-800">Business Details</h3>
          <div>
            <Label htmlFor="main_line_of_business" className="required">
              Main Line of Business
            </Label>
            <Input
              id="main_line_of_business"
              value={data.businessInfo.main_line_of_business}
              onChange={(e) => handleChange("main_line_of_business", e.target.value)}
              placeholder="Enter main line of business"
              className={`border-gray-300 focus:border-[#1A4D8C] focus:ring-[#1A4D8C] ${fieldErrors.main_line_of_business ? "border-red-500" : ""}`}
            />
            {fieldErrors.main_line_of_business && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.main_line_of_business}</p>
            )}
          </div>
          <div>
            <Label htmlFor="main_products_services" className="required">
              Main Products/Services
            </Label>
            <Textarea
              id="main_products_services"
              value={data.businessInfo.main_products_services}
              onChange={(e) => handleChange("main_products_services", e.target.value)}
              placeholder="Describe main products or services"
              rows={3}
              className={`border-gray-300 focus:border-[#1A4D8C] focus:ring-[#1A4D8C] ${fieldErrors.main_products_services ? "border-red-500" : ""}`}
            />
            {fieldErrors.main_products_services && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.main_products_services}</p>
            )}
          </div>
          <div>
            <Label htmlFor="other_lines_of_business">Other Lines of Business</Label>
            <Textarea
              id="other_lines_of_business"
              value={data.businessInfo.other_lines_of_business || ""}
              onChange={(e) => handleChange("other_lines_of_business", e.target.value)}
              placeholder="Describe other lines of business (optional)"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="other_products_services">Other Products/Services</Label>
            <Textarea
              id="other_products_services"
              value={data.businessInfo.other_products_services || ""}
              onChange={(e) => handleChange("other_products_services", e.target.value)}
              placeholder="Describe other products or services (optional)"
              rows={2}
            />
          </div>
        </div>

        {/* Business Ownership */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-800">Business Ownership</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business_ownership_type" className="required">
                Business Ownership Type
              </Label>
              <Select
                value={data.businessInfo.business_ownership_type}
                onValueChange={(value) => handleChange("business_ownership_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ownership type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                  <SelectItem value="Partnership">Partnership</SelectItem>
                  <SelectItem value="Corporation">Corporation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="no_of_employees">Number of Employees</Label>
              <Input
                id="no_of_employees"
                type="number"
                value={data.businessInfo.no_of_employees || 0}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value) || 0
                  if (value >= 0) {
                    handleChange("no_of_employees", value)
                  }
                }}
                placeholder="0"
                min="0"
                className={`border-gray-300 focus:border-[#1A4D8C] focus:ring-[#1A4D8C] ${fieldErrors.no_of_employees ? "border-red-500" : ""}`}
              />
              {fieldErrors.no_of_employees && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.no_of_employees}</p>
              )}
            </div>
          </div>
        </div>

        {/* Conditional Registration Documents */}
        {showSecRegistration && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">
              SEC Registration (Required for Corporation/Partnership)
            </h3>
            <div>
              <Label htmlFor="sec_registration_no" className="required">
                SEC Registration Number
              </Label>
              <Input
                id="sec_registration_no"
                value={data.businessInfo.sec_registration_no || ""}
                onChange={(e) => handleChange("sec_registration_no", e.target.value)}
                placeholder="Enter SEC registration number"
                className={`border-gray-300 focus:border-[#1A4D8C] focus:ring-[#1A4D8C] ${fieldErrors.sec_registration_no ? "border-red-500" : ""}`}
              />
              {fieldErrors.sec_registration_no && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.sec_registration_no}</p>
              )}
            </div>
            <div>
              <Label className="required">SEC Registration Document</Label>
              <FileUpload
                onUpload={(url) => handleFileUpload("sec_registration_file_url", url)}
                currentFile={data.businessInfo.sec_registration_file_url}
                accept=".pdf,.jpg,.jpeg,.png"
                label="Upload SEC Registration Document"
              />
            </div>
          </div>
        )}

        {showDtiRegistration && (
          <div className="space-y-4 p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">DTI Registration (Required for Sole Proprietorship)</h3>
            <div>
              <Label htmlFor="dti_registration_no" className="required">
                DTI Registration Number
              </Label>
              <Input
                id="dti_registration_no"
                value={data.businessInfo.dti_registration_no || ""}
                onChange={(e) => handleChange("dti_registration_no", e.target.value)}
                placeholder="Enter DTI registration number"
                className={`border-gray-300 focus:border-[#1A4D8C] focus:ring-[#1A4D8C] ${fieldErrors.dti_registration_no ? "border-red-500" : ""}`}
              />
              {fieldErrors.dti_registration_no && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.dti_registration_no}</p>
              )}
            </div>
            <div>
              <Label className="required">DTI Registration Document</Label>
              <FileUpload
                onUpload={(url) => handleFileUpload("dti_registration_file_url", url)}
                currentFile={data.businessInfo.dti_registration_file_url}
                accept=".pdf,.jpg,.jpeg,.png"
                label="Upload DTI Registration Document"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
