"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Upload, AlertCircle } from "lucide-react"

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [bucketStatus, setBucketStatus] = useState<string>("")

  const initializeBucket = async () => {
    try {
      const response = await fetch("/api/init-storage")
      const data = await response.json()

      if (data.success) {
        setBucketStatus("✅ " + data.message)
      } else {
        setBucketStatus("❌ " + data.error)
      }
    } catch (err) {
      setBucketStatus("❌ Failed to initialize bucket")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError("")
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    setUploading(true)
    setError("")
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-test", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setResult(data)
      setFile(null)
      // Reset file input
      const fileInput = document.getElementById("file-input") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">File Upload Testing</h1>
        <p className="text-gray-600">Test file upload functionality and Supabase storage integration</p>
      </div>

      {/* Bucket Initialization */}
      <Card className="ph-card">
        <CardHeader>
          <CardTitle className="text-blue-800">Storage Initialization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={initializeBucket} className="ph-button">
            Initialize Storage Bucket
          </Button>
          {bucketStatus && (
            <Alert>
              <AlertDescription>{bucketStatus}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* File Upload Testing */}
      <Card className="ph-card">
        <CardHeader>
          <CardTitle className="text-blue-800">File Upload Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file-input">Select File</Label>
            <Input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, JPEG, PNG (Max 10MB)</p>
          </div>

          {file && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm">
                <strong>Selected file:</strong> {file.name}
              </p>
              <p className="text-xs text-gray-500">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleUpload} disabled={!file || uploading} className="w-full ph-button">
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload File"}
          </Button>
        </CardContent>
      </Card>

      {/* Upload Result */}
      {result && (
        <Card className="ph-card">
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Upload Successful
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Message:</strong> {result.message}
            </p>
            <p>
              <strong>File Name:</strong> {result.fileName}
            </p>
            <p>
              <strong>Storage Path:</strong> {result.path}
            </p>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">File has been successfully uploaded to Supabase Storage!</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="ph-card">
        <CardHeader>
          <CardTitle className="text-blue-800">Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>First, click "Initialize Storage Bucket" to ensure the bucket exists</li>
            <li>Select a file (PDF, JPEG, or PNG format, max 10MB)</li>
            <li>Click "Upload File" to test the upload functionality</li>
            <li>Check the result to confirm successful upload</li>
            <li>Files are stored in the "test/" folder within the bucket</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
