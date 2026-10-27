import { BellRing, CalendarCheck, HeartHandshake, Lightbulb } from 'lucide-react'
import type { Lang } from '../locales'
import { translations } from '../locales'
import { Modal } from './ui/Modal'

export function LearnMoreModal({ open, lang, onClose }: { open: boolean; lang: Lang; onClose: () => void }) {
  const t = translations[lang]

  const features = [
    { icon: CalendarCheck, title: t.feature1Title, text: t.feature1Desc },
    { icon: BellRing, title: t.feature2Title, text: t.feature2Desc },
    { icon: Lightbulb, title: t.feature3Title, text: t.feature3Desc },
    { icon: HeartHandshake, title: t.feature4Title, text: t.feature4Desc },
  ]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.meetTitle}
      size="lg"
    >
      <p className="text-lg text-pretty text-navy/70">
        {t.meetIntro}
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {features.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-3 rounded-2xl bg-brand-light/60 p-4">
            <Icon className="mt-0.5 size-6 shrink-0 text-brand" aria-hidden="true" />
            <div>
              <p className="font-extrabold">{title}</p>
              <p className="text-sm text-navy/70">{text}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm font-semibold text-navy/50">
        {t.meetFooter}
      </p>
    </Modal>
  )
}
