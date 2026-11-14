import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

const SPECS = [
  { label: 'Categories', value: '5' },
  { label: 'Technologies', value: 'OLED · LCD · Mini LED · QLED' },
  { label: 'Size range', value: '6.1" – 65"' },
  { label: 'Warranty', value: '12 months' },
]

export function HomeHero() {
  return (
    <section aria-labelledby="hero-heading" className="border-b border-border">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[5fr_7fr] lg:py-20">
        <div className="flex flex-col gap-6">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Display Panel Store</p>
          <h1
            id="hero-heading"
            className="text-4xl font-bold leading-[1.15] tracking-tight text-balance sm:text-5xl"
          >
            모든 화면의 시작,
            <br />
            패널에서.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
            스마트폰 6인치부터 65인치 TV, 차량용 클러스터까지. 수리와 제조, 개발에 필요한 디스플레이 패널을
            사양별로 비교하고 바로 구매하세요.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/collections/all" className={buttonVariants({ size: 'lg', className: 'h-11 px-5' })}>
              전체 제품 보기
            </Link>
            <Link
              href="#categories"
              className={buttonVariants({ variant: 'outline', size: 'lg', className: 'h-11 px-5' })}
            >
              카테고리 탐색
            </Link>
          </div>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
          <Image
            src="/images/hero.png"
            alt="스마트폰, 노트북, 모니터, TV, 차량용 디스플레이 패널 라인업"
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
      <dl className="mx-auto grid max-w-7xl grid-cols-2 border-t border-border sm:px-6 lg:grid-cols-4">
        {SPECS.map((spec) => (
          <div key={spec.label} className="flex flex-col gap-1 border-border px-4 py-5 odd:border-r lg:border-r lg:last:border-r-0">
            <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{spec.label}</dt>
            <dd className="text-sm font-medium">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
