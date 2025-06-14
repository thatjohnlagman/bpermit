import { NavigationMenu } from "@/components/navigation-menu"

export default function Header() {
  return (
    <header className="bg-[#0C2D57] text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div>
              <h1 className="text-xl font-bold">BUSINESS PERMIT APPLICATION SYSTEM</h1>
              <p className="text-xs md:text-sm">Republic of the Philippines</p>
            </div>
          </div>
          <div className="hidden md:flex space-x-2">
            <div className="bg-yellow-500 text-[#0C2D57] px-3 py-1 text-xs font-bold rounded">TRANSPARENCY</div>
            <div className="bg-red-600 px-3 py-1 text-xs font-bold rounded">E-SERVICES</div>
          </div>
        </div>
      </div>
      <NavigationMenu />
    </header>
  )
}
