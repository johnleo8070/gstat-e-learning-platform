import { Card, CardContent } from "@/components/ui/card"
import { Gamepad2, BookOpen, LineChart, Shield, Sparkles, Users } from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Interactive Lessons",
    description: "Engaging content designed to make learning fun and memorable for young minds.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Gamepad2,
    title: "Educational Games",
    description: "Learn through play with our collection of fun and educational games.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: LineChart,
    title: "Progress Tracking",
    description: "Parents can monitor their child's learning journey with detailed reports.",
    color: "bg-chart-3/10 text-chart-3",
  },
  {
    icon: Shield,
    title: "Safe Environment",
    description: "A secure, ad-free platform designed specifically for children.",
    color: "bg-chart-5/10 text-chart-5",
  },
  {
    icon: Sparkles,
    title: "Rewards & Badges",
    description: "Motivate learning with fun achievements, badges, and rewards.",
    color: "bg-accent text-primary",
  },
  {
    icon: Users,
    title: "Parent Dashboard",
    description: "Easy-to-use tools for parents to manage and guide their child's education.",
    color: "bg-muted text-secondary",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Why Choose <span className="text-primary">GSTAT</span>?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Our platform is designed with your child&apos;s development in mind, combining education with entertainment.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              <CardContent className="p-6">
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
