import { ArrowRight, Hand, RotateCcw, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Lang } from '../locales'
import { translations } from '../locales'
import type { Challenge } from '../game/types'
import { ChallengeCard } from './ChallengeCard'
import { Button } from './ui/Button'

interface ChallengeCardDeckProps {
  challenge: Challenge | null
  lang: Lang
  onDraw: (index?: number) => void
  onRedraw: () => void
  onAccept: () => void
}

function CardBack({ label, index }: { label: string; index?: number }) {
  return (
    <div className="deck-pattern flex size-full flex-col items-center justify-center gap-3.5 rounded-3xl p-5 text-white shadow-card">
      <div className="flex items-center justify-center rounded-2xl bg-white/95 px-4 py-2.5 shadow-sm">
        <img src="/images/logo.png" alt="PillMate" className="h-12 w-auto object-contain" />
      </div>
      {typeof index === 'number' && (
        <span className="flex size-7 items-center justify-center rounded-full bg-white/25 text-xs font-black">
          #{index + 1}
        </span>
      )}
      <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-[0.2em] uppercase">
        {label}
      </span>
    </div>
  )
}

export function ChallengeCardDeck({ challenge, lang, onDraw, onRedraw, onAccept }: ChallengeCardDeckProps) {
  const [flipped, setFlipped] = useState(Boolean(challenge))
  const [showDetails, setShowDetails] = useState(Boolean(challenge))
  const t = translations[lang]

  useEffect(() => {
    if (!challenge) {
      setFlipped(false)
      setShowDetails(false)
      return
    }
    const flip = window.setTimeout(() => setFlipped(true), 50)
    const reveal = window.setTimeout(() => setShowDetails(true), 450)
    return () => {
      window.clearTimeout(flip)
      window.clearTimeout(reveal)
    }
  }, [challenge])

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-4 text-center sm:px-6 md:py-8">
      <header className="mb-4">
        <p className="text-xs font-bold tracking-[0.2em] text-brand uppercase sm:text-sm">
          {t.drawStepBadge}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-5xl">{t.drawTitle}</h1>
        <p className="mt-2 text-base text-navy/70 sm:text-lg" aria-live="polite">
          {challenge ? t.drawDescActive : t.drawDescIdle}
        </p>
      </header>

      {!challenge ? (
        /* Mystery 3-card spread when not yet drawn */
        <div className="mt-6 flex w-full flex-col items-center">
          <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((idx) => {
              const rotation = idx === 0 ? '-rotate-2' : idx === 2 ? 'rotate-2' : 'rotate-0'
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onDraw(idx)}
                  className={`group relative flex h-72 cursor-pointer flex-col items-center justify-center rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] focus-visible:ring-4 focus-visible:ring-brand/40 sm:h-80 ${rotation}`}
                  aria-label={t.drawCardAria(idx)}
                >
                  <CardBack label={t.cardChallengeLabel} index={idx} />
                  <span className="absolute bottom-5 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-black text-brand shadow-soft transition group-hover:bg-brand group-hover:text-white">
                    <Hand className="size-4 animate-wiggle" aria-hidden="true" />
                    {t.tapToDraw}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="mt-4 text-xs font-semibold text-navy/40">
            {t.mysteryCardHint}
          </p>
        </div>
      ) : (
        /* Revealed single card */
        <div className="mt-4 flex w-full max-w-md flex-col items-center">
          <div className="flip-scene relative w-full">
            <div className="flip-card relative grid min-h-[26rem] rounded-3xl shadow-card" data-flipped={flipped}>
              {/* Back side of card (hidden after flip) */}
              <div
                className={`flip-face col-start-1 row-start-1 rounded-3xl transition-opacity ${
                  flipped ? 'pointer-events-none opacity-0' : 'opacity-100'
                }`}
              >
                <CardBack label={t.cardChallengeLabel} />
              </div>

              {/* Front side showing challenge details */}
              <div
                className={`flip-face flip-back col-start-1 row-start-1 rounded-3xl ring-1 ring-brand/10 text-left transition-all duration-200 ${
                  showDetails ? 'cursor-pointer hover:ring-2 hover:ring-brand/40' : ''
                }`}
                onClick={showDetails ? onAccept : undefined}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (showDetails && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    onAccept()
                  }
                }}
                aria-label={t.btnLetsDoIt}
              >
                <ChallengeCard challenge={challenge} lang={lang} />
              </div>
            </div>
          </div>

          {/* Action buttons directly below card */}
          {showDetails && (
            <div className="mt-6 flex w-full flex-col gap-2.5 animate-pop">
              <Button
                size="xl"
                onClick={onAccept}
                className="w-full shadow-lg"
                iconRight={<ArrowRight className="size-6" aria-hidden="true" />}
                autoFocus
              >
                {t.btnLetsDoIt}
              </Button>

              <div className="flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={onRedraw}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-navy/60 transition hover:bg-brand-light hover:text-brand"
                >
                  <RotateCcw className="size-3.5" />
                  {t.btnRedraw}
                </button>
                <span className="flex items-center gap-1 text-xs font-semibold text-navy/40">
                  <Sparkles className="size-3 text-brand" />
                  {t.tapCardToContinue}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
