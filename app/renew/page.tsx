"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormField } from "@/components/ui/form-field"
import { RenewalForm } from "@/components/renewal-form"
import { Search, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RenewPage() {
  const [businessAccountNo, setBusinessAccountNo] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [applicationData, setApplicationData] = useState(null)
  const [verified, setVerified] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!businessAccountNo.trim()) {
      setError("Please enter Business Account Number")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/applications/renew-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessAccountNo: businessAccountNo.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to find business record")
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
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#0C2D57]">BUSINESS PERMIT RENEWAL</h1>
            <p className="text-gray-600">Update your business permit for renewal</p>
          </div>

          <RenewalForm initialData={applicationData} />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0C2D57] mb-4">BUSINESS PERMIT RENEWAL</h1>
          <p className="text-gray-600">Search for your existing business to renew your permit</p>
        </div>

        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle>Business Search</CardTitle>
            <CardDescription>Enter your business information to proceed with renewal</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch}>
              <div className="space-y-4">
                <FormField>
                  <Label htmlFor="businessAccountNo" className="required">
                    Business Account Number
                  </Label>
                  <Input
                    id="businessAccountNo"
                    value={businessAccountNo}
                    onChange={(e) => setBusinessAccountNo(e.target.value)}
                    placeholder="Enter your business account number (UUID format)"
                    required
                  />
                </FormField>

                {error && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? "Searching..." : "Search Business"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Enter your Business Account Number from your previous application</li>
              <li>Once verified, you can update renewal-specific information</li>
              <li>Renewal fee: ₱1,500.00</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
