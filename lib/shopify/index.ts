import 'server-only'
import type {
  Cart,
  Collection,
  CollectionSummary,
  Product,
  ProductCardData,
} from './types'

const API_VERSION = '2026-04'

function isShopifyConfigured() {
  return Boolean(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN)
}

function getEndpoint() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  if (!domain) throw new Error('SHOPIFY_STORE_DOMAIN is not set')
  return `https://${domain}/api/${API_VERSION}/graphql.json`
}

type FetchOptions = {
  query: string
  variables?: Record<string, unknown>
  cache?: 'no-store' | 'catalog'
}

export async function shopifyFetch<T>({
  query,
  variables,
  cache = 'catalog',
}: FetchOptions): Promise<T> {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  if (!token) throw new Error('SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set')

  const res = await fetch(getEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    ...(cache === 'no-store'
      ? { cache: 'no-store' as const }
      : { next: { revalidate: 60 } }),
  })

  const json = await res.json()
  if (!res.ok || json.errors) {
    const message = json.errors?.[0]?.message ?? res.statusText
    throw new Error(`Shopify Storefront API error: ${message}`)
  }
  return json.data as T
}

const IMAGE = `url altText width height`
const MONEY = `amount currencyCode`

const PRODUCT_CARD = `
  fragment ProductCard on Product {
    id
    handle
    title
    productType
    tags
    availableForSale
    featuredImage { ${IMAGE} }
    priceRange { minVariantPrice { ${MONEY} } }
    compareAtPriceRange { maxVariantPrice { ${MONEY} } }
  }
`

const CART = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { ${MONEY} }
      totalAmount { ${MONEY} }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost { totalAmount { ${MONEY} } }
        merchandise {
          ... on ProductVariant {
            id
            title
            price { ${MONEY} }
            image { ${IMAGE} }
            product { handle title productType }
          }
        }
      }
    }
  }
