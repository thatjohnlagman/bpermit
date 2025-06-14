"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu } from "lucide-react"

export function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="bg-[#1A4D8C] text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <button className="md:hidden py-3" onClick={toggleMenu} aria-label="Toggle menu">
            <Menu className="h-6 w-6" />
          </button>

          <div
            className={`${isOpen ? "block" : "hidden"} md:flex md:items-center absolute md:static left-0 right-0 top-[120px] bg-[#1A4D8C] md:bg-transparent z-50 md:z-auto`}
          >
            <ul className="flex flex-col md:flex-row md:space-x-1">
              <li>
                <Link href="/" className="block py-3 px-4 hover:bg-[#0C2D57] font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/apply" className="block py-3 px-4 hover:bg-[#0C2D57] font-medium">
                  Apply
                </Link>
              </li>
              <li>
                <Link href="/renew" className="block py-3 px-4 hover:bg-[#0C2D57] font-medium">
                  Renew
                </Link>
              </li>
              <li>
                <Link href="/track" className="block py-3 px-4 hover:bg-[#0C2D57] font-medium">
                  Track
                </Link>
              </li>
              <li>
                <Link href="/modify" className="block py-3 px-4 hover:bg-[#0C2D57] font-medium">
                  Modify
                </Link>
              </li>
              <li>
                <Link href="/about" className="block py-3 px-4 hover:bg-[#0C2D57] font-medium">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}
