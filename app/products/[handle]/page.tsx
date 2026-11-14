import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, ShieldCheck, Truck, Wrench } from 'lucide-react'
import { AddToCart } from '@/components/product/add-to-cart'
import { ProductGrid } from '@/components/product-card'
import { getCollection, getProduct } from '@/lib/shopify'

type Props = { params: Promise<{ handle: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) return { title: '제품을 찾을 수 없습니다' }
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: product.featuredImage ? { images: [product.featuredImage.url] } : undefined,
  }
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) notFound()

  const category = product.collections.nodes[0]
  const related = category
    ? (await getCollection(category.handle))?.products.nodes.filter((p) => p.id !== product.id) ?? []
    : []
  const image = product.featuredImage ?? product.images.nodes[0]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <nav aria-label="경로" className="py-5">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground">
              홈
            </Link>
          </li>
          {category && (
            <>
              <ChevronRight className="size-3" aria-hidden="true" />
              <li>
                <Link href={`/collections/${category.handle}`} className="hover:text-foreground">
                  {category.title}
                </Link>
              </li>
            </>
          )}
          <ChevronRight className="size-3" aria-hidden="true" />
          <li aria-current="page" className="text-foreground">
            {product.title}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            {image && (
              <Image
                src={image.url}
                alt={image.altText ?? product.title}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-widest text-primary">
              {product.vendor} · {product.productType}
            </p>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl">
              {product.title}
            </h1>
            <ul className="flex flex-wrap gap-1.5" aria-label="주요 사양">
              {product.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-sm border border-border px-2 py-0.5 font-mono text-[11px] uppercase text-muted-foreground"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <AddToCart product={product} />

          <ul className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border text-center">
            {[
              { icon: ShieldCheck, label: '1년 품질 보증' },
              { icon: Truck, label: '당일 출고' },
              { icon: Wrench, label: '기술 지원' },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex flex-col items-center gap-2 bg-card px-2 py-4">
                <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-xs">{label}</span>
              </li>
            ))}
          </ul>

          <section aria-labelledby="spec-heading" className="flex flex-col gap-4">
            <h2 id="spec-heading" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Overview &amp; Specifications
            </h2>
            <div className="spec-content" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="pt-24">
          <h2 id="related-heading" className="mb-8 text-2xl font-bold tracking-tight">
            같은 카테고리 제품
          </h2>
          <ProductGrid products={related.slice(0, 4)} />
        </section>
      )}
    </div>
  )
}
