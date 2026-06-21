"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Bell, Lock, User, LogOut, Eye, EyeOff } from "lucide-react"

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "parent@example.com",
    notifications: true,
    emailReports: true,
    activityAlerts: true,
  })

  return (
    <div className="p-6 space-y-6">
      <Link href="/dashboard/parent" className="inline-flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">First Name</label>
              <Input value={settings.firstName} placeholder="First Name" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Last Name</label>
              <Input value={settings.lastName} placeholder="Last Name" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <Input value={settings.email} placeholder="Email" type="email" disabled />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Current Password</label>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter current password"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">New Password</label>
            <Input type="password" placeholder="Enter new password" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Confirm Password</label>
            <Input type="password" placeholder="Confirm new password" />
          </div>
          <Button>Change Password</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">All Notifications</p>
              <p className="text-sm text-muted-foreground">Receive all platform notifications</p>
            </div>
            <input 
              type="checkbox" 
              checked={settings.notifications}
              className="w-5 h-5"
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Weekly Reports</p>
              <p className="text-sm text-muted-foreground">Get weekly progress reports via email</p>
            </div>
            <input 
              type="checkbox" 
              checked={settings.emailReports}
              className="w-5 h-5"
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Activity Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified of child's learning activity</p>
            </div>
            <input 
              type="checkbox" 
              checked={settings.activityAlerts}
              className="w-5 h-5"
            />
          </div>
          <Button>Save Preferences</Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-100 rounded-lg">
            <p className="text-sm text-red-900 mb-3">
              Logging out will end your session on this device.
            </p>
            <Button variant="destructive" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </div>
          <div className="p-4 bg-red-100 rounded-lg">
            <p className="text-sm text-red-900 mb-3">
              Deleting your account is permanent and cannot be undone.
            </p>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
