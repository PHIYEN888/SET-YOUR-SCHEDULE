import { BellRing, CalendarClock, Layers } from 'lucide-react'
import type { Lang } from '../game/i18n'
import { translations } from '../game/i18n'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'

interface HowToPlayModalProps {
  open: boolean
  lang: Lang
  onClose: () => void
  onStart: () => void
}

export function HowToPlayModal({ open, lang, onClose, onStart }: HowToPlayModalProps) {
  const t = translations[lang]

  const steps = [
    { icon: Layers, title: t.howToStep1Title, text: t.howToStep1Desc },
    { icon: CalendarClock, title: t.howToStep2Title, text: t.howToStep2Desc },
    { icon: BellRing, title: t.howToStep3Title, text: t.howToStep3Desc },
  ]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.howToPlayTitle}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t.btnGotIt}
          </Button>
          <Button onClick={onStart}>{t.btnStart}</Button>
        </>
      }
    >
      <ol className="grid gap-3">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="flex items-start gap-4 rounded-2xl bg-brand-light/60 p-4">
            <span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white">
              <Icon className="size-6" aria-hidden="true" />
              <span className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full bg-navy text-xs font-extrabold text-white">
                {i + 1}
              </span>
            </span>
            <div>
              <h3 className="text-lg font-extrabold">{title}</h3>
              <p className="mt-0.5 leading-relaxed text-navy/70">{text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm leading-relaxed text-navy/60">
        {t.howToFooter}
      </p>
    </Modal>
  )
}
