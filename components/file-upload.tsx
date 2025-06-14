"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, File, CheckCircle, AlertCircle } from "lucide-react"

interface FileUploadProps {
  onUpload: (url: string) => void
  currentFile?: string
  accept?: string
  label?: string
}

export function FileUpload({
  onUpload,
  currentFile,
  accept = ".pdf,.jpg,.jpeg,.png",
  label = "Upload File",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit")
      return
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Only PDF, JPEG, and PNG files are allowed.")
      return
    }

    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      onUpload(data.fileName)

      // Reset file input
      e.target.value = ""
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <Input type="file" onChange={handleFileUpload} accept={accept} disabled={uploading} className="flex-1" />
        <Button
          type="button"
          disabled={uploading}
          className="ph-button"
          onClick={() => document.querySelector('input[type="file"]')?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Uploading..." : label}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {currentFile && !error && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center">
            <File className="w-4 h-4 mr-2" />
            File uploaded: {currentFile.split("/").pop()}
          </AlertDescription>
        </Alert>
      )}

      <p className="text-xs text-gray-500">Accepted formats: PDF, JPEG, PNG (Max 10MB)</p>
    </div>
  )
}
