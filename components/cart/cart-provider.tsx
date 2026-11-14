'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import useSWR from 'swr'
import { addToCart, getCart, removeCartLine, updateCartLine } from '@/app/actions/cart'
import type { Cart } from '@/lib/shopify/types'

type CartContextValue = {
  cart: Cart | null | undefined
  isLoading: boolean
  isOpen: boolean
  setOpen: (open: boolean) => void
  addItem: (variantId: string, quantity: number) => Promise<void>
  updateItem: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: cart, isLoading, mutate } = useSWR('cart', () => getCart(), {
    revalidateOnFocus: false,
  })
  const [isOpen, setOpen] = useState(false)

  const addItem = useCallback(
    async (variantId: string, quantity: number) => {
      const next = await addToCart(variantId, quantity)
      await mutate(next, { revalidate: false })
      setOpen(true)
    },
    [mutate],
  )

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      const next = await updateCartLine(lineId, quantity)
      await mutate(next, { revalidate: false })
    },
    [mutate],
  )

  const removeItem = useCallback(
    async (lineId: string) => {
      const next = await removeCartLine(lineId)
      await mutate(next, { revalidate: false })
    },
    [mutate],
  )

  const value = useMemo(
    () => ({ cart, isLoading, isOpen, setOpen, addItem, updateItem, removeItem }),
    [cart, isLoading, isOpen, addItem, updateItem, removeItem],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
