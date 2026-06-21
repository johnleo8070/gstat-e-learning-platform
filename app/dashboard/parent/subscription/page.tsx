"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Check, Zap, Calendar } from "lucide-react"

const plans = [
  {
    name: "Basic",
    price: "$9.99",
    period: "/month",
    features: ["Access to 3 subjects", "1 child account", "Weekly progress reports", "Community support"]
  },
  {
    name: "Premium",
    price: "$19.99",
    period: "/month",
    current: true,
    features: ["Access to all subjects", "Unlimited child accounts", "Daily progress reports", "Priority support", "Advanced analytics", "Offline access"]
  },
  {
    name: "Family",
    price: "$29.99",
    period: "/month",
    features: ["All Premium features", "Up to 5 children", "Family insights & reports", "Parent coaching sessions", "Dedicated support"]
  },
]

export default function SubscriptionPage() {
  return (
    <div className="p-6 space-y-6">
      <Link href="/dashboard/parent" className="inline-flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Subscription & Billing</h1>
        <p className="text-muted-foreground">Manage your GSTAT subscription</p>
      </div>

      {/* Current Plan */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">Premium Plan</p>
              <p className="text-muted-foreground mt-1">$19.99 per month</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Renews on</p>
              <p className="font-bold">March 15, 2024</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Manage Billing
          </Button>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <div>
        <h2 className="text-2xl font-bold mb-4">All Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, idx) => (
            <Card key={idx} className={`relative overflow-hidden ${plan.current ? "border-2 border-primary shadow-lg" : ""}`}>
              {plan.current && (
                <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-xs font-bold rounded-bl">
                  Current
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-3">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full" 
                  variant={plan.current ? "outline" : "default"}
                  disabled={plan.current}
                >
                  {plan.current ? "Current Plan" : "Upgrade"}
                </Button>
                <div className="space-y-3">
                  {plan.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: "Feb 15, 2024", amount: "$19.99", status: "Paid" },
              { date: "Jan 15, 2024", amount: "$19.99", status: "Paid" },
              { date: "Dec 15, 2023", amount: "$9.99", status: "Paid" },
            ].map((invoice, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{invoice.date}</p>
                    <p className="text-xs text-muted-foreground">Invoice</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{invoice.amount}</p>
                  <p className="text-xs text-green-600">{invoice.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cancel Subscription */}
      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-900">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-800 mb-4">
            If you cancel your subscription, you'll lose access to premium features. Your data will be preserved for 30 days.
          </p>
          <Button variant="destructive">Cancel Subscription</Button>
        </CardContent>
      </Card>
    </div>
  )
}
