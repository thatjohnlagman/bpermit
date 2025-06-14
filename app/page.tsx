import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, FileText, RefreshCw, Search, Edit, Timer, Shield, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="bg-gray-100">
      {/* Hero Banner */}
      <div className="bg-[#0C2D57] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl font-bold mb-4">BUSINESS PERMIT APPLICATION SYSTEM</h1>
              <p className="mb-6">
                Streamlining business permit applications for Filipino entrepreneurs. Apply, renew, and track your
                business permits online.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-[#0C2D57] font-bold">
                  <Link href="/apply">NEW APPLICATION</Link>
                </Button>
                <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-bold">
                  <Link href="/renew">RENEWAL</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg border-4 border-white p-8">
                <div className="text-center space-y-6">
                  <div className="flex justify-center space-x-8">
                    <div className="text-center">
                      <Timer className="h-12 w-12 mx-auto mb-2 text-yellow-400" />
                      <p className="text-sm font-semibold">Fast Processing</p>
                    </div>
                    <div className="text-center">
                      <Shield className="h-12 w-12 mx-auto mb-2 text-yellow-400" />
                      <p className="text-sm font-semibold">Secure System</p>
                    </div>
                    <div className="text-center">
                      <Users className="h-12 w-12 mx-auto mb-2 text-yellow-400" />
                      <p className="text-sm font-semibold">24/7 Support</p>
                    </div>
                  </div>
                  <div className="border-t border-white/20 pt-6">
                    <h3 className="text-xl font-bold mb-2">Digital Government Services</h3>
                    <p className="text-sm opacity-90">
                      Experience efficient, transparent, and accessible business permit processing through our modern
                      digital platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-[#0C2D57] border-b-2 border-yellow-400 pb-2 inline-block">
            OUR SERVICES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-t-4 border-t-[#0C2D57]">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center text-[#0C2D57]">
                  <FileText className="mr-2 h-5 w-5" />
                  New Application
                </CardTitle>
                <CardDescription>Apply for a new business permit</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm">
                  Complete the application form and submit required documents to obtain a new business permit for your
                  enterprise.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/apply" className="flex items-center justify-between">
                    Apply Now <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-t-4 border-t-[#0C2D57]">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center text-[#0C2D57]">
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Renewal
                </CardTitle>
                <CardDescription>Renew your existing business permit</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm">
                  Renew your business permit annually to continue operating your business legally within the
                  jurisdiction.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/renew" className="flex items-center justify-between">
                    Renew Now <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-t-4 border-t-[#0C2D57]">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center text-[#0C2D57]">
                  <Search className="mr-2 h-5 w-5" />
                  Track Application
                </CardTitle>
                <CardDescription>Check the status of your application</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm">
                  Track the current status of your business permit application using your application reference number.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/track" className="flex items-center justify-between">
                    Track Now <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-t-4 border-t-[#0C2D57]">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center text-[#0C2D57]">
                  <Edit className="mr-2 h-5 w-5" />
                  Modify Application
                </CardTitle>
                <CardDescription>Update your existing application</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm">
                  Modify or update information in your existing business permit application before final approval.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/modify" className="flex items-center justify-between">
                    Modify Now <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="py-12 bg-[#1A4D8C] text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center border-b-2 border-yellow-400 pb-2 inline-block">
            APPLICATION PROCESS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white text-[#0C2D57] p-6 rounded-lg text-center">
              <div className="bg-[#0C2D57] text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold mb-2">Submit Application</h3>
              <p className="text-sm">Complete the online application form with all required information</p>
            </div>

            <div className="bg-white text-[#0C2D57] p-6 rounded-lg text-center">
              <div className="bg-[#0C2D57] text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold mb-2">Office Review</h3>
              <p className="text-sm">Application reviewed by required government offices</p>
            </div>

            <div className="bg-white text-[#0C2D57] p-6 rounded-lg text-center">
              <div className="bg-[#0C2D57] text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold mb-2">Payment</h3>
              <p className="text-sm">Pay the required fees at the City Treasurer's Office</p>
            </div>

            <div className="bg-white text-[#0C2D57] p-6 rounded-lg text-center">
              <div className="bg-[#0C2D57] text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h3 className="font-bold mb-2">Permit Release</h3>
              <p className="text-sm">Claim your business permit at the Business Permit & License Office</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
