"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free Trial",
    period: "7 Days",
    price: "Free",
    description: "Try before you buy",
    features: [
      "Access to 10 lessons",
      "3 educational games",
      "Basic progress tracking",
      "Email support",
    ],
    popular: false,
    buttonText: "Start Free Trial",
    buttonVariant: "outline" as const,
    href: "/subscribe?plan=free-trial",
  },
  {
    name: "Monthly",
    period: "Per Month",
    price: "$15.99",
    description: "Great for getting started",
    features: [
      "Unlimited lessons access",
      "All educational games",
      "Full progress tracking",
      "Parent dashboard",
      "Rewards & badges",
      "Priority support",
    ],
    popular: true,
    buttonText: "Get Started",
    buttonVariant: "default" as const,
    href: "/subscribe?plan=monthly",
  },
  {
    name: "Annual",
    period: "Per Year",
    price: "$99.99",
    originalPrice: "$191.88",
    description: "Best value - Save 48%",
    features: [
      "Everything in Monthly",
      "Exclusive content",
      "Early access to new features",
      "Multiple child profiles",
      "Printable worksheets",
      "24/7 priority support",
    ],
    popular: false,
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    href: "/subscribe?plan=annual",
  },
]

export function SubscriptionSection() {
  return (
    <section id="subscription" className="py-16 md:py-24 bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100 relative overflow-hidden">
      {/* Floating Kids Attractions */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Stars */}
        <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{ animationDuration: '3s' }}>⭐</div>
        <div className="absolute top-20 right-20 text-3xl animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>🌟</div>
        <div className="absolute bottom-32 left-16 text-2xl animate-bounce" style={{ animationDuration: '2.8s', animationDelay: '1s' }}>✨</div>
        
        {/* Books and Learning */}
        <div className="absolute top-32 left-[15%] text-5xl animate-float" style={{ animationDuration: '4s' }}>📚</div>
        <div className="absolute top-16 right-[10%] text-4xl animate-float" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>📖</div>
        <div className="absolute bottom-20 right-[15%] text-4xl animate-float" style={{ animationDuration: '4.5s', animationDelay: '1s' }}>✏️</div>
        
        {/* Fun Elements */}
        <div className="absolute top-40 right-[25%] text-5xl animate-wiggle" style={{ animationDuration: '2s' }}>🎈</div>
        <div className="absolute bottom-40 left-[20%] text-4xl animate-wiggle" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }}>🎨</div>
        <div className="absolute top-1/2 left-8 text-5xl animate-float" style={{ animationDuration: '5s' }}>🚀</div>
        
        {/* ABC Blocks */}
        <div className="absolute bottom-24 right-[30%] text-4xl animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.7s' }}>🔤</div>
        <div className="absolute top-24 left-[30%] text-3xl animate-float" style={{ animationDuration: '4s', animationDelay: '1.2s' }}>🎯</div>
        
        {/* Music and Games */}
        <div className="absolute bottom-16 left-[40%] text-4xl animate-wiggle" style={{ animationDuration: '2.2s' }}>🎵</div>
        <div className="absolute top-12 left-[50%] text-5xl animate-float" style={{ animationDuration: '3.8s', animationDelay: '0.8s' }}>🎮</div>
        
        {/* Trophies */}
        <div className="absolute bottom-28 right-8 text-4xl animate-bounce" style={{ animationDuration: '2.7s', animationDelay: '0.4s' }}>🏆</div>
        <div className="absolute top-36 right-[40%] text-3xl animate-float" style={{ animationDuration: '4.2s' }}>🎁</div>
        
        {/* Clouds */}
        <div className="absolute top-8 left-[40%] text-6xl opacity-60 animate-float" style={{ animationDuration: '6s' }}>☁️</div>
        <div className="absolute top-4 right-[35%] text-5xl opacity-50 animate-float" style={{ animationDuration: '7s', animationDelay: '1s' }}>☁️</div>
        <div className="absolute bottom-8 left-[60%] text-4xl opacity-40 animate-float" style={{ animationDuration: '5.5s', animationDelay: '2s' }}>☁️</div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-wiggle { animation: wiggle 2s ease-in-out infinite; }
      `}</style>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900">Subscription</h2>
          <p className="mt-3 text-blue-700 max-w-xl mx-auto">
            Choose the perfect plan for your child&apos;s learning journey
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative border-2 transition-all duration-300 hover:shadow-2xl bg-white/95 backdrop-blur-sm ${
                plan.popular 
                  ? "border-primary shadow-xl scale-105 z-10" 
                  : "border-white hover:border-primary/50 shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg font-semibold text-foreground">{plan.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{plan.period}</p>
                <div className="mt-4">
                  {plan.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through mr-2">{plan.originalPrice}</span>
                  )}
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-chart-3 shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button 
                    variant={plan.buttonVariant}
                    className={`w-full rounded-full ${
                      plan.popular 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                        : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
