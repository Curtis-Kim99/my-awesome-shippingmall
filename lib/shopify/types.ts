export type Money = { amount: string; currencyCode: string }

export type ShopifyImage = {
  url: string
  altText: string | null
  width: number | null
  height: number | null
}

export type ProductCardData = {
  id: string
  handle: string
  title: string
  productType: string
  tags: string[]
  availableForSale: boolean
  featuredImage: ShopifyImage | null
  priceRange: { minVariantPrice: Money }
  compareAtPriceRange: { maxVariantPrice: Money }
}

export type ProductVariant = {
  id: string
  title: string
  availableForSale: boolean
  price: Money
  compareAtPrice: Money | null
  selectedOptions: { name: string; value: string }[]
}

export type Product = {
  id: string
  handle: string
  title: string
  vendor: string
  productType: string
  tags: string[]
  description: string
  descriptionHtml: string
  availableForSale: boolean
  featuredImage: ShopifyImage | null
  images: { nodes: ShopifyImage[] }
  options: { name: string; optionValues: { name: string }[] }[]
  priceRange: { minVariantPrice: Money }
  variants: { nodes: ProductVariant[] }
  collections: { nodes: { handle: string; title: string }[] }
}

export type CollectionSummary = {
  id: string
  handle: string
  title: string
  description: string
  productCount: number
  image: ShopifyImage | null
}

export type Collection = {
  id: string
  handle: string
  title: string
  description: string
  products: { nodes: ProductCardData[] }
}

export type CartLine = {
  id: string
  quantity: number
  cost: { totalAmount: Money }
  merchandise: {
    id: string
    title: string
    price: Money
    image: ShopifyImage | null
    product: { handle: string; title: string; productType: string }
  }
}

export type Cart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: { subtotalAmount: Money; totalAmount: Money }
  lines: { nodes: CartLine[] }
}
