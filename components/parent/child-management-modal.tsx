import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  X, Lock,
  AlertCircle, Trash2
} from "lucide-react"

interface Child {
  id: string
  profile_id: string
  profile: {
    first_name: string
    last_name: string
    avatar_url: string | null
  }
  grade_level: number | null
  total_stars: number
  total_badges: number
}

interface ChildManagementModalProps {
  child: Child
  onClose: () => void
  onRefresh: () => void
}

export function ChildManagementModal({
  child,
  onClose,
  onRefresh
}: ChildManagementModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview')
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDeleteChild() {
    if (!confirm(`Are you sure you want to delete ${child.profile.first_name}? This cannot be undone.`)) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/parent/children/${child.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Child profile deleted')
        onClose()
        onRefresh()
      } else {
        alert('Failed to delete child profile')
      }
    } catch (error) {
      console.error('[v0] Error deleting child:', error)
      alert('An error occurred')
    }
    setIsDeleting(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white border-b">
          <CardTitle>Manage {child.profile.first_name}'s Account</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Settings
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 mb-1">Grade Level</p>
                  <p className="text-lg font-bold text-blue-900">
                    {child.grade_level || 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="text-xs text-amber-600 mb-1">Total Stars</p>
                  <p className="text-lg font-bold text-amber-900">{child.total_stars}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-600 mb-1">Badges Earned</p>
                  <p className="text-lg font-bold text-purple-900">{child.total_badges}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600 mb-1">Account ID</p>
                  <p className="text-xs font-mono text-green-900 break-all">{child.id.slice(0, 8)}...</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-900 text-base">Delete Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 bg-red-100 rounded">
                    <p className="text-sm text-red-900 mb-3">
                      Delete this child profile and all associated data. This action cannot be undone.
                    </p>
                    <Button
                      onClick={handleDeleteChild}
                      disabled={isDeleting}
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isDeleting ? 'Deleting...' : 'Delete Profile'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
