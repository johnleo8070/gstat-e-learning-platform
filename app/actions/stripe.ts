'use server'

import { stripe } from '@/lib/stripe'
import { PRODUCTS } from '@/lib/products'
import { createClient } from '@/lib/supabase/server'

export async function startCheckoutSession(productId: string) {
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  // Get current user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // For free trial, just update subscription status and redirect
  if (productId === 'free-trial') {
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (profile) {
        // Create free trial subscription
        await supabase.from('subscriptions').upsert({
          profile_id: profile.id,
          tier: 'free_trial',
          status: 'trial',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        })
      }
    }
    return { success: true, freeTrialActivated: true }
  }

  // For paid subscriptions, use Stripe
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    customer_email: user?.email,
    metadata: {
      user_id: user?.id || '',
      product_id: productId,
    },
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
          recurring: product.interval ? {
            interval: product.interval,
          } : undefined,
        },
        quantity: 1,
      },
    ],
    mode: product.interval ? 'subscription' : 'payment',
  })

  return { clientSecret: session.client_secret }
}

export async function createSubscription(
  customerId: string,
  priceId: string
) {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  })

  return subscription
}

export async function getOrCreateCustomer(email: string, userId: string) {
  // Check if customer exists
  const customers = await stripe.customers.list({ email, limit: 1 })
  
  if (customers.data.length > 0) {
    return customers.data[0]
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    metadata: { user_id: userId },
  })

  return customer
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId)
  return subscription
}

export async function getSubscriptionStatus(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  return subscription
}
