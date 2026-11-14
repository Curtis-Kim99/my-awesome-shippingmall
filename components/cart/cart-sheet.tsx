'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button, buttonVariants } from '@/components/ui/button'
import { useCart } from './cart-provider'
import { formatMoney } from '@/lib/format'
import type { CartLine } from '@/lib/shopify/types'

function openCheckout(checkoutUrl: string) {
  const url = new URL(checkoutUrl)
  url.searchParams.set('channel', 'online_store')
  if (window.self !== window.top) {
    window.open(url.toString(), '_blank', 'noopener,noreferrer')
  } else {
    window.location.href = url.toString()
  }
}

function CartLineItem({ line }: { line: CartLine }) {
  const { updateItem, removeItem, setOpen } = useCart()
  const [isPending, startTransition] = useTransition()
  const { merchandise } = line
  const variantLabel = merchandise.title === 'Default Title' ? null : merchandise.title

  return (
    <li className="flex gap-4 py-4" aria-busy={isPending}>
      <Link
        href={`/products/${merchandise.product.handle}`}
        onClick={() => setOpen(false)}
        className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted"
      >
        {merchandise.image && (
          <Image
            src={merchandise.image.url}
            alt={merchandise.image.altText ?? merchandise.product.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug text-pretty">{merchandise.product.title}</p>
          <button
            type="button"
            onClick={() => startTransition(() => removeItem(line.id))}
            disabled={isPending}
            className="-m-1 rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
            aria-label={`${merchandise.product.title} 삭제`}
          >
            <X className="size-4" />
          </button>
        </div>
        {variantLabel && <p className="text-xs text-muted-foreground">{variantLabel}</p>}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center rounded-md border border-border">
            <button
              type="button"
              className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
              onClick={() => startTransition(() => updateItem(line.id, line.quantity - 1))}
              disabled={isPending}
              aria-label="수량 줄이기"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-8 text-center font-mono text-sm tabular-nums" aria-live="polite">
              {line.quantity}
            </span>
            <button
              type="button"
              className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
              onClick={() => startTransition(() => updateItem(line.id, line.quantity + 1))}
              disabled={isPending || line.quantity >= 20}
              aria-label="수량 늘리기"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
          <p className="font-mono text-sm font-medium tabular-nums">
            {formatMoney(line.cost.totalAmount)}
          </p>
        </div>
      </div>
    </li>
  )
}

export function CartSheet() {
  const { cart, isOpen, setOpen } = useCart()
  const [isRedirecting, setRedirecting] = useState(false)
  const lines = cart?.lines.nodes ?? []

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full gap-0 bg-background sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="text-base">장바구니</SheetTitle>
          <SheetDescription>
            {lines.length > 0 ? `${cart?.totalQuantity}개의 상품` : '담긴 상품이 없습니다'}
          </SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <p className="text-sm text-muted-foreground">필요한 디스플레이 패널을 찾아보세요.</p>
            <Link
              href="/collections/all"
              onClick={() => setOpen(false)}
              className={buttonVariants({ variant: 'outline', size: 'lg', className: 'px-4' })}
            >
              전체 제품 보기
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-4">
              {lines.map((line) => (
                <CartLineItem key={line.id} line={line} />
              ))}
            </ul>
            <SheetFooter className="border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">소계</span>
                <span className="font-mono text-base font-semibold tabular-nums">
                  {cart && formatMoney(cart.cost.subtotalAmount)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">배송비와 세금은 결제 단계에서 계산됩니다.</p>
              <Button
                size="lg"
                className="h-11 w-full"
                disabled={!cart || isRedirecting}
                onClick={() => {
                  if (!cart) return
                  setRedirecting(true)
                  openCheckout(cart.checkoutUrl)
                  setTimeout(() => setRedirecting(false), 1500)
                }}
              >
                {isRedirecting ? '결제 페이지로 이동 중...' : '결제하기'}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
