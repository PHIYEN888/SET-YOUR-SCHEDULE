import { Check } from 'lucide-react'
import type { Lang } from '../locales'
import { translations } from '../locales'
import type { Phase } from '../game/types'

const PHASES: Exclude<Phase, 'welcome'>[] = ['draw', 'setup', 'match', 'test', 'result']

export function GameProgress({ phase, lang = 'en' }: { phase: Phase; lang?: Lang }) {
  const t = translations[lang]
  const current = PHASES.indexOf(phase as Exclude<Phase, 'welcome'>)

  return (
    <nav aria-label="Game progress" className="w-full">
      <ol className="flex items-center">
        {PHASES.map((p, i) => {
          const done = i < current
          const active = i === current
          const label = t.progressSteps[p]
          return (
            <li key={p} className="flex flex-1 items-center last:flex-none" aria-current={active ? 'step' : undefined}>
              <div className="flex flex-col items-center gap-1">
                <span
                  className={`flex size-8 items-center justify-center rounded-full text-sm font-extrabold transition-all duration-300 sm:size-9 ${
                    done
                      ? 'bg-success text-white'
                      : active
                        ? 'bg-brand text-white shadow-glow'
                        : 'bg-white text-navy/40 ring-2 ring-brand/15'
                  }`}
                >
                  {done ? <Check className="size-4" strokeWidth={3} aria-hidden="true" /> : i + 1}
                </span>
                <span className={`text-[11px] font-bold sm:text-xs ${active ? 'text-brand' : done ? 'text-success' : 'text-navy/40'}`}>
                  {label}
                  {done && <span className="sr-only"> (completed)</span>}
                </span>
              </div>
              {i < PHASES.length - 1 && (
                <span className="mx-1 mb-5 h-1 flex-1 overflow-hidden rounded-full bg-brand/10 sm:mx-2" aria-hidden="true">
                  <span className={`block h-full rounded-full bg-success transition-all duration-500 ${done ? 'w-full' : 'w-0'}`} />
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
