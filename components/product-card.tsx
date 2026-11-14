import Image from 'next/image'
import Link from 'next/link'
import { formatMoney, hasDiscount } from '@/lib/format'
import type { ProductCardData } from '@/lib/shopify/types'

export function ProductCard({ product, priority }: { product: ProductCardData; priority?: boolean }) {
  const price = product.priceRange.minVariantPrice
  const compareAt = product.compareAtPriceRange.maxVariantPrice
  const onSale = hasDiscount(price, compareAt)

  return (
    <Link href={`/products/${product.handle}`} className="group flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        {product.featuredImage && (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          {onSale && (
            <span className="rounded-sm bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground">
              SALE
            </span>
          )}
          {!product.availableForSale && (
            <span className="rounded-sm bg-foreground px-2 py-0.5 text-[11px] font-medium text-background">
              품절
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {product.tags.slice(0, 3).join(' · ')}
        </p>
        <h3 className="text-sm font-medium leading-snug text-pretty group-hover:underline group-hover:underline-offset-4">
          {product.title}
        </h3>
        <p className="flex items-baseline gap-2 font-mono text-sm tabular-nums">
          <span className="font-semibold">{formatMoney(price)}~</span>
          {onSale && (
            <span className="text-xs text-muted-foreground line-through">{formatMoney(compareAt)}</span>
          )}
        </p>
      </div>
    </Link>
  )
}

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard product={product} priority={i < 4} />
        </li>
      ))}
    </ul>
  )
}
