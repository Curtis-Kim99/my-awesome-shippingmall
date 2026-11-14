import Link from 'next/link'
import { CartButton } from '@/components/cart/cart-button'
import { MobileNav } from '@/components/mobile-nav'
import { NAV_ITEMS } from '@/lib/navigation'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="bg-ink text-ink-foreground">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center text-xs tracking-wide sm:px-6">
          전 제품 1년 품질 보증 · B2B 대량 구매 견적 별도 문의
        </p>
      </div>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <MobileNav />
        <Link href="/" className="flex items-center gap-2" aria-label="PANELX 홈">
          <span className="grid size-6 grid-cols-2 gap-0.5" aria-hidden="true">
            <span className="rounded-[2px] bg-foreground" />
            <span className="rounded-[2px] bg-primary" />
            <span className="rounded-[2px] bg-foreground/30" />
            <span className="rounded-[2px] bg-foreground" />
          </span>
          <span className="font-mono text-lg font-semibold tracking-tight">PANELX</span>
        </Link>
        <nav aria-label="카테고리" className="hidden flex-1 md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <CartButton />
        </div>
      </div>
    </header>
  )
}
