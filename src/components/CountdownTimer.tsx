import { Timer } from 'lucide-react'
import { formatDuration, TIME_LIMIT_MS } from '../game/logic'

export function CountdownTimer({ remainingMs }: { remainingMs: number }) {
  const urgent = remainingMs <= 30_000
  const warning = remainingMs <= 60_000
  const pct = Math.max(0, Math.min(100, (remainingMs / TIME_LIMIT_MS) * 100))
  const label = formatDuration(remainingMs)

  return (
    <div
      className={`relative flex items-center gap-2 overflow-hidden rounded-2xl px-3 py-2 ring-2 transition-colors sm:px-4 ${
        urgent ? 'bg-danger-light text-danger ring-danger/40' : warning ? 'bg-amber-50 text-amber-700 ring-amber-300/60' : 'bg-white text-navy ring-brand/15'
      }`}
      role="timer"
      aria-label={`Time remaining ${label}`}
    >
      <Timer className={`size-5 ${urgent ? 'animate-wiggle' : ''}`} aria-hidden="true" />
      <span className="text-xl font-extrabold tabular-nums sm:text-2xl">{label}</span>
      <span className="absolute inset-x-0 bottom-0 h-1 bg-current/10" aria-hidden="true">
        <span className="block h-full bg-current transition-[width] duration-300 ease-linear" style={{ width: `${pct}%` }} />
      </span>
    </div>
  )
}
