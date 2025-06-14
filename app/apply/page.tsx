import { ApplicationForm } from "@/components/application-form"

export default function ApplyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">New Business Permit Application</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete all required sections to submit your business permit application. Make sure to have all necessary
            documents ready for upload.
          </p>
        </div>

        <ApplicationForm />
      </div>
    </div>
  )
}
