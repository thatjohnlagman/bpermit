"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileUpload } from "@/components/file-upload"
import { LogOut, Eye, Edit, Trash2, RefreshCw, FileText, CheckCircle, Clock, Package } from "lucide-react"

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [editingApplication, setEditingApplication] = useState<any>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    processing: 0,
    ready: 0,
    completed: 0,
  })

  // Add validation state
  const [editFieldErrors, setEditFieldErrors] = useState<Record<string, string>>({})

  // Add validation functions
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

  const validatePositiveNumber = (value: number, fieldName: string): string => {
    if (value < 0) return `${fieldName} cannot be negative`
    return ""
  }

  const validateEditField = (field: string, value: string | number) => {
    let error = ""

    switch (field) {
      case "taxpayer_telephone_no":
      case "business_telephone_no":
        error = validateTelephoneNumber(String(value))
        break
      case "business_fax_no":
        error = validateFaxNumber(String(value))
        break
      case "taxpayer_barangay_no":
      case "commercial_address_barangay_no":
        error = validateBarangayNumber(String(value))
        break
      case "business_capital":
        error = validateBusinessCapital(Number(value))
        break
      case "no_of_employees":
        error = validateEmployeeCount(Number(value))
        break
      case "amount_paid":
        error = validatePositiveNumber(Number(value), "Amount paid")
        break
      case "leased_area_sq_meter":
        error = validatePositiveNumber(Number(value), "Leased area")
        break
      case "rent_per_month":
        error = validatePositiveNumber(Number(value), "Rent per month")
        break
    }

    setEditFieldErrors((prev) => ({
      ...prev,
      [field]: error,
    }))

    return error === ""
  }

  const getSignedUrl = async (filePath: string) => {
    try {
      const response = await fetch("/api/files/signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath }),
      })

      const data = await response.json()

      if (data.success) {
        window.open(data.signedUrl, "_blank")
      } else {
        console.error("Failed to get signed URL:", data.error)
        alert("Failed to open document")
      }
    } catch (error) {
      console.error("Error getting signed URL:", error)
      alert("Failed to open document")
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/applications")
      const data = await response.json()

      if (response.ok) {
        setApplications(data.applications)
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (application: any) => {
    setSelectedApplication(application)
    setShowViewDialog(true)
  }

  const handleEdit = (application: any) => {
    setEditingApplication({ ...application })
    setShowEditDialog(true)
    setEditFieldErrors({})
  }

  const handleSave = async () => {
    try {
      const response = await fetch("/api/admin/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingApplication),
      })

      if (response.ok) {
        setShowEditDialog(false)
        fetchApplications()
      }
    } catch (error) {
      console.error("Failed to update application:", error)
    }
  }

  const handleDelete = async (applicationId: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return

    try {
      const response = await fetch(`/api/admin/applications?id=${applicationId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchApplications()
      }
    } catch (error) {
      console.error("Failed to delete application:", error)
    }
  }

  const handleFileUpload = (field: string, url: string) => {
    setEditingApplication({
      ...editingApplication,
      [field]: url,
    })
  }

  const getStatusBadge = (application: any) => {
    if (application.permit_released_by) {
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>
    } else if (application.permit_date_of_release && application.permit_time_of_release) {
      return <Badge className="bg-blue-100 text-blue-800">Ready for Pickup</Badge>
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
    }
  }

  const filteredApplications = applications.filter(
    (app: any) =>
      app.business_trade_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.taxpayer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.mayor_permit_no?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage business permit applications</p>
          </div>
          <Button onClick={onLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="ph-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="ph-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Processing</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="ph-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ready for Pickup</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.ready}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="ph-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <Card className="ph-card">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by business name, taxpayer name, or permit number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button onClick={fetchApplications} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="ph-card">
          <CardHeader>
            <CardTitle className="text-blue-800">Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading applications...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Taxpayer</TableHead>
                      <TableHead>Permit No.</TableHead>
                      <TableHead>Date Applied</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((application: any) => (
                      <TableRow key={application.application_id}>
                        <TableCell className="font-medium">{application.business_trade_name}</TableCell>
                        <TableCell>{application.taxpayer_name}</TableCell>
                        <TableCell>{application.mayor_permit_no}</TableCell>
                        <TableCell>{new Date(application.date_of_application).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(application)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleView(application)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(application)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(application.application_id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-6">
                {/* Taxpayer Information */}
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">Taxpayer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Taxpayer Name</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">{selectedApplication.taxpayer_name}</p>
                    </div>
                    <div>
                      <Label>Telephone</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">{selectedApplication.taxpayer_telephone_no}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Address</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">{selectedApplication.taxpayer_address}</p>
                    </div>
                    <div>
                      <Label>Barangay No.</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">{selectedApplication.taxpayer_barangay_no}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Business Information */}
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">Business Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Business Name</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">{selectedApplication.business_trade_name}</p>
                    </div>
                    <div>
                      <Label>Capital</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">
                        ₱{selectedApplication.business_capital?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label>Ownership Type</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">{selectedApplication.business_ownership_type}</p>
                    </div>
                    <div>
                      <Label>Employees</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">{selectedApplication.no_of_employees || 0}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Main Line of Business</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">{selectedApplication.main_line_of_business}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Main Products/Services</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">{selectedApplication.main_products_services}</p>
                    </div>
                    <div>
                      <Label>Business Phone</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">{selectedApplication.business_telephone_no}</p>
                    </div>
                    <div>
                      <Label>Business Fax</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">{selectedApplication.business_fax_no || "N/A"}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Commercial Address</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">
                        {selectedApplication.commercial_address_building_name}{" "}
                        {selectedApplication.commercial_address_building_no},{" "}
                        {selectedApplication.commercial_address_street}, Brgy.{" "}
                        {selectedApplication.commercial_address_barangay_no}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Application Information */}
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">Application Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Application Date</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">
                        {new Date(selectedApplication.date_of_application).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label>Amount Paid</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">₱{selectedApplication.amount_paid}</p>
                    </div>
                    <div>
                      <Label>Business Plate No.</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">{selectedApplication.business_plate_no}</p>
                    </div>
                    <div>
                      <Label>Mayor Permit No.</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">{selectedApplication.mayor_permit_no}</p>
                    </div>
                    <div>
                      <Label>Permit Received By</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">{selectedApplication.mayor_permit_received_by}</p>
                    </div>
                    <div>
                      <Label>Permit Date</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">
                        {new Date(selectedApplication.mayor_permit_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label>Proof of Ownership Type</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">{selectedApplication.proof_of_ownership_type}</p>
                    </div>
                    <div>
                      <Label>Property Type</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">
                        {selectedApplication.is_owned_property
                          ? "Owned Property"
                          : selectedApplication.is_leased_property
                            ? "Leased Property"
                            : "Not Specified"}
                      </p>
                    </div>
                    {selectedApplication.insurance_issuing_company && (
                      <>
                        <div>
                          <Label>Insurance Company</Label>
                          <p className="text-sm bg-gray-50 p-2 rounded">
                            {selectedApplication.insurance_issuing_company}
                          </p>
                        </div>
                        <div>
                          <Label>Insurance Date</Label>
                          <p className="text-sm bg-gray-50 p-2 rounded">
                            {selectedApplication.insurance_date
                              ? new Date(selectedApplication.insurance_date).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Documents */}
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    {selectedApplication.barangay_clearance_file_url && (
                      <div>
                        <Label>Barangay Clearance</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-1"
                          onClick={() => getSignedUrl(selectedApplication.barangay_clearance_file_url)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Document
                        </Button>
                      </div>
                    )}
                    {selectedApplication.mayor_permit_file_url && (
                      <div>
                        <Label>Mayor's Permit</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-1"
                          onClick={() => getSignedUrl(selectedApplication.mayor_permit_file_url)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Document
                        </Button>
                      </div>
                    )}
                    {selectedApplication.owned_property_document_file_url && (
                      <div>
                        <Label>Property Document</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-1"
                          onClick={() => getSignedUrl(selectedApplication.owned_property_document_file_url)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Document
                        </Button>
                      </div>
                    )}
                    {selectedApplication.leased_property_document_file_url && (
                      <div>
                        <Label>Lease Document</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-1"
                          onClick={() => getSignedUrl(selectedApplication.leased_property_document_file_url)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Document
                        </Button>
                      </div>
                    )}
                    {selectedApplication.sec_registration_file_url && (
                      <div>
                        <Label>SEC Registration</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-1"
                          onClick={() => getSignedUrl(selectedApplication.sec_registration_file_url)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Document
                        </Button>
                      </div>
                    )}
                    {selectedApplication.dti_registration_file_url && (
                      <div>
                        <Label>DTI Registration</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-1"
                          onClick={() => getSignedUrl(selectedApplication.dti_registration_file_url)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Document
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Office Reviews */}
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">Office Reviews</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedApplication.office_reviews?.map((review: any, index: number) => (
                      <Card key={index} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">{review.office_name}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs">Reviewed By</Label>
                            <p className="text-sm">{review.office_reviewed_by}</p>
                          </div>
                          <div>
                            <Label className="text-xs">Date</Label>
                            <p className="text-sm">{new Date(review.office_reviewed_date).toLocaleDateString()}</p>
                          </div>
                          {review.remarks_and_recommendation && (
                            <div className="col-span-2">
                              <Label className="text-xs">Remarks</Label>
                              <p className="text-sm">{review.remarks_and_recommendation}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>

                {/* Status Information */}
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">Status Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Release Date</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">
                        {selectedApplication.permit_date_of_release
                          ? new Date(selectedApplication.permit_date_of_release).toLocaleDateString()
                          : "Not Set"}
                      </p>
                    </div>
                    <div>
                      <Label>Release Time</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">
                        {selectedApplication.permit_time_of_release || "Not Set"}
                      </p>
                    </div>
                    <div>
                      <Label>Released By</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">
                        {selectedApplication.permit_released_by || "Not Released"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Application</DialogTitle>
              <DialogDescription>Update all application details including documents</DialogDescription>
            </DialogHeader>
            {editingApplication && (
              <div className="space-y-6">
                {/* Taxpayer Information */}
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">Taxpayer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_taxpayer_name">Taxpayer Name</Label>
                      <Input
                        id="edit_taxpayer_name"
                        value={editingApplication.taxpayer_name || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            taxpayer_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_taxpayer_telephone">Telephone</Label>
                      <Input
                        id="edit_taxpayer_telephone"
                        value={editingApplication.taxpayer_telephone_no || ""}
                        onChange={(e) => {
                          const value = e.target.value
                          const phonePattern = /^[\d\s\-$$$$+]*$/
                          if (phonePattern.test(value)) {
                            setEditingApplication({
                              ...editingApplication,
                              taxpayer_telephone_no: value,
                            })
                            validateEditField("taxpayer_telephone_no", value)
                          }
                        }}
                        className={editFieldErrors.taxpayer_telephone_no ? "border-red-500" : ""}
                      />
                      {editFieldErrors.taxpayer_telephone_no && (
                        <p className="text-sm text-red-600 mt-1">{editFieldErrors.taxpayer_telephone_no}</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="edit_taxpayer_address">Address</Label>
                      <Textarea
                        id="edit_taxpayer_address"
                        value={editingApplication.taxpayer_address || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            taxpayer_address: e.target.value,
                          })
                        }
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_taxpayer_barangay">Barangay No.</Label>
                      <Input
                        id="edit_taxpayer_barangay"
                        value={editingApplication.taxpayer_barangay_no || ""}
                        onChange={(e) => {
                          const value = e.target.value
                          const numberPattern = /^\d*$/
                          if (numberPattern.test(value)) {
                            setEditingApplication({
                              ...editingApplication,
                              taxpayer_barangay_no: value,
                            })
                            validateEditField("taxpayer_barangay_no", value)
                          }
                        }}
                        className={editFieldErrors.taxpayer_barangay_no ? "border-red-500" : ""}
                      />
                      {editFieldErrors.taxpayer_barangay_no && (
                        <p className="text-sm text-red-600 mt-1">{editFieldErrors.taxpayer_barangay_no}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Business Information */}
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">Business Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_business_name">Business Name</Label>
                      <Input
                        id="edit_business_name"
                        value={editingApplication.business_trade_name || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            business_trade_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_business_capital">Capital</Label>
                      <Input
                        id="edit_business_capital"
                        type="number"
                        value={editingApplication.business_capital || 0}
                        onChange={(e) => {
                          const value = Number.parseFloat(e.target.value) || 0
                          if (value >= 0) {
                            setEditingApplication({
                              ...editingApplication,
                              business_capital: value,
                            })
                            validateEditField("business_capital", value)
                          }
                        }}
                        min="0"
                        step="0.01"
                        className={editFieldErrors.business_capital ? "border-red-500" : ""}
                      />
                      {editFieldErrors.business_capital && (
                        <p className="text-sm text-red-600 mt-1">{editFieldErrors.business_capital}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="edit_business_ownership">Ownership Type</Label>
                      <Select
                        value={editingApplication.business_ownership_type || ""}
                        onValueChange={(value) =>
                          setEditingApplication({
                            ...editingApplication,
                            business_ownership_type: value,
                          })
                        }
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
                      <Label htmlFor="edit_employees">Number of Employees</Label>
                      <Input
                        id="edit_employees"
                        type="number"
                        value={editingApplication.no_of_employees || 0}
                        onChange={(e) => {
                          const value = Number.parseFloat(e.target.value) || 0
                          if (value >= 0) {
                            setEditingApplication({
                              ...editingApplication,
                              no_of_employees: value,
                            })
                            validateEditField("no_of_employees", value)
                          }
                        }}
                        className={editFieldErrors.no_of_employees ? "border-red-500" : ""}
                      />
                      {editFieldErrors.no_of_employees && (
                        <p className="text-sm text-red-600 mt-1">{editFieldErrors.no_of_employees}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="edit_business_phone">Business Phone</Label>
                      <Input
                        id="edit_business_phone"
                        value={editingApplication.business_telephone_no || ""}
                        onChange={(e) => {
                          const value = e.target.value
                          const phonePattern = /^[\d\s\-$$$$+]*$/
                          if (phonePattern.test(value)) {
                            setEditingApplication({
                              ...editingApplication,
                              business_telephone_no: value,
                            })
                            validateEditField("business_telephone_no", value)
                          }
                        }}
                        className={editFieldErrors.business_telephone_no ? "border-red-500" : ""}
                      />
                      {editFieldErrors.business_telephone_no && (
                        <p className="text-sm text-red-600 mt-1">{editFieldErrors.business_telephone_no}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="edit_business_fax">Business Fax</Label>
                      <Input
                        id="edit_business_fax"
                        value={editingApplication.business_fax_no || ""}
                        onChange={(e) => {
                          const value = e.target.value
                          const phonePattern = /^[\d\s\-$$$$+]*$/
                          if (phonePattern.test(value)) {
                            setEditingApplication({
                              ...editingApplication,
                              business_fax_no: value,
                            })
                            validateEditField("business_fax_no", value)
                          }
                        }}
                        className={editFieldErrors.business_fax_no ? "border-red-500" : ""}
                      />
                      {editFieldErrors.business_fax_no && (
                        <p className="text-sm text-red-600 mt-1">{editFieldErrors.business_fax_no}</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="edit_main_business">Main Line of Business</Label>
                      <Input
                        id="edit_main_business"
                        value={editingApplication.main_line_of_business || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            main_line_of_business: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="edit_main_products">Main Products/Services</Label>
                      <Textarea
                        id="edit_main_products"
                        value={editingApplication.main_products_services || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            main_products_services: e.target.value,
                          })
                        }
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_building_name">Building Name</Label>
                      <Input
                        id="edit_building_name"
                        value={editingApplication.commercial_address_building_name || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            commercial_address_building_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_building_no">Building No.</Label>
                      <Input
                        id="edit_building_no"
                        value={editingApplication.commercial_address_building_no || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            commercial_address_building_no: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_street">Street</Label>
                      <Input
                        id="edit_street"
                        value={editingApplication.commercial_address_street || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            commercial_address_street: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_barangay">Barangay No.</Label>
                      <Input
                        id="edit_barangay"
                        value={editingApplication.commercial_address_barangay_no || ""}
                        onChange={(e) => {
                          const value = e.target.value
                          const numberPattern = /^\d*$/
                          if (numberPattern.test(value)) {
                            setEditingApplication({
                              ...editingApplication,
                              commercial_address_barangay_no: value,
                            })
                            validateEditField("commercial_address_barangay_no", value)
                          }
                        }}
                        className={editFieldErrors.commercial_address_barangay_no ? "border-red-500" : ""}
                      />
                      {editFieldErrors.commercial_address_barangay_no && (
                        <p className="text-sm text-red-600 mt-1">{editFieldErrors.commercial_address_barangay_no}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="edit_sec_no">SEC Registration No.</Label>
                      <Input
                        id="edit_sec_no"
                        value={editingApplication.sec_registration_no || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            sec_registration_no: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_dti_no">DTI Registration No.</Label>
                      <Input
                        id="edit_dti_no"
                        value={editingApplication.dti_registration_no || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            dti_registration_no: e.target.value,
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Application Details */}
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">Application Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_amount_paid">Amount Paid</Label>
                      <Input
                        id="edit_amount_paid"
                        type="number"
                        value={editingApplication.amount_paid || 0}
                        onChange={(e) => {
                          const value = Number.parseFloat(e.target.value) || 0
                          if (value >= 0) {
                            setEditingApplication({
                              ...editingApplication,
                              amount_paid: value,
                            })
                            validateEditField("amount_paid", value)
                          }
                        }}
                        className={editFieldErrors.amount_paid ? "border-red-500" : ""}
                      />
                      {editFieldErrors.amount_paid && (
                        <p className="text-sm text-red-600 mt-1">{editFieldErrors.amount_paid}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="edit_mayor_permit_no">Mayor Permit No.</Label>
                      <Input
                        id="edit_mayor_permit_no"
                        value={editingApplication.mayor_permit_no || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            mayor_permit_no: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_permit_received_by">Permit Received By</Label>
                      <Input
                        id="edit_permit_received_by"
                        value={editingApplication.mayor_permit_received_by || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            mayor_permit_received_by: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_permit_date">Permit Date</Label>
                      <Input
                        id="edit_permit_date"
                        type="date"
                        value={editingApplication.mayor_permit_date || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            mayor_permit_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_proof_ownership_type">Proof of Ownership Type</Label>
                      <Input
                        id="edit_proof_ownership_type"
                        value={editingApplication.proof_of_ownership_type || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            proof_of_ownership_type: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_insurance_company">Insurance Company</Label>
                      <Input
                        id="edit_insurance_company"
                        value={editingApplication.insurance_issuing_company || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            insurance_issuing_company: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_insurance_date">Insurance Date</Label>
                      <Input
                        id="edit_insurance_date"
                        type="date"
                        value={editingApplication.insurance_date || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            insurance_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="edit_applicant_name"
                        className={
                          editingApplication.applicant_position && !editingApplication.applicant_name
                            ? "required-field"
                            : ""
                        }
                      >
                        Applicant Name
                      </Label>
                      <Input
                        id="edit_applicant_name"
                        value={editingApplication.applicant_name || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            applicant_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="edit_applicant_position"
                        className={
                          editingApplication.applicant_name && !editingApplication.applicant_position
                            ? "required-field"
                            : ""
                        }
                      >
                        Applicant Position
                      </Label>
                      <Input
                        id="edit_applicant_position"
                        value={editingApplication.applicant_position || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            applicant_position: e.target.value,
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Property Information */}
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">Property Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_property_name">Property Registered Name</Label>
                      <Input
                        id="edit_property_name"
                        value={editingApplication.property_registered_name || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            property_registered_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_tax_receipt">Real Property Tax Receipt No.</Label>
                      <Input
                        id="edit_tax_receipt"
                        value={editingApplication.real_property_tax_receipt_no || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            real_property_tax_receipt_no: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_period_date">Period Date</Label>
                      <Input
                        id="edit_period_date"
                        type="date"
                        value={editingApplication.period_date || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            period_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_lessor_name">Lessor Name</Label>
                      <Input
                        id="edit_lessor_name"
                        value={editingApplication.lessor_name || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            lessor_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_leased_area">Leased Area (sq. meters)</Label>
                      <Input
                        id="edit_leased_area"
                        type="number"
                        value={editingApplication.leased_area_sq_meter || 0}
                        onChange={(e) => {
                          const value = Number.parseFloat(e.target.value) || 0
                          if (value >= 0) {
                            setEditingApplication({
                              ...editingApplication,
                              leased_area_sq_meter: value,
                            })
                            validateEditField("leased_area_sq_meter", value)
                          }
                        }}
                        className={editFieldErrors.leased_area_sq_meter ? "border-red-500" : ""}
                      />
                      {editFieldErrors.leased_area_sq_meter && (
                        <p className="text-sm text-red-600 mt-1">{editFieldErrors.leased_area_sq_meter}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="edit_rent_per_month">Rent per Month</Label>
                      <Input
                        id="edit_rent_per_month"
                        type="number"
                        value={editingApplication.rent_per_month || 0}
                        onChange={(e) => {
                          const value = Number.parseFloat(e.target.value) || 0
                          if (value >= 0) {
                            setEditingApplication({
                              ...editingApplication,
                              rent_per_month: value,
                            })
                            validateEditField("rent_per_month", value)
                          }
                        }}
                        className={editFieldErrors.rent_per_month ? "border-red-500" : ""}
                      />
                      {editFieldErrors.rent_per_month && (
                        <p className="text-sm text-red-600 mt-1">{editFieldErrors.rent_per_month}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Document Management */}
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">Document Management</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Barangay Clearance</Label>
                      <FileUpload
                        onUpload={(url) => handleFileUpload("barangay_clearance_file_url", url)}
                        currentFile={editingApplication.barangay_clearance_file_url}
                        accept=".pdf,.jpg,.jpeg,.png"
                        label="Upload Barangay Clearance"
                      />
                    </div>
                    <div>
                      <Label>Mayor's Permit</Label>
                      <FileUpload
                        onUpload={(url) => handleFileUpload("mayor_permit_file_url", url)}
                        currentFile={editingApplication.mayor_permit_file_url}
                        accept=".pdf,.jpg,.jpeg,.png"
                        label="Upload Mayor's Permit"
                      />
                    </div>
                    <div>
                      <Label>Property Document</Label>
                      <FileUpload
                        onUpload={(url) => handleFileUpload("owned_property_document_file_url", url)}
                        currentFile={editingApplication.owned_property_document_file_url}
                        accept=".pdf,.jpg,.jpeg,.png"
                        label="Upload Property Document"
                      />
                    </div>
                    <div>
                      <Label>Lease Document</Label>
                      <FileUpload
                        onUpload={(url) => handleFileUpload("leased_property_document_file_url", url)}
                        currentFile={editingApplication.leased_property_document_file_url}
                        accept=".pdf,.jpg,.jpeg,.png"
                        label="Upload Lease Document"
                      />
                    </div>
                    <div>
                      <Label>SEC Registration</Label>
                      <FileUpload
                        onUpload={(url) => handleFileUpload("sec_registration_file_url", url)}
                        currentFile={editingApplication.sec_registration_file_url}
                        accept=".pdf,.jpg,.jpeg,.png"
                        label="Upload SEC Registration"
                      />
                    </div>
                    <div>
                      <Label>DTI Registration</Label>
                      <FileUpload
                        onUpload={(url) => handleFileUpload("dti_registration_file_url", url)}
                        currentFile={editingApplication.dti_registration_file_url}
                        accept=".pdf,.jpg,.jpeg,.png"
                        label="Upload DTI Registration"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Status Management */}
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">Status Management</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="permit_date_of_release">Release Date</Label>
                      <Input
                        id="permit_date_of_release"
                        type="date"
                        value={editingApplication.permit_date_of_release || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            permit_date_of_release: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="permit_time_of_release">Release Time</Label>
                      <Input
                        id="permit_time_of_release"
                        type="time"
                        value={editingApplication.permit_time_of_release || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            permit_time_of_release: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="permit_released_by">Released By</Label>
                      <Input
                        id="permit_released_by"
                        value={editingApplication.permit_released_by || ""}
                        onChange={(e) =>
                          setEditingApplication({
                            ...editingApplication,
                            permit_released_by: e.target.value,
                          })
                        }
                        placeholder="Enter name of person who released the permit"
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="ph-button">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
