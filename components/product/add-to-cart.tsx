'use client'

import { useMemo, useState, useTransition } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart/cart-provider'
import { formatMoney, hasDiscount } from '@/lib/format'
import type { Product } from '@/lib/shopify/types'

const MAX_QUANTITY = 20

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart()
  const variants = product.variants.nodes
  const firstAvailable = variants.find((v) => v.availableForSale) ?? variants[0]

  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(firstAvailable.selectedOptions.map((o) => [o.name, o.value])),
  )
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const variant = useMemo(
    () =>
      variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value)) ?? firstAvailable,
    [variants, selected, firstAvailable],
  )

  const visibleOptions = product.options.filter(
    (o) => !(o.optionValues.length === 1 && o.optionValues[0].name === 'Default Title'),
  )
  const onSale = hasDiscount(variant.price, variant.compareAtPrice)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline gap-3">
        <p className="font-mono text-3xl font-semibold tabular-nums">{formatMoney(variant.price)}</p>
        {onSale && variant.compareAtPrice && (
          <>
            <p className="font-mono text-base text-muted-foreground line-through tabular-nums">
              {formatMoney(variant.compareAtPrice)}
            </p>
            <span className="rounded-sm bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
              {Math.round(
                (1 - Number(variant.price.amount) / Number(variant.compareAtPrice.amount)) * 100,
              )}
              % OFF
            </span>
          </>
        )}
      </div>

      {visibleOptions.map((option) => (
        <fieldset key={option.name} className="flex flex-col gap-3">
          <legend className="mb-3 text-sm font-medium">{option.name}</legend>
          <div className="flex flex-wrap gap-2">
            {option.optionValues.map(({ name }) => {
              const isSelected = selected[option.name] === name
              const candidate = variants.find((v) =>
                v.selectedOptions.every((o) =>
                  o.name === option.name ? o.value === name : selected[o.name] === o.value,
                ),
              )
              const available = candidate?.availableForSale ?? false
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={isSelected}
                  disabled={!available}
                  onClick={() => setSelected((prev) => ({ ...prev, [option.name]: name }))}
                  className={
                    isSelected
                      ? 'rounded-md border border-foreground bg-foreground px-4 py-2.5 text-sm text-background'
                      : 'rounded-md border border-border bg-card px-4 py-2.5 text-sm hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:line-through'
                  }
                >
                  {name}
                </button>
              )
            })}
          </div>
        </fieldset>
      ))}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex h-12 items-center justify-between rounded-md border border-border bg-card sm:w-36">
          <button
            type="button"
            className="flex h-full w-11 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="수량 줄이기"
          >
            <Minus className="size-4" />
          </button>
          <span className="font-mono tabular-nums" aria-live="polite" aria-label={`수량 ${quantity}`}>
            {quantity}
          </span>
          <button
            type="button"
            className="flex h-full w-11 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
            onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
            disabled={quantity >= MAX_QUANTITY}
            aria-label="수량 늘리기"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <Button
          size="lg"
          className="h-12 flex-1 text-base"
          disabled={!variant.availableForSale || isPending}
          onClick={() => {
            setError(null)
            startTransition(async () => {
              try {
                await addItem(variant.id, quantity)
                setQuantity(1)
              } catch (e) {
                setError(e instanceof Error ? e.message : '장바구니에 담지 못했습니다.')
              }
            })
          }}
        >
          {!variant.availableForSale ? '품절' : isPending ? '담는 중...' : '장바구니에 담기'}
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
