import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#0C2D57] text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-bold mb-3 border-b border-yellow-400 pb-2">Contact Information</h3>
            <p className="text-sm mb-1">City Hall, Government Center</p>
            <p className="text-sm mb-1">Telephone: (02) 123-4567</p>
            <p className="text-sm mb-1">Email: businesspermits@lgu.gov.ph</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3 border-b border-yellow-400 pb-2">Quick Links</h3>
            <ul className="text-sm space-y-1">
              <li>
                <Link href="/" className="hover:underline hover:text-yellow-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/apply" className="hover:underline hover:text-yellow-400 transition-colors">
                  New Application
                </Link>
              </li>
              <li>
                <Link href="/renew" className="hover:underline hover:text-yellow-400 transition-colors">
                  Renewal
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:underline hover:text-yellow-400 transition-colors">
                  Track Application
                </Link>
              </li>
              <li>
                <Link href="/modify" className="hover:underline hover:text-yellow-400 transition-colors">
                  Modify Application
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline hover:text-yellow-400 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3 border-b border-yellow-400 pb-2">Office Hours</h3>
            <p className="text-sm mb-1">Monday to Friday: 8:00 AM - 5:00 PM</p>
            <p className="text-sm mb-1">Except Holidays</p>
            <p className="text-sm mt-3 text-yellow-400">For technical support:</p>
            <p className="text-sm">support@lgu.gov.ph</p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-700 text-center text-xs">
          <p>© 2025 Business Permit Application System. All Rights Reserved.</p>
          <p className="mt-1">Republic of the Philippines</p>
        </div>
      </div>
    </footer>
  )
}
