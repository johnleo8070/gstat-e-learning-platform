import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

// Use service role for webhook (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice)
        break
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id
  const productId = session.metadata?.product_id

  if (!userId) return

  // Get profile
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!profile) return

  // Determine tier
  const tier = productId === 'annual' ? 'annual' : 'monthly'

  // Update subscription
  await supabaseAdmin.from('subscriptions').upsert({
    profile_id: profile.id,
    stripe_customer_id: session.customer as string,
    stripe_subscription_id: session.subscription as string,
    tier,
    status: 'active',
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(
      Date.now() + (tier === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000
    ).toISOString(),
  })
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  // Find subscription by stripe_customer_id
  const { data: sub } = await supabaseAdmin
    .from('subscriptions')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!sub) return

  // Map Stripe status to our status
  let status: 'trial' | 'active' | 'canceled' | 'expired' | 'past_due' = 'active'
  switch (subscription.status) {
    case 'trialing':
      status = 'trial'
      break
    case 'active':
      status = 'active'
      break
    case 'canceled':
      status = 'canceled'
      break
    case 'past_due':
      status = 'past_due'
      break
    case 'unpaid':
      status = 'expired'
      break
  }

  await supabaseAdmin
    .from('subscriptions')
    .update({
      status,
      stripe_subscription_id: subscription.id,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sub.id)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId)
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Payment succeeded - subscription stays active
  console.log('Payment succeeded for invoice:', invoice.id)
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId)
}
