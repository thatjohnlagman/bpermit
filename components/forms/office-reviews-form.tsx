"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ApplicationFormData, OfficeReview } from "@/lib/types"
import { Plus, Trash2 } from "lucide-react"

interface OfficeReviewsFormProps {
  data: ApplicationFormData
  updateData: (section: keyof ApplicationFormData, data: any) => void
}

const requiredOffices = [
  "City Planning & Dev't Office",
  "City Engineer's Office",
  "City Fire Marshal's Office",
  "City Health Office",
  "Business Permit & License Office",
]

const optionalOffices = ["Tourism & Cultural Office", "Traffic Management Office", "City Veterinarian Office"]

export function OfficeReviewsForm({ data, updateData }: OfficeReviewsFormProps) {
  const [selectedOptionalOffice, setSelectedOptionalOffice] = useState("")

  // Initialize required offices if not present
  const initializeRequiredOffices = () => {
    const existingOfficeNames = data.officeReviews.map((review) => review.office_name)
    const missingOffices = requiredOffices.filter((office) => !existingOfficeNames.includes(office))

    if (missingOffices.length > 0) {
      const newReviews = missingOffices.map((office) => ({
        office_name: office,
        remarks_and_recommendation: "",
        office_reviewed_by: "",
        office_reviewed_date: "",
      }))

      updateData("officeReviews", [...data.officeReviews, ...newReviews])
    }
  }

  // Initialize required offices on component mount
  if (data.officeReviews.length === 0) {
    initializeRequiredOffices()
  }

  const handleReviewChange = (index: number, field: keyof OfficeReview, value: string) => {
    const updatedReviews = [...data.officeReviews]
    updatedReviews[index] = {
      ...updatedReviews[index],
      [field]: value,
    }
    updateData("officeReviews", updatedReviews)
  }

  const addOptionalOffice = () => {
    if (!selectedOptionalOffice) return

    const newReview: OfficeReview = {
      office_name: selectedOptionalOffice,
      remarks_and_recommendation: "",
      office_reviewed_by: "",
      office_reviewed_date: "",
    }

    updateData("officeReviews", [...data.officeReviews, newReview])
    setSelectedOptionalOffice("")
  }

  const removeOptionalOffice = (index: number) => {
    const updatedReviews = data.officeReviews.filter((_, i) => i !== index)
    updateData("officeReviews", updatedReviews)
  }

  const availableOptionalOffices = optionalOffices.filter(
    (office) => !data.officeReviews.some((review) => review.office_name === office),
  )

  return (
    <Card className="ph-card">
      <CardHeader>
        <CardTitle className="text-blue-800">Office Reviews</CardTitle>
        <p className="text-sm text-gray-600">
          Please provide review information for each office. Required offices are marked and must be completed.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Required Offices */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-800">Required Office Reviews</h3>
          {data.officeReviews
            .filter((review) => requiredOffices.includes(review.office_name))
            .map((review, index) => {
              const actualIndex = data.officeReviews.findIndex((r) => r.office_name === review.office_name)
              return (
                <Card key={review.office_name} className="border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-blue-700">
                      {review.office_name} <span className="text-red-500">*</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`remarks-${actualIndex}`}>Remarks and Recommendation</Label>
                      <Textarea
                        id={`remarks-${actualIndex}`}
                        value={review.remarks_and_recommendation || ""}
                        onChange={(e) => handleReviewChange(actualIndex, "remarks_and_recommendation", e.target.value)}
                        placeholder="Enter remarks and recommendations"
                        rows={3}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`reviewed-by-${actualIndex}`} className="required">
                          Reviewed By
                        </Label>
                        <Input
                          id={`reviewed-by-${actualIndex}`}
                          value={review.office_reviewed_by}
                          onChange={(e) => handleReviewChange(actualIndex, "office_reviewed_by", e.target.value)}
                          placeholder="Enter reviewer name"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`review-date-${actualIndex}`} className="required">
                          Review Date
                        </Label>
                        <Input
                          id={`review-date-${actualIndex}`}
                          type="date"
                          value={review.office_reviewed_date}
                          onChange={(e) => handleReviewChange(actualIndex, "office_reviewed_date", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>

        {/* Optional Offices */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-800">Optional Office Reviews</h3>

          {/* Add Optional Office */}
          {availableOptionalOffices.length > 0 && (
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label>Add Optional Office</Label>
                <Select value={selectedOptionalOffice} onValueChange={setSelectedOptionalOffice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an optional office" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOptionalOffices.map((office) => (
                      <SelectItem key={office} value={office}>
                        {office}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addOptionalOffice} disabled={!selectedOptionalOffice} className="ph-button">
                <Plus className="w-4 h-4 mr-2" />
                Add Office
              </Button>
            </div>
          )}

          {/* Optional Office Reviews */}
          {data.officeReviews
            .filter((review) => optionalOffices.includes(review.office_name))
            .map((review, index) => {
              const actualIndex = data.officeReviews.findIndex((r) => r.office_name === review.office_name)
              return (
                <Card key={review.office_name} className="border-green-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base text-green-700">{review.office_name}</CardTitle>
                      <Button
                        onClick={() => removeOptionalOffice(actualIndex)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`remarks-${actualIndex}`}>Remarks and Recommendation</Label>
                      <Textarea
                        id={`remarks-${actualIndex}`}
                        value={review.remarks_and_recommendation || ""}
                        onChange={(e) => handleReviewChange(actualIndex, "remarks_and_recommendation", e.target.value)}
                        placeholder="Enter remarks and recommendations"
                        rows={3}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`reviewed-by-${actualIndex}`} className="required">
                          Reviewed By
                        </Label>
                        <Input
                          id={`reviewed-by-${actualIndex}`}
                          value={review.office_reviewed_by}
                          onChange={(e) => handleReviewChange(actualIndex, "office_reviewed_by", e.target.value)}
                          placeholder="Enter reviewer name"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`review-date-${actualIndex}`} className="required">
                          Review Date
                        </Label>
                        <Input
                          id={`review-date-${actualIndex}`}
                          type="date"
                          value={review.office_reviewed_date}
                          onChange={(e) => handleReviewChange(actualIndex, "office_reviewed_date", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>

        {data.officeReviews.filter((review) => optionalOffices.includes(review.office_name)).length === 0 && (
          <p className="text-sm text-gray-500 italic">
            No optional offices added. You can add optional office reviews if applicable to your business.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
