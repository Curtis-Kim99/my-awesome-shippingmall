import Link from 'next/link'
import { NAV_ITEMS } from '@/lib/navigation'

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-lg font-semibold">PANELX</p>
          <p className="max-w-sm text-sm leading-relaxed text-ink-foreground/60">
            모바일부터 차량용까지, 검증된 A급 디스플레이 패널을 공급합니다. 수리점, 제조사, 연구소를 위한
            패널 전문 쇼핑몰.
          </p>
        </div>
        <nav aria-label="푸터 카테고리">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-foreground/50">Shop</p>
          <ul className="flex flex-col gap-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-foreground/80 hover:text-ink-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-foreground/50">Support</p>
          <ul className="flex flex-col gap-2 text-sm text-ink-foreground/80">
            <li>평일 09:00 – 18:00</li>
            <li>기술 지원 · 호환성 문의</li>
            <li>B2B 대량 구매 견적</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10">
        <p className="mx-auto max-w-7xl px-4 py-6 font-mono text-xs text-ink-foreground/50 sm:px-6">
          © 2026 PANELX. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
