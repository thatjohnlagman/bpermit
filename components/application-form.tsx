"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TaxpayerInfoForm } from "./forms/taxpayer-info-form"
import { BusinessInfoForm } from "./forms/business-info-form"
import { ApplicationDetailsForm } from "./forms/application-details-form"
import { OfficeReviewsForm } from "./forms/office-reviews-form"
import type { ApplicationFormData } from "@/lib/types"
import { CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react"

const steps = [
  { id: 1, title: "Taxpayer Information", component: TaxpayerInfoForm },
  { id: 2, title: "Business Information", component: BusinessInfoForm },
  { id: 3, title: "Application Details", component: ApplicationDetailsForm },
  { id: 4, title: "Office Reviews", component: OfficeReviewsForm },
]

interface ApplicationFormProps {
  initialData?: any
  isModification?: boolean
}

export function ApplicationForm({ initialData, isModification = false }: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ApplicationFormData>(
    initialData || {
      taxpayerInfo: {
        taxpayer_name: "",
        taxpayer_telephone_no: "",
        taxpayer_address: "",
        taxpayer_barangay_no: "",
      },
      businessInfo: {
        business_capital: 0,
        business_trade_name: "",
        business_telephone_no: "",
        business_fax_no: "",
        commercial_address_building_name: "",
        commercial_address_building_no: "",
        commercial_address_street: "",
        commercial_address_barangay_no: "",
        main_line_of_business: "",
        main_products_services: "",
        other_lines_of_business: "",
        other_products_services: "",
        business_ownership_type: "Sole Proprietorship",
        no_of_employees: 0,
      },
      applicationInfo: {
        barangay_clearance_file_url: "",
        insurance_issuing_company: "",
        insurance_date: "",
        proof_of_ownership_type: "",
        is_owned_property: false,
        property_registered_name: "",
        real_property_tax_receipt_no: "",
        period_date: "",
        owned_property_document_file_url: "",
        is_leased_property: false,
        lessor_name: "",
        leased_area_sq_meter: 0,
        rent_per_month: 0,
        leased_property_document_file_url: "",
        applicant_name: "",
        applicant_position: "",
        mayor_permit_no: "",
        mayor_permit_received_by: "",
        mayor_permit_date: "",
        mayor_permit_file_url: "",
      },
      officeReviews: [],
    },
  )
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [applicationId, setApplicationId] = useState("")

  const validateStep = (step: number): string[] => {
    const stepErrors: string[] = []

    switch (step) {
      case 1:
        // Taxpayer validation
        if (!formData.taxpayerInfo.taxpayer_name.trim()) stepErrors.push("Taxpayer name is required")

        if (!formData.taxpayerInfo.taxpayer_telephone_no.trim()) {
          stepErrors.push("Taxpayer telephone number is required")
        } else {
          const phonePattern = /^[\d\s\-$$$$+]+$/
          if (!phonePattern.test(formData.taxpayerInfo.taxpayer_telephone_no)) {
            stepErrors.push(
              "Taxpayer telephone number can only contain numbers, spaces, hyphens, parentheses, and plus signs",
            )
          }
        }

        if (!formData.taxpayerInfo.taxpayer_address.trim()) stepErrors.push("Taxpayer address is required")

        if (!formData.taxpayerInfo.taxpayer_barangay_no.trim()) {
          stepErrors.push("Taxpayer barangay number is required")
        } else {
          const numberPattern = /^\d+$/
          if (!numberPattern.test(formData.taxpayerInfo.taxpayer_barangay_no)) {
            stepErrors.push("Taxpayer barangay number must contain only numbers")
          }
        }
        break

      case 2:
        // Business validation
        if (!formData.businessInfo.business_trade_name.trim()) stepErrors.push("Business trade name is required")

        if (!formData.businessInfo.business_telephone_no.trim()) {
          stepErrors.push("Business telephone number is required")
        } else {
          const phonePattern = /^[\d\s\-$$$$+]+$/
          if (!phonePattern.test(formData.businessInfo.business_telephone_no)) {
            stepErrors.push(
              "Business telephone number can only contain numbers, spaces, hyphens, parentheses, and plus signs",
            )
          }
        }

        if (formData.businessInfo.business_fax_no && formData.businessInfo.business_fax_no.trim()) {
          const phonePattern = /^[\d\s\-$$$$+]+$/
          if (!phonePattern.test(formData.businessInfo.business_fax_no)) {
            stepErrors.push(
              "Business fax number can only contain numbers, spaces, hyphens, parentheses, and plus signs",
            )
          }
        }

        if (!formData.businessInfo.commercial_address_building_name.trim()) stepErrors.push("Building name is required")
        if (!formData.businessInfo.commercial_address_building_no.trim()) stepErrors.push("Building number is required")
        if (!formData.businessInfo.commercial_address_street.trim()) stepErrors.push("Street address is required")

        if (!formData.businessInfo.commercial_address_barangay_no.trim()) {
          stepErrors.push("Barangay number is required")
        } else {
          const numberPattern = /^\d+$/
          if (!numberPattern.test(formData.businessInfo.commercial_address_barangay_no)) {
            stepErrors.push("Barangay number must contain only numbers")
          }
        }

        if (!formData.businessInfo.main_line_of_business.trim()) stepErrors.push("Main line of business is required")
        if (!formData.businessInfo.main_products_services.trim()) stepErrors.push("Main products/services is required")

        if (formData.businessInfo.business_capital <= 0) stepErrors.push("Business capital must be greater than 0")
        if (formData.businessInfo.no_of_employees && formData.businessInfo.no_of_employees < 0) {
          stepErrors.push("Number of employees cannot be negative")
        }

        // Conditional validation for ownership type
        if (
          formData.businessInfo.business_ownership_type === "Corporation" ||
          formData.businessInfo.business_ownership_type === "Partnership"
        ) {
          if (!formData.businessInfo.sec_registration_no?.trim()) stepErrors.push("SEC registration number is required")
          if (!formData.businessInfo.sec_registration_file_url?.trim())
            stepErrors.push("SEC registration document is required")
        } else if (formData.businessInfo.business_ownership_type === "Sole Proprietorship") {
          if (!formData.businessInfo.dti_registration_no?.trim()) stepErrors.push("DTI registration number is required")
          if (!formData.businessInfo.dti_registration_file_url?.trim())
            stepErrors.push("DTI registration document is required")
        }
        break

      case 3:
        // Application details validation
        if (!formData.applicationInfo.barangay_clearance_file_url.trim())
          stepErrors.push("Barangay clearance document is required")
        if (!formData.applicationInfo.proof_of_ownership_type.trim())
          stepErrors.push("Proof of ownership type is required")
        if (!formData.applicationInfo.mayor_permit_no.trim()) stepErrors.push("Mayor permit number is required")
        if (!formData.applicationInfo.mayor_permit_received_by.trim())
          stepErrors.push("Mayor permit received by is required")
        if (!formData.applicationInfo.mayor_permit_date.trim()) stepErrors.push("Mayor permit date is required")
        if (!formData.applicationInfo.mayor_permit_file_url.trim()) stepErrors.push("Mayor permit document is required")

        // Property validation
        if (!formData.applicationInfo.is_owned_property && !formData.applicationInfo.is_leased_property) {
          stepErrors.push("Please select either owned or leased property")
        }

        if (formData.applicationInfo.is_owned_property) {
          if (!formData.applicationInfo.property_registered_name?.trim())
            stepErrors.push("Property registered name is required")
          if (!formData.applicationInfo.real_property_tax_receipt_no?.trim())
            stepErrors.push("Real property tax receipt number is required")
          if (!formData.applicationInfo.period_date?.trim()) stepErrors.push("Period date is required")
          if (!formData.applicationInfo.owned_property_document_file_url?.trim())
            stepErrors.push("Owned property document is required")
        }

        if (formData.applicationInfo.is_leased_property) {
          if (!formData.applicationInfo.lessor_name?.trim()) stepErrors.push("Lessor name is required")
          if (!formData.applicationInfo.leased_area_sq_meter || formData.applicationInfo.leased_area_sq_meter <= 0)
            stepErrors.push("Leased area must be greater than 0")
          if (!formData.applicationInfo.rent_per_month || formData.applicationInfo.rent_per_month <= 0)
            stepErrors.push("Rent per month must be greater than 0")
          if (!formData.applicationInfo.leased_property_document_file_url?.trim())
            stepErrors.push("Leased property document is required")
        }

        // Insurance validation - both fields required if one is provided
        if (formData.applicationInfo.insurance_issuing_company && !formData.applicationInfo.insurance_date) {
          stepErrors.push("Insurance date is required when insurance company is provided")
        }
        if (formData.applicationInfo.insurance_date && !formData.applicationInfo.insurance_issuing_company) {
          stepErrors.push("Insurance company is required when insurance date is provided")
        }

        // Applicant validation - both fields required if one is provided
        if (formData.applicationInfo.applicant_name && !formData.applicationInfo.applicant_position) {
          stepErrors.push("Applicant position is required when applicant name is provided")
        }
        if (formData.applicationInfo.applicant_position && !formData.applicationInfo.applicant_name) {
          stepErrors.push("Applicant name is required when applicant position is provided")
        }
        break

      case 4:
        // Office reviews validation (keep existing validation)
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
            stepErrors.push(`${office} review is required`)
          }
        }

        formData.officeReviews.forEach((review, index) => {
          if (!review.office_reviewed_by.trim())
            stepErrors.push(`Office reviewed by is required for ${review.office_name}`)
          if (!review.office_reviewed_date.trim())
            stepErrors.push(`Office reviewed date is required for ${review.office_name}`)
        })
        break
    }

    return stepErrors
  }

  const handleNext = () => {
    const stepErrors = validateStep(currentStep)
    if (stepErrors.length > 0) {
      setErrors(stepErrors)
      return
    }

    setErrors([])
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    setErrors([])
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    const stepErrors = validateStep(4)
    if (stepErrors.length > 0) {
      setErrors(stepErrors)
      return
    }

    setSubmitting(true)
    setErrors([])

    try {
      const apiEndpoint = isModification ? "/api/applications/modify" : "/api/applications"
      const requestBody = isModification
        ? { ...formData, applicationId: initialData?.applicationInfo?.application_id }
        : formData

      const response = await fetch(apiEndpoint, {
        method: isModification ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `Failed to ${isModification ? "update" : "submit"} application`)
      }

      setApplicationId(result.applicationId || initialData?.applicationInfo?.application_id)
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

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="success-banner">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              {isModification ? "Application Updated Successfully!" : "Application Submitted Successfully!"}
            </h2>
            <p className="text-green-700 mb-6">
              Your business permit application has been {isModification ? "updated" : "submitted"} and is now being
              processed by the relevant government offices.
            </p>
            <div className="bg-white p-6 rounded-lg border-2 border-green-200 mb-6">
              <p className="font-semibold text-gray-800 mb-2">Application ID:</p>
              <p className="text-lg font-mono bg-gray-100 p-3 rounded border text-center break-all">{applicationId}</p>
              <p className="text-sm text-gray-600 mt-3">Please save this ID to track your application status</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => (window.location.href = "/track")} className="gov-button">
                Track Application
              </Button>
              <Button onClick={() => (window.location.href = "/")} className="gov-button-secondary">
                Return Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const CurrentStepComponent = steps[currentStep - 1].component
  const progress = (currentStep / steps.length) * 100

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Progress Section */}
      <div className="gov-card">
        <div className="gov-card-header p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
            </h2>
            <span className="text-sm opacity-90">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      </div>

      {/* Step Navigation */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`p-4 rounded-lg text-center text-sm font-medium transition-all ${
              step.id === currentStep
                ? "progress-step"
                : step.id < currentStep
                  ? "progress-step-completed"
                  : "progress-step-inactive"
            }`}
          >
            <div className="font-bold mb-1">Step {step.id}</div>
            <div className="text-xs">{step.title}</div>
          </div>
        ))}
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="error-banner">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800 mb-2">Please fix the following errors:</p>
              <ul className="list-disc list-inside space-y-1 text-red-700">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Current Step Form */}
      <CurrentStepComponent data={formData} updateData={updateFormData} />

      {/* Navigation Buttons */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentStep === 1} className="gov-button-secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === steps.length ? (
            <Button onClick={handleSubmit} disabled={submitting} className="gov-button">
              {submitting
                ? `${isModification ? "Updating" : "Submitting"} Application...`
                : `${isModification ? "Update" : "Submit"} Application`}
            </Button>
          ) : (
            <Button onClick={handleNext} className="gov-button">
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
