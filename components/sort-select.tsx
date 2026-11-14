'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

const OPTIONS = [
  { value: 'featured', label: '추천순' },
  { value: 'newest', label: '최신순' },
  { value: 'price-asc', label: '낮은 가격순' },
  { value: 'price-desc', label: '높은 가격순' },
]

export function SortSelect({ value }: { value: string }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="relative">
      <label htmlFor="sort" className="sr-only">
        정렬
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => {
          const next = e.target.value
          router.push(next === 'featured' ? pathname : `${pathname}?sort=${next}`, { scroll: false })
        }}
        className="h-9 appearance-none rounded-md border border-border bg-card py-1 pl-3 pr-9 text-sm"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  )
}
