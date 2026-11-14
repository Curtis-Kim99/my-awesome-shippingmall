import { BadgeCheck, Cpu, Headset } from 'lucide-react'

const ITEMS = [
  {
    icon: BadgeCheck,
    title: 'A급 정품 패널',
    body: '출고 전 전수 점등 검사로 데드픽셀, 휘도 불균일을 확인한 패널만 발송합니다.',
  },
  {
    icon: Cpu,
    title: '호환성 검증',
    body: '인터페이스, 커넥터 핀 배열, 해상도 사양을 상세히 공개해 정확한 호환 여부를 판단할 수 있습니다.',
  },
  {
    icon: Headset,
    title: '엔지니어 기술 지원',
    body: '드라이버 보드 설정, EDID, 타이밍 값 등 설치에 필요한 기술 문의에 엔지니어가 직접 답변합니다.',
  },
]

export function ValueProps() {
  return (
    <section aria-labelledby="value-heading" className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
      <h2 id="value-heading" className="sr-only">
        PANELX를 선택하는 이유
      </h2>
      <ul className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
        {ITEMS.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex flex-col gap-3 bg-card p-6 sm:p-8">
            <Icon className="size-5 text-primary" aria-hidden="true" />
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
