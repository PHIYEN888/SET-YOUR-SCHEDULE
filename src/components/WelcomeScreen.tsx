import { CircleHelp, Clock, Gift, MousePointerClick, Play, Trophy, Zap } from 'lucide-react'
import type { ReactNode } from 'react'
import { formatDuration, MAX_SCORE } from '../game/logic'
import type { Lang } from '../game/i18n'
import { translations } from '../game/i18n'
import type { GameStats } from '../game/storage'
import { Mascot } from './Mascot'
import { Button } from './ui/Button'

interface WelcomeScreenProps {
  stats: GameStats
  lang: Lang
  onStart: () => void
  onHowToPlay: () => void
  onLeaderboard: () => void
  onResetStats: () => void
}

export function WelcomeScreen({ stats, lang, onStart, onHowToPlay, onLeaderboard, onResetStats }: WelcomeScreenProps) {
  const t = translations[lang]

  const BADGES = [
    { icon: Clock, label: t.badgeTime },
    { icon: MousePointerClick, label: t.badgeInteractive },
    { icon: Gift, label: t.badgeGift },
  ]

  return (
    <section className="mx-auto grid w-full max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 md:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
      <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
        <p className="inline-flex items-center gap-2 rounded-full bg-brand-light px-4 py-1.5 text-sm font-bold text-brand animate-fade-up">
          <span className="size-2 rounded-full bg-success" aria-hidden="true" />
          {t.tagline}
        </p>

        <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold tracking-tight text-balance text-navy animate-fade-up sm:text-5xl xl:text-6xl">
          {t.heroTitlePrefix}<span className="text-brand">MATE</span>
          <span className="text-navy/30"> — </span>
          <span className="block">{t.heroTitleSuffix}</span>
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-navy/70 animate-fade-up [animation-delay:80ms] sm:text-xl">
          {t.heroSub}
        </p>

        <ul className="mt-6 flex flex-wrap justify-center gap-2.5 animate-fade-up [animation-delay:140ms] lg:justify-start">
          {BADGES.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-navy shadow-soft ring-1 ring-brand/10 sm:text-base">
              <Icon className="size-5 text-brand" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex w-full flex-col gap-3 animate-fade-up [animation-delay:200ms] sm:w-auto sm:flex-row sm:flex-wrap">
          <Button size="xl" onClick={onStart} icon={<Play className="size-6 fill-current" aria-hidden="true" />} autoFocus>
            {t.btnStart}
          </Button>
          <Button size="xl" variant="secondary" onClick={onHowToPlay} icon={<CircleHelp className="size-6" aria-hidden="true" />}>
            {t.btnHowToPlay}
          </Button>
          <Button size="xl" variant="ghost" onClick={onLeaderboard} icon={<Trophy className="size-6 text-amber-500" aria-hidden="true" />}>
            {t.btnLeaderboard}
          </Button>
        </div>

        <dl className="mt-8 grid w-full max-w-xl grid-cols-3 gap-3 animate-fade-up [animation-delay:260ms]">
          <Stat icon={<Trophy className="size-5" aria-hidden="true" />} label={t.bestScore} value={`${stats.bestScore}/${MAX_SCORE}`} />
          <Stat
            icon={<Zap className="size-5" aria-hidden="true" />}
            label={t.fastest}
            value={stats.fastestMs === null ? '--:--' : formatDuration(stats.fastestMs)}
          />
          <Stat
            icon={<Gift className="size-5" aria-hidden="true" />}
            label={t.completedStats}
            value={`${stats.gamesCompleted}/${stats.gamesPlayed}`}
          />
        </dl>
        {stats.gamesPlayed > 0 && (
          <button
            type="button"
            onClick={onResetStats}
            className="mt-3 rounded-lg px-2 py-1 text-xs font-semibold text-navy/40 underline-offset-4 hover:text-navy/70 hover:underline focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
          >
            {t.staffResetStats}
          </button>
        )}
      </div>

      <div className="relative order-1 mx-auto w-full max-w-sm sm:max-w-md lg:order-2 lg:max-w-none">
        <div className="absolute inset-[8%] rounded-full bg-brand-light" aria-hidden="true" />
        <div className="absolute inset-[22%] rounded-full bg-white/70 blur-2xl" aria-hidden="true" />
        <Mascot className="relative mx-auto w-full" />
        <div className="absolute right-0 bottom-[6%] w-[46%] rounded-3xl bg-white p-2 shadow-card ring-1 ring-brand/10 animate-pop [animation-delay:300ms]">
          <img src="/images/pillbox.png" alt="PillMate smart pill box with seven day compartments" className="w-full rounded-2xl" />
        </div>
      </div>
    </section>
  )
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/80 px-3 py-3 text-center shadow-soft ring-1 ring-brand/10 lg:text-left">
      <dt className="flex items-center justify-center gap-1.5 text-xs font-bold tracking-wide text-navy/50 uppercase lg:justify-start">
        <span className="text-brand">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 text-xl font-extrabold text-navy tabular-nums sm:text-2xl">{value}</dd>
    </div>
  )
}
