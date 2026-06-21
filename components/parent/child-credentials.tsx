import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Copy, RotateCcw, Eye, EyeOff, Lock, CheckCircle, XCircle,
  Key, AlertCircle
} from "lucide-react"

interface ChildCredentialsProps {
  child: {
    id: string
    profile_id: string
    auth_user_id: string
    profile: {
      first_name: string
      last_name: string
    }
  }
  credentials?: {
    username: string
    password: string
    email: string
  }
}

export function ChildCredentials({ child, credentials: initialCredentials }: ChildCredentialsProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState(initialCredentials)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  async function resetPassword() {
    setLoading(true)
    try {
      const response = await fetch(`/api/parent/children/${child.id}/credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_password' })
      })

      if (response.ok) {
        const data = await response.json()
        setCredentials({
          username: data.credentials.username,
          password: data.credentials.password,
          email: credentials?.email || ''
        })
        alert('Password reset successfully!')
      } else {
        alert('Failed to reset password')
      }
    } catch (error) {
      console.error('[v0] Error resetting password:', error)
      alert('An error occurred')
    }
    setLoading(false)
  }

  function copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  if (!credentials) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <p className="text-sm text-yellow-800">Credentials not available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5 text-blue-600" />
          Login Credentials
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Share these credentials with {child.profile.first_name}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Username */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Username</label>
          <div className="flex gap-2">
            <div className="flex-1 px-3 py-2 bg-gray-100 rounded border border-gray-300 text-sm font-mono break-all">
              {credentials.username}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(credentials.username, 'username')}
            >
              <Copy className="w-4 h-4" />
              {copied === 'username' && <span className="ml-1 text-xs">Copied!</span>}
            </Button>
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <div className="flex gap-2">
            <div className="flex-1 px-3 py-2 bg-gray-100 rounded border border-gray-300 text-sm font-mono">
              {showPassword ? credentials.password : '•'.repeat(credentials.password.length)}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(credentials.password, 'password')}
            >
              <Copy className="w-4 h-4" />
              {copied === 'password' && <span className="ml-1 text-xs">Copied!</span>}
            </Button>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Student Email</label>
          <div className="flex gap-2">
            <div className="flex-1 px-3 py-2 bg-gray-100 rounded border border-gray-300 text-sm font-mono break-all text-muted-foreground">
              {credentials.email}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(credentials.email, 'email')}
            >
              <Copy className="w-4 h-4" />
              {copied === 'email' && <span className="ml-1 text-xs">Copied!</span>}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">System-generated email for account management</p>
        </div>

        {/* Actions */}
        <div className="border-t pt-4">
          <Button
            onClick={resetPassword}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800">
              Keep these credentials safe. The password can be reset anytime from the parent dashboard.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
