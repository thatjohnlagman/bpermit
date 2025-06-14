import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, Building } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#0C2D57]">ABOUT THE SYSTEM</h1>
          <p className="text-gray-600">Learn more about the Business Permit Application System</p>
        </div>

        <Card className="mb-8">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle>Business Permit Application System</CardTitle>
            <CardDescription>Streamlining business permit applications for Filipino entrepreneurs</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p>
                This system was built to streamline business permit applications for Filipino entrepreneurs. Inspired by
                official government platforms, it aims to reduce in-person queueing and speed up application approvals.
              </p>
              <p>
                The Business Permit Application System is designed to facilitate both new applications and renewals of
                business permits within our Local Government Unit. By digitizing the application process, we aim to
                improve efficiency, reduce paperwork, and provide a more convenient experience for business owners.
              </p>
              <p>
                Our goal is to support local economic development by making it easier for entrepreneurs to establish and
                maintain their businesses in compliance with local regulations.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-[#0C2D57]" />
                <CardTitle className="text-base">New Applications</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm">
                For businesses applying for a permit for the first time. The application requires complete information
                about the taxpayer, business details, and must be reviewed by various city offices to ensure compliance
                with local regulations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-[#0C2D57]" />
                <CardTitle className="text-base">Renewal Applications</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm">
                For existing businesses that need to renew their permits annually. The renewal process is simplified and
                only requires updating application information and obtaining necessary office reviews.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle>Application Process</CardTitle>
            <CardDescription>Understanding how your application is processed</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#0C2D57] text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-[#0C2D57] mb-1">Submit Application</h3>
                  <p className="text-sm">
                    Complete the online application form with all required information about your business. For new
                    applications, you'll need to provide taxpayer information, business details, and application
                    information.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#0C2D57] text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-[#0C2D57] mb-1">Office Review</h3>
                  <p className="text-sm">
                    Your application will be reviewed by required government offices including the City Planning &
                    Development Office, City Engineer's Office, City Fire Marshal's Office, City Health Office, and
                    Business Permit & License Office. Additional offices may review your application depending on your
                    business type.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#0C2D57] text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-[#0C2D57] mb-1">Payment</h3>
                  <p className="text-sm">
                    Once your application is approved, you'll need to pay the required fees at the City Treasurer's
                    Office. The fee amount depends on your business type, size, and location.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#0C2D57] text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-[#0C2D57] mb-1">Permit Release</h3>
                  <p className="text-sm">
                    After payment, your business permit will be prepared and released. You can track the status of your
                    application using the tracking feature on this website. Once ready, you can claim your business
                    permit at the Business Permit & License Office.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-center">
              <Building className="h-5 w-5 mr-2 text-[#0C2D57]" />
              <CardTitle className="text-base">About Our LGU</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm mb-4">
              Our Local Government Unit is committed to fostering a business-friendly environment that encourages
              entrepreneurship and economic growth. We strive to provide efficient and transparent services to all
              business owners in our jurisdiction.
            </p>
            <p className="text-sm">
              For more information about our LGU and other services we offer, please visit our main website or contact
              our office directly.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
