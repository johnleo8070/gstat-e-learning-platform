export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  interval?: 'month' | 'year'
  features: string[]
}

// Subscription products for GSTAT eLearning Platform
export const PRODUCTS: Product[] = [
  {
    id: 'free-trial',
    name: 'Free Trial',
    description: '7-day free trial to explore GSTAT',
    priceInCents: 0,
    features: [
      'Access to 10 lessons',
      '3 educational games',
      'Basic progress tracking',
      'Email support',
    ],
  },
  {
    id: 'monthly',
    name: 'Monthly Subscription',
    description: 'Full access billed monthly',
    priceInCents: 1599, // $15.99
    interval: 'month',
    features: [
      'Unlimited lessons access',
      'All educational games',
      'Full progress tracking',
      'Parent dashboard',
      'Rewards & badges',
      'Priority support',
    ],
  },
  {
    id: 'annual',
    name: 'Annual Subscription',
    description: 'Best value - Save 48%',
    priceInCents: 9999, // $99.99
    interval: 'year',
    features: [
      'Everything in Monthly',
      'Exclusive content',
      'Early access to new features',
      'Multiple child profiles',
      'Printable worksheets',
      '24/7 priority support',
    ],
  },
]

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id)
}

export function getProductPrice(id: string): number {
  const product = getProductById(id)
  return product?.priceInCents ?? 0
}