`

const HIDDEN_COLLECTIONS = new Set(['frontpage'])

export async function getCollections(): Promise<CollectionSummary[]> {
  if (!isShopifyConfigured()) return []
  const data = await shopifyFetch<{
    collections: {
      nodes: (Omit<CollectionSummary, 'productCount' | 'image'> & {
        products: { nodes: { featuredImage: CollectionSummary['image'] }[] }
      })[]
    }
  }>({
    query: `
      query Collections {
        collections(first: 20, sortKey: ID) {
          nodes {
            id
            handle
            title
            description
            products(first: 50) { nodes { featuredImage { ${IMAGE} } } }
          }
        }
      }
    `,
  })

  return data.collections.nodes
    .filter((c) => !HIDDEN_COLLECTIONS.has(c.handle))
    .map(({ products, ...rest }) => ({
      ...rest,
      productCount: products.nodes.length,
      image: products.nodes[0]?.featuredImage ?? null,
    }))
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest'

const COLLECTION_SORT: Record<SortOption, { sortKey: string; reverse: boolean }> = {
  featured: { sortKey: 'BEST_SELLING', reverse: false },
  'price-asc': { sortKey: 'PRICE', reverse: false },
  'price-desc': { sortKey: 'PRICE', reverse: true },
  newest: { sortKey: 'CREATED', reverse: true },
}

const PRODUCT_SORT: Record<SortOption, { sortKey: string; reverse: boolean }> = {
  featured: { sortKey: 'BEST_SELLING', reverse: false },
  'price-asc': { sortKey: 'PRICE', reverse: false },
  'price-desc': { sortKey: 'PRICE', reverse: true },
  newest: { sortKey: 'CREATED_AT', reverse: true },
}

export async function getProducts(
  sort: SortOption = 'featured',
  first = 50,
): Promise<ProductCardData[]> {
  if (!isShopifyConfigured()) return []
  const { sortKey, reverse } = PRODUCT_SORT[sort]
  const data = await shopifyFetch<{ products: { nodes: ProductCardData[] } }>({
    query: `
      ${PRODUCT_CARD}
      query Products($first: Int!, $sortKey: ProductSortKeys!, $reverse: Boolean!) {
        products(first: $first, sortKey: $sortKey, reverse: $reverse) {
          nodes { ...ProductCard }
        }
      }
    `,
    variables: { first, sortKey, reverse },
  })
  return data.products.nodes
}

export async function getCollection(
  handle: string,
  sort: SortOption = 'featured',
): Promise<Collection | null> {
  if (!isShopifyConfigured()) return null
  const { sortKey, reverse } = COLLECTION_SORT[sort]
  const data = await shopifyFetch<{ collection: Collection | null }>({
    query: `
      ${PRODUCT_CARD}
      query Collection($handle: String!, $sortKey: ProductCollectionSortKeys!, $reverse: Boolean!) {
        collection(handle: $handle) {
          id
          handle
          title
          description
          products(first: 50, sortKey: $sortKey, reverse: $reverse) {
            nodes { ...ProductCard }
          }
        }
      }
    `,
    variables: { handle, sortKey, reverse },
  })
  return data.collection
}

export async function getProduct(handle: string): Promise<Product | null> {
  if (!isShopifyConfigured()) return null
  const data = await shopifyFetch<{ product: Product | null }>({
    query: `
      query Product($handle: String!) {
        product(handle: $handle) {
          id
          handle
          title
          vendor
          productType
          tags
          description
          descriptionHtml
          availableForSale
          featuredImage { ${IMAGE} }
          images(first: 10) { nodes { ${IMAGE} } }
          options { name optionValues { name } }
          priceRange { minVariantPrice { ${MONEY} } }
          variants(first: 50) {
            nodes {
              id
              title
              availableForSale
              price { ${MONEY} }
              compareAtPrice { ${MONEY} }
              selectedOptions { name value }
            }
          }
          collections(first: 1) { nodes { handle title } }
        }
      }
    `,
    variables: { handle },
  })
  return data.product
}

export async function fetchCart(cartId: string): Promise<Cart | null> {
  if (!isShopifyConfigured()) return null
  const data = await shopifyFetch<{ cart: Cart | null }>({
    query: `${CART} query Cart($id: ID!) { cart(id: $id) { ...CartFields } }`,
    variables: { id: cartId },
    cache: 'no-store',
  })
  return data.cart
}

type CartLineInput = { merchandiseId: string; quantity: number }
type CartLineUpdate = { id: string; quantity: number }
type UserError = { field: string[] | null; message: string }

function assertNoUserErrors(errors: UserError[]) {
  if (errors.length > 0) throw new Error(errors[0].message)
}

export async function createCart(lines: CartLineInput[]): Promise<Cart> {
  const data = await shopifyFetch<{
    cartCreate: { cart: Cart; userErrors: UserError[] }
  }>({
    query: `${CART}
      mutation CartCreate($lines: [CartLineInput!]) {
        cartCreate(input: { lines: $lines }) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }`,
    variables: { lines },
    cache: 'no-store',
  })
  assertNoUserErrors(data.cartCreate.userErrors)
  return data.cartCreate.cart
}

export async function addCartLines(cartId: string, lines: CartLineInput[]): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: Cart; userErrors: UserError[] }
  }>({
    query: `${CART}
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }`,
    variables: { cartId, lines },
    cache: 'no-store',
  })
  assertNoUserErrors(data.cartLinesAdd.userErrors)
  return data.cartLinesAdd.cart
}

export async function updateCartLines(cartId: string, lines: CartLineUpdate[]): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: Cart; userErrors: UserError[] }
  }>({
    query: `${CART}
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }`,
    variables: { cartId, lines },
    cache: 'no-store',
  })
  assertNoUserErrors(data.cartLinesUpdate.userErrors)
  return data.cartLinesUpdate.cart
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: Cart; userErrors: UserError[] }
  }>({
    query: `${CART}
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }`,
    variables: { cartId, lineIds },
    cache: 'no-store',
  })
  assertNoUserErrors(data.cartLinesRemove.userErrors)
  return data.cartLinesRemove.cart
}
