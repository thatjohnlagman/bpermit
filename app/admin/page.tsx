"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Lock, Shield } from "lucide-react"

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Check if already authenticated on page load
  useEffect(() => {
    const isAuth = sessionStorage.getItem("admin_authenticated")
    if (isAuth === "true") {
      setAuthenticated(true)
    }
  }, [])

  const handleLogin = async () => {
    if (!password.trim()) {
      setError("Please enter the admin password")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed")
      }

      setAuthenticated(true)
      sessionStorage.setItem("admin_authenticated", "true")
      setPassword("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setAuthenticated(false)
    sessionStorage.removeItem("admin_authenticated")
    setPassword("")
  }

  if (authenticated) {
    return <AdminDashboard onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="ph-card w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-800" />
          </div>
          <CardTitle className="text-blue-800">Admin Access</CardTitle>
          <p className="text-sm text-gray-600">Enter admin password to access the dashboard</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="password" className="required-field">
              Admin Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleLogin} disabled={loading} className="w-full ph-button">
            <Lock className="w-4 h-4 mr-2" />
            {loading ? "Authenticating..." : "Login"}
          </Button>

          <div className="text-center text-xs text-gray-500">
            <p>Authorized personnel only</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
