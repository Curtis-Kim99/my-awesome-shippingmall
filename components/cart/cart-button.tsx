'use client'

import { ShoppingBag } from 'lucide-react'
import { useCart } from './cart-provider'

export function CartButton() {
  const { cart, setOpen } = useCart()
  const count = cart?.totalQuantity ?? 0

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="relative flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
      aria-label={`장바구니 열기, ${count}개 상품`}
    >
      <ShoppingBag className="size-5" aria-hidden="true" />
      <span className="hidden sm:inline">장바구니</span>
      {count > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 font-mono text-[11px] font-medium text-primary-foreground tabular-nums">
          {count}
        </span>
      )}
    </button>
  )
}
