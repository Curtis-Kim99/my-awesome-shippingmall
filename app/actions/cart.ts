'use server'

import { cookies } from 'next/headers'
import {
  addCartLines,
  createCart,
  fetchCart,
  removeCartLines,
  updateCartLines,
} from '@/lib/shopify'
import type { Cart } from '@/lib/shopify/types'

const CART_COOKIE = 'cartId'
const MAX_LINE_QUANTITY = 20

function isValidQuantity(quantity: unknown, min: number): quantity is number {
  return (
    typeof quantity === 'number' &&
    Number.isInteger(quantity) &&
    quantity >= min &&
    quantity <= MAX_LINE_QUANTITY
  )
}

function isShopifyGid(value: unknown, type: string): value is string {
  return typeof value === 'string' && value.startsWith(`gid://shopify/${type}/`)
}

async function setCartCookie(cartId: string) {
  const store = await cookies()
  store.set(CART_COOKIE, cartId, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  })
}

export async function getCart(): Promise<Cart | null> {
  const cartId = (await cookies()).get(CART_COOKIE)?.value
  if (!cartId) return null
  try {
    return await fetchCart(cartId)
  } catch {
    return null
  }
}

export async function addToCart(merchandiseId: string, quantity: number): Promise<Cart> {
  if (!isShopifyGid(merchandiseId, 'ProductVariant')) throw new Error('잘못된 상품입니다.')
  if (!isValidQuantity(quantity, 1)) throw new Error('수량이 올바르지 않습니다.')

  const existing = await getCart()
  if (!existing) {
    const cart = await createCart([{ merchandiseId, quantity }])
    await setCartCookie(cart.id)
    return cart
  }

  const currentLine = existing.lines.nodes.find((l) => l.merchandise.id === merchandiseId)
  if (currentLine) {
    const nextQuantity = Math.min(currentLine.quantity + quantity, MAX_LINE_QUANTITY)
    return updateCartLines(existing.id, [{ id: currentLine.id, quantity: nextQuantity }])
  }
  return addCartLines(existing.id, [{ merchandiseId, quantity }])
}

export async function updateCartLine(lineId: string, quantity: number): Promise<Cart | null> {
  if (!isShopifyGid(lineId, 'CartLine')) throw new Error('잘못된 항목입니다.')
  if (!isValidQuantity(quantity, 0)) throw new Error('수량이 올바르지 않습니다.')

  const cart = await getCart()
  if (!cart) return null
  if (quantity === 0) return removeCartLines(cart.id, [lineId])
  return updateCartLines(cart.id, [{ id: lineId, quantity }])
}

export async function removeCartLine(lineId: string): Promise<Cart | null> {
  if (!isShopifyGid(lineId, 'CartLine')) throw new Error('잘못된 항목입니다.')
  const cart = await getCart()
  if (!cart) return null
  return removeCartLines(cart.id, [lineId])
}
