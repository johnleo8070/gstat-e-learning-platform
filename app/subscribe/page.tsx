"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ArrowLeft, Sparkles, Star, Shield } from "lucide-react"
import StripeCheckout from "@/components/stripe-checkout"
import { PRODUCTS } from "@/lib/products"

const plans = PRODUCTS.map(product => ({
  id: product.id,
  name: product.name,
  period: product.interval === 'year' ? 'Per Year' : product.interval === 'month' ? 'Per Month' : '7 Days',
  price: product.priceInCents / 100,
  priceDisplay: product.priceInCents === 0 ? 'Free' : `$${(product.priceInCents / 100).toFixed(2)}`,
  description: product.description,
  features: product.features,
  popular: product.id === 'monthly',
  originalPrice: product.id === 'annual' ? '$191.88' : undefined,
}))

export default function SubscribePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialPlan = searchParams.get("plan") || "monthly"
  
  const [selectedPlan, setSelectedPlan] = useState(initialPlan)
  const [step, setStep] = useState<"plan" | "checkout" | "success">("plan")

  const currentPlan = plans.find(p => p.id === selectedPlan) || plans[1]

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-10 pb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to GSTAT!</h1>
            <p className="text-muted-foreground mb-6">
              Your {currentPlan.name} subscription is now active. Let the learning adventure begin!
            </p>
            
            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Plan</span>
                <span className="font-semibold">{currentPlan.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="font-semibold">{currentPlan.priceDisplay}/{currentPlan.period.toLowerCase()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/dashboard/student">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Learning Now
                </Button>
              </Link>
              <Link href="/dashboard/parent">
                <Button variant="outline" className="w-full">
                  Go to Parent Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
      {/* Header */}
      <header className="p-4">
        <div className="container mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <Image
                src="/images/professor-whiskers-new.png"
                alt="Professor Whiskers"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {step === "plan" ? "Choose Your Plan" : "Complete Your Subscription"}
            </h1>
            <p className="text-blue-100">
              {step === "plan" 
                ? "Start your child's learning adventure today!" 
                : "Just one more step to unlock unlimited learning"}
            </p>
          </div>

          {step === "plan" ? (
            <>
              {/* Plan Selection */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      selectedPlan === plan.id
                        ? "border-2 border-primary ring-4 ring-primary/20 scale-105" 
                        : "border-2 border-transparent hover:border-primary/50"
                    } ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold px-4 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Most Popular
                      </div>
                    )}
                    {selectedPlan === plan.id && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{plan.period}</p>
                      <div className="mt-3">
                        {plan.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through mr-2">{plan.originalPrice}</span>
                        )}
                        <span className="text-3xl font-bold">{plan.priceDisplay}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Continue Button */}
              <div className="text-center">
                <Button 
                  size="lg"
                  onClick={() => setStep("checkout")}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full px-12 py-6 text-lg font-semibold shadow-xl"
                >
                  Continue with {currentPlan.name}
                </Button>
                <p className="text-blue-100 text-sm mt-4 flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" />
                  30-day money-back guarantee
                </p>
              </div>
            </>
          ) : (
            /* Stripe Checkout */
            <div className="grid md:grid-cols-5 gap-8">
              {/* Stripe Embedded Checkout */}
              <div className="md:col-span-3">
                <Card>
                  <CardContent className="p-0">
                    <StripeCheckout 
                      productId={selectedPlan}
                      onSuccess={() => setStep("success")}
                      onCancel={() => setStep("plan")}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="md:col-span-2">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{currentPlan.name} Plan</span>
                        {currentPlan.popular && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Popular</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{currentPlan.description}</p>
                    </div>

                    <ul className="space-y-2">
                      {currentPlan.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="border-t pt-4 space-y-2">
                      {currentPlan.originalPrice && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Original Price</span>
                          <span className="line-through text-muted-foreground">{currentPlan.originalPrice}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="text-2xl font-bold text-primary">{currentPlan.priceDisplay}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {currentPlan.id === "free-trial" 
                          ? "No credit card required" 
                          : `Billed ${currentPlan.period.toLowerCase()}`}
                      </p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <p className="text-sm text-green-700 font-medium">30-Day Money-Back Guarantee</p>
                      <p className="text-xs text-green-600">Not satisfied? Get a full refund, no questions asked.</p>
                    </div>

                    <Button 
                      variant="ghost"
                      onClick={() => setStep("plan")}
                      className="w-full"
                    >
                      Back to Plan Selection
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
