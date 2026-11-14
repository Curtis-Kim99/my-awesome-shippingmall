'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { NAV_ITEMS } from '@/lib/navigation'

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="-ml-2 rounded-md p-2 hover:bg-muted md:hidden"
        aria-label="메뉴 열기"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="bg-background">
        <SheetHeader>
          <SheetTitle className="font-mono">PANELX</SheetTitle>
        </SheetHeader>
        <nav aria-label="모바일 카테고리" className="px-4">
          <ul className="flex flex-col divide-y divide-border border-y border-border">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
