import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductGrid } from '@/components/product-card'
import { SortSelect } from '@/components/sort-select'
import { getCollection, getProducts, type SortOption } from '@/lib/shopify'
import { NAV_ITEMS } from '@/lib/navigation'

const SORT_VALUES: SortOption[] = ['featured', 'price-asc', 'price-desc', 'newest']

function parseSort(value: string | string[] | undefined): SortOption {
  return SORT_VALUES.includes(value as SortOption) ? (value as SortOption) : 'featured'
}

type Props = {
  params: Promise<{ handle: string }>
  searchParams: Promise<{ sort?: string | string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  if (handle === 'all') return { title: '전체 제품' }
  const collection = await getCollection(handle)
  return collection
    ? { title: collection.title, description: collection.description }
    : { title: '카테고리를 찾을 수 없습니다' }
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const [{ handle }, { sort: rawSort }] = await Promise.all([params, searchParams])
  const sort = parseSort(rawSort)

  let title = '전체 제품'
  let description = '모바일부터 차량용까지 모든 디스플레이 패널'
  let products

  if (handle === 'all') {
    products = await getProducts(sort)
  } else {
    const collection = await getCollection(handle, sort)
    if (!collection) notFound()
    title = collection.title
    description = collection.description
    products = collection.products.nodes
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex flex-col gap-3 border-b border-border py-10 sm:py-14">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Collection</p>
        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h1>
        {description && <p className="text-muted-foreground text-pretty">{description}</p>}
      </div>

      <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="카테고리 필터" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <ul className="flex gap-2">
            {NAV_ITEMS.map((item) => {
              const active = item.href === `/collections/${handle}`
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={
                      active
                        ? 'block whitespace-nowrap rounded-full bg-foreground px-4 py-1.5 text-sm text-background'
                        : 'block whitespace-nowrap rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground hover:border-foreground/40 hover:text-foreground'
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <p className="font-mono text-xs text-muted-foreground tabular-nums">{products.length} items</p>
          <SortSelect value={sort} />
        </div>
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p className="py-20 text-center text-muted-foreground">이 카테고리에 등록된 제품이 없습니다.</p>
      )}
    </div>
  )
}
