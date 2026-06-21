export const dynamic = "force-dynamic";
export const revalidate = 0;
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, GraduationCap, Star, Medal } from "lucide-react"
import { AddChildDialog } from "@/components/parent/add-child-dialog"
import { getChildren } from "@/app/actions/children"

export default async function ChildrenPage() {
  const childrenList = await getChildren()

  return (
    <div className="p-6 space-y-6">
      <Link href="/dashboard/parent" className="inline-flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Children</h1>
        <AddChildDialog />
      </div>

      {childrenList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center flex flex-col items-center justify-center space-y-4">
            <User className="w-12 h-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">No children added yet</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Add your children to track their progress, assign learning paths, and celebrate their achievements.
            </p>
            <div className="mt-4">
              <AddChildDialog />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {childrenList.map((child: any) => (
            <Card key={child.id} className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    {child.avatar_url ? (
                      <img src={child.avatar_url} alt={child.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-primary">
                        {child.name?.charAt(0).toUpperCase() || 'C'}
                      </span>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{child.name}</CardTitle>
                    {child.grade_level && (
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        Grade {child.grade_level}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4 text-center mb-4">
                  <div className="bg-muted rounded-lg p-3">
                    <Star className="w-5 h-5 mx-auto text-yellow-500 mb-1" />
                    <div className="text-2xl font-bold">{child.total_stars || 0}</div>
                    <div className="text-xs text-muted-foreground">Stars Earned</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <Medal className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                    <div className="text-2xl font-bold">{child.total_badges || 0}</div>
                    <div className="text-xs text-muted-foreground">Badges</div>
                  </div>
                </div>
                <Link href={`/dashboard/parent/children/${child.id}`} className="block">
                  <div className="w-full text-center text-sm font-medium text-primary hover:underline py-2 bg-primary/5 rounded-md transition-colors hover:bg-primary/10">
                    View Full Profile
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
