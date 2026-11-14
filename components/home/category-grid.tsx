import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { CollectionSummary } from '@/lib/shopify/types'

export function CategoryGrid({ collections }: { collections: CollectionSummary[] }) {
  return (
    <section id="categories" aria-labelledby="categories-heading" className="mx-auto max-w-7xl scroll-mt-28 px-4 pt-20 sm:px-6">
      <div className="mb-10 flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Categories</p>
        <h2 id="categories-heading" className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
          용도별 디스플레이
        </h2>
      </div>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {collections.map((collection, i) => (
          <li key={collection.id} className={i === 0 ? 'col-span-2 md:col-span-1' : undefined}>
            <Link
              href={`/collections/${collection.handle}`}
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-foreground/30"
            >
              <div className="relative aspect-[4/3] bg-muted">
                {collection.image && (
                  <Image
                    src={collection.image.url}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <ArrowUpRight
                    className="size-4 text-muted-foreground transition-colors group-hover:text-primary"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-medium">{collection.title}</h3>
                <p className="text-xs text-muted-foreground">{collection.productCount}개 제품</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
