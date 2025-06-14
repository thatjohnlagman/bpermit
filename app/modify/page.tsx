"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ApplicationForm } from "@/components/application-form"
import { Search, AlertCircle } from "lucide-react"

export default function ModifyPage() {
  const [applicationId, setApplicationId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [applicationData, setApplicationData] = useState(null)
  const [verified, setVerified] = useState(false)

  const handleSearch = async () => {
    if (!applicationId.trim()) {
      setError("Please enter Application ID")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/applications/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: applicationId.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to find application")
      }

      setApplicationData(data)
      setVerified(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (verified && applicationData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-800 mb-4">Modify Application</h1>
            <p className="text-gray-600">Update your existing business permit application</p>
          </div>

          <ApplicationForm initialData={applicationData} isModification={true} />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">Modify Application</h1>
          <p className="text-gray-600">Search for your existing application to make modifications</p>
        </div>

        <Card className="ph-card">
          <CardHeader>
            <CardTitle className="text-blue-800">Application Search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="applicationId" className="required">
                Application ID
              </Label>
              <Input
                id="applicationId"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                placeholder="Enter your application ID (UUID format)"
                className="mt-1"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleSearch} disabled={loading} className="w-full ph-button">
              <Search className="w-4 h-4 mr-2" />
              {loading ? "Searching..." : "Search Application"}
            </Button>
          </CardContent>
        </Card>

        <Card className="ph-card">
          <CardHeader>
            <CardTitle className="text-blue-800">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Enter your complete Application ID (UUID format)</li>
              <li>Once verified, you can modify all application details except system-generated fields</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
