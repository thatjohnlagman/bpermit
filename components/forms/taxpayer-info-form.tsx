"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import { Info } from "lucide-react"
import type { ApplicationFormData } from "@/lib/types"
import { useState } from "react"

interface TaxpayerInfoFormProps {
  data: ApplicationFormData
  updateData: (section: keyof ApplicationFormData, data: any) => void
}

export function TaxpayerInfoForm({ data, updateData }: TaxpayerInfoFormProps) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validateTelephoneNumber = (value: string): string => {
    if (!value.trim()) return "Telephone number is required"
    const phonePattern = /^[\d\s\-$$$$+]+$/
    if (!phonePattern.test(value)) return "Only numbers, spaces, hyphens, parentheses, and plus signs are allowed"
    return ""
  }

  const validateBarangayNumber = (value: string): string => {
    if (!value.trim()) return "Barangay number is required"
    const numberPattern = /^\d+$/
    if (!numberPattern.test(value)) return "Barangay number must contain only numbers"
    return ""
  }

  const validateField = (field: string, value: string) => {
    let error = ""

    switch (field) {
      case "taxpayer_name":
        if (!value.trim()) error = "Taxpayer name is required"
        break
      case "taxpayer_telephone_no":
        error = validateTelephoneNumber(value)
        break
      case "taxpayer_address":
        if (!value.trim()) error = "Address is required"
        break
      case "taxpayer_barangay_no":
        error = validateBarangayNumber(value)
        break
    }

    setFieldErrors((prev) => ({
      ...prev,
      [field]: error,
    }))

    return error === ""
  }

  const handleChange = (field: string, value: string) => {
    updateData("taxpayerInfo", {
      ...data.taxpayerInfo,
      [field]: value,
    })

    // Validate field on change
    validateField(field, value)
  }

  return (
    <div className="form-section">
      <h2 className="form-section-header">Taxpayer Information</h2>

      <div className="info-banner mb-6">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-yellow-700">All fields in this section are required.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField>
            <Label htmlFor="taxpayer_name" className="required text-[#0C2D57] font-medium">
              Taxpayer Name
            </Label>
            <Input
              id="taxpayer_name"
              value={data.taxpayerInfo.taxpayer_name}
              onChange={(e) => handleChange("taxpayer_name", e.target.value)}
              placeholder="Enter full name"
              className={`border-gray-300 focus:border-[#1A4D8C] focus:ring-[#1A4D8C] ${fieldErrors.taxpayer_name ? "border-red-500" : ""}`}
            />
            {fieldErrors.taxpayer_name && <p className="text-sm text-red-600 mt-1">{fieldErrors.taxpayer_name}</p>}
          </FormField>

          <FormField>
            <Label htmlFor="taxpayer_telephone_no" className="required text-[#0C2D57] font-medium">
              Telephone Number
            </Label>
            <Input
              id="taxpayer_telephone_no"
              value={data.taxpayerInfo.taxpayer_telephone_no}
              onChange={(e) => handleChange("taxpayer_telephone_no", e.target.value)}
              placeholder="e.g. (02) 8123-4567"
              className={`border-gray-300 focus:border-[#1A4D8C] focus:ring-[#1A4D8C] ${fieldErrors.taxpayer_telephone_no ? "border-red-500" : ""}`}
            />
            {fieldErrors.taxpayer_telephone_no && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.taxpayer_telephone_no}</p>
            )}
          </FormField>
        </div>

        <FormField>
          <Label htmlFor="taxpayer_address" className="required text-[#0C2D57] font-medium">
            Complete Address
          </Label>
          <Textarea
            id="taxpayer_address"
            value={data.taxpayerInfo.taxpayer_address}
            onChange={(e) => handleChange("taxpayer_address", e.target.value)}
            placeholder="Enter complete address"
            rows={3}
            className={`border-gray-300 focus:border-[#1A4D8C] focus:ring-[#1A4D8C] ${fieldErrors.taxpayer_address ? "border-red-500" : ""}`}
          />
          {fieldErrors.taxpayer_address && <p className="text-sm text-red-600 mt-1">{fieldErrors.taxpayer_address}</p>}
        </FormField>

        <FormField>
          <Label htmlFor="taxpayer_barangay_no" className="required text-[#0C2D57] font-medium">
            Barangay Number
          </Label>
          <Input
            id="taxpayer_barangay_no"
            value={data.taxpayerInfo.taxpayer_barangay_no}
            onChange={(e) => handleChange("taxpayer_barangay_no", e.target.value)}
            placeholder="e.g. 123"
            className={`border-gray-300 focus:border-[#1A4D8C] focus:ring-[#1A4D8C] max-w-xs ${fieldErrors.taxpayer_barangay_no ? "border-red-500" : ""}`}
          />
          {fieldErrors.taxpayer_barangay_no && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.taxpayer_barangay_no}</p>
          )}
        </FormField>
      </div>
    </div>
  )
}
