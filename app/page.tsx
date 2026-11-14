import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HomeHero } from '@/components/home/hero'
import { CategoryGrid } from '@/components/home/category-grid'
import { ValueProps } from '@/components/home/value-props'
import { ProductGrid } from '@/components/product-card'
import { getCollections, getProducts } from '@/lib/shopify'

export default async function HomePage() {
  const [collections, products] = await Promise.all([getCollections(), getProducts('featured', 8)])

  return (
    <>
      <HomeHero />
      <CategoryGrid collections={collections} />
      <section aria-labelledby="featured-heading" className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs uppercase tracking-widest text-primary">Featured</p>
            <h2 id="featured-heading" className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
              지금 많이 찾는 패널
            </h2>
          </div>
          <Link
            href="/collections/all"
            className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            전체 보기 <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <ProductGrid products={products} />
      </section>
      <ValueProps />
    </>
  )
}
