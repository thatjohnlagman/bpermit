"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormField } from "@/components/ui/form-field"
import { CheckCircle, Clock, Package, Search, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TrackPage() {
  const [applicationId, setApplicationId] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [searchPerformed, setSearchPerformed] = useState(false)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearchPerformed(true)

    if (!applicationId.trim()) {
      setError("Please enter an application ID")
      setResult(null)
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: applicationId.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to track application")
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const renderStatusContent = () => {
    if (error) {
      return (
        <div className="text-center py-8">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-700 mb-2">Application Not Found</h3>
          <p className="text-gray-600 mb-4">We couldn't find an application with the provided number.</p>
          <Alert>
            <AlertDescription>
              Please check the application number and try again. If you continue to experience issues, please contact
              our office.
            </AlertDescription>
          </Alert>
        </div>
      )
    }

    if (!result) return null

    const { permit_date_of_release, permit_time_of_release, permit_released_by } = result

    if (permit_released_by) {
      return (
        <div className="text-center py-8">
          <Package className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-blue-700 mb-2">Permit Picked Up</h3>
          <p className="text-gray-600 mb-4">Your business permit has been released and picked up.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md mx-auto">
            <p className="font-medium">Release Details:</p>
            <p>Date: {new Date(permit_date_of_release).toLocaleDateString()}</p>
            <p>Time: {permit_time_of_release}</p>
            <p>Released By: {permit_released_by}</p>
          </div>
        </div>
      )
    } else if (permit_date_of_release && permit_time_of_release) {
      return (
        <div className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-700 mb-2">Ready to Pick Up</h3>
          <p className="text-gray-600 mb-4">
            Your business permit is ready for pick up at the Business Permit & License Office.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left max-w-md mx-auto">
            <p className="font-medium">Pick Up Details:</p>
            <p>Date: {new Date(permit_date_of_release).toLocaleDateString()}</p>
            <p>Time: {permit_time_of_release}</p>
            <p className="mt-2 text-sm">
              Please bring a valid ID and the application receipt when claiming your permit.
            </p>
          </div>
        </div>
      )
    } else {
      return (
        <div className="text-center py-8">
          <Clock className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-amber-700 mb-2">Still in Processing</h3>
          <p className="text-gray-600 mb-4">Your application is currently being processed by our offices.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left max-w-md mx-auto">
            <p className="font-medium">Application Details:</p>
            <p>Business Name: {result.business_trade_name}</p>
            <p>Applicant: {result.taxpayer_name}</p>
            <p>Date Submitted: {new Date(result.date_of_application).toLocaleDateString()}</p>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#0C2D57]">TRACK YOUR APPLICATION</h1>
          <p className="text-gray-600">Check the current status of your business permit application</p>
        </div>

        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle>Application Tracker</CardTitle>
            <CardDescription>Enter your application number to check its status</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleTrack}>
              <div className="flex flex-col sm:flex-row gap-3">
                <FormField className="flex-1">
                  <Label htmlFor="application_id" className="required">
                    Business Application Number
                  </Label>
                  <Input
                    id="application_id"
                    name="application_id"
                    placeholder="Enter your application ID (UUID format)"
                    value={applicationId}
                    onChange={(e) => setApplicationId(e.target.value)}
                    required
                  />
                </FormField>
                <div className="self-end">
                  <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                    <Search className="h-4 w-4 mr-2" /> {loading ? "Tracking..." : "Track"}
                  </Button>
                </div>
              </div>
            </form>

            {searchPerformed && (
              <div className="mt-8 border-t pt-6">
                <h2 className="text-lg font-bold mb-4">Application Status</h2>
                {renderStatusContent()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
