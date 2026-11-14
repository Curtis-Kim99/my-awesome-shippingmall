import type { Money } from '@/lib/shopify/types'

export function formatMoney({ amount, currencyCode }: Money) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(amount))
}

export function hasDiscount(price: Money, compareAt?: Money | null) {
  return !!compareAt && Number(compareAt.amount) > Number(price.amount)
}
