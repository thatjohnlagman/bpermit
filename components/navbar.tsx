"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/apply", label: "Apply" },
  { href: "/renew", label: "Renew" },
  { href: "/track", label: "Track" },
  { href: "/modify", label: "Modify" },
  { href: "/about", label: "About" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="ph-header shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-800 font-bold text-lg">LGU</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Business Permit Application System</h1>
              <p className="text-sm opacity-90">Local Government Unit</p>
            </div>
          </div>
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href ? "bg-white text-blue-800" : "text-white hover:bg-blue-700",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
