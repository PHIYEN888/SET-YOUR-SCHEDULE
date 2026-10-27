import { Globe, House, Maximize, Minimize, RotateCcw, Star, Trophy, Volume2, VolumeX } from 'lucide-react'
import type { ReactNode } from 'react'
import { MAX_SCORE } from '../game/logic'
import type { Lang } from '../game/i18n'
import { translations } from '../game/i18n'
import type { Phase } from '../game/types'
import { CountdownTimer } from './CountdownTimer'
import { GameProgress } from './GameProgress'

interface AppHeaderProps {
  phase: Phase
  playing: boolean
  score: number
  remainingMs: number
  soundOn: boolean
  isFullscreen: boolean
  lang: Lang
  onToggleSound: () => void
  onToggleFullscreen: () => void
  onToggleLanguage: () => void
  onOpenLeaderboard: () => void
  onRestart: () => void
  onHome: () => void
}

export function PillMateLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <img
        src="/images/logo.png"
        alt="PillMate Logo"
        className="h-10 w-auto object-contain transition-transform duration-200 hover:scale-105 sm:h-12"
      />
    </span>
  )
}

function IconButton({
  label,
  onClick,
  children,
  pressed,
  className = '',
}: {
  label: string
  onClick: () => void
  children: ReactNode
  pressed?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      title={label}
      className={`flex size-11 items-center justify-center rounded-xl bg-white text-navy ring-2 ring-brand/15 transition hover:bg-brand-light hover:ring-brand/40 focus-visible:ring-4 focus-visible:ring-brand/40 focus-visible:outline-none sm:size-12 ${className}`}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  )
}

export function AppHeader(props: AppHeaderProps) {
  const { phase, playing, score, remainingMs, soundOn, isFullscreen, lang } = props
  const showStatus = playing || phase === 'result'
  const t = translations[lang]

  return (
    <header className="sticky top-0 z-30 border-b border-brand/10 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:gap-6">
        <button
          type="button"
          onClick={props.onHome}
          className="rounded-xl focus-visible:ring-4 focus-visible:ring-brand/40 focus-visible:outline-none"
          aria-label={t.home}
        >
          <PillMateLogo />
        </button>

        {showStatus && (
          <div className="order-last flex w-full flex-col-reverse gap-3 sm:flex-row sm:items-center lg:order-none lg:flex-1 lg:gap-5">
            <div className="flex-1">
              <GameProgress phase={phase} lang={lang} />
            </div>
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <div className="flex items-center gap-1.5 rounded-2xl bg-brand-light px-3 py-2 text-brand" aria-label={`${t.score} ${score} ${t.of} ${MAX_SCORE}`}>
                <Star className="size-5 fill-current" aria-hidden="true" />
                <span className="text-xl font-extrabold tabular-nums sm:text-2xl">{score}</span>
                <span className="text-sm font-bold text-brand/60">/ {MAX_SCORE}</span>
              </div>
              {playing && <CountdownTimer remainingMs={remainingMs} />}
            </div>
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          {/* Language toggle button */}
          <button
            type="button"
            onClick={props.onToggleLanguage}
            title={t.switchLanguageTooltip}
            className="flex h-11 items-center gap-1.5 rounded-xl bg-white px-3 font-extrabold text-navy ring-2 ring-brand/15 transition hover:bg-brand-light hover:ring-brand/40 sm:h-12"
          >
            <Globe className="size-4 text-brand" />
            <span className="text-xs uppercase">{t.languageBadge}</span>
          </button>

          {/* Leaderboard button */}
          <IconButton label={t.leaderboard} onClick={props.onOpenLeaderboard}>
            <Trophy className="size-5 text-amber-500" aria-hidden="true" />
          </IconButton>

          {/* Sound toggle */}
          <IconButton label={soundOn ? t.mute : t.unmute} onClick={props.onToggleSound} pressed={!soundOn}>
            {soundOn ? <Volume2 className="size-5" aria-hidden="true" /> : <VolumeX className="size-5" aria-hidden="true" />}
          </IconButton>

          <span className="hidden sm:contents">
            <IconButton label={isFullscreen ? t.exitFullscreen : t.fullscreen} onClick={props.onToggleFullscreen}>
              {isFullscreen ? <Minimize className="size-5" aria-hidden="true" /> : <Maximize className="size-5" aria-hidden="true" />}
            </IconButton>
          </span>

          {playing && (
            <IconButton label={t.restart} onClick={props.onRestart}>
              <RotateCcw className="size-5" aria-hidden="true" />
            </IconButton>
          )}

          {phase !== 'welcome' && (
            <IconButton label={t.home} onClick={props.onHome}>
              <House className="size-5" aria-hidden="true" />
            </IconButton>
          )}
        </div>
      </div>
    </header>
  )
}
