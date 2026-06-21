'use client'

import { useCallback, useState, useEffect } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'

import { startCheckoutSession } from '@/app/actions/stripe'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

interface CheckoutProps {
  productId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function Checkout({ productId, onSuccess, onCancel }: CheckoutProps) {
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initCheckout = async () => {
      try {
        setLoading(true)
        const result = await startCheckoutSession(productId)
        
        if ('freeTrialActivated' in result && result.freeTrialActivated) {
          // Free trial was activated, redirect to dashboard
          router.push('/dashboard/student')
          onSuccess?.()
          return
        }
        
        if ('clientSecret' in result && result.clientSecret) {
          setClientSecret(result.clientSecret)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to start checkout')
      } finally {
        setLoading(false)
      }
    }

    initCheckout()
  }, [productId, router, onSuccess])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-destructive mb-4">{error}</p>
        <button
          onClick={onCancel}
          className="text-primary hover:underline"
        >
          Go back
        </button>
      </div>
    )
  }

  if (!clientSecret) {
    return null
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
