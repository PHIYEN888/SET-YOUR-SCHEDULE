import { Award, Check, CircleCheck, CircleDashed, Clock, Gift, Home, RotateCcw, Send, Sparkles, Timer, Trophy, Zap } from 'lucide-react'
import { useState } from 'react'
import { formatDuration, MAX_SCORE, STAGE_POINTS } from '../game/logic'
import type { Lang } from '../locales'
import { translations } from '../locales'
import type { Challenge, Outcome, Stage } from '../game/types'
import { Confetti } from './Confetti'
import { Mascot } from './Mascot'
import { Button } from './ui/Button'

interface ResultScreenProps {
  outcome: Outcome
  score: number
  completed: Record<Stage, boolean>
  durationMs: number
  failedAttempts: number
  challenge: Challenge | null
  isNewBest: boolean
  isFastest: boolean
  lang: Lang
  onPlayAgain: () => void
  onHome: () => void
  onSaveLeaderboard: (name: string) => void
}

type AchievementKey = 'flawless' | 'speed' | 'precision' | 'pro'

const ACHIEVEMENT_ICONS = {
  flawless: Sparkles,
  speed: Zap,
  precision: Award,
  pro: Trophy,
}

function getAchievementKey(durationMs: number, failedAttempts: number): AchievementKey {
  if (failedAttempts === 0 && durationMs <= 120_000) return 'flawless'
  if (durationMs <= 120_000) return 'speed'
  if (failedAttempts === 0) return 'precision'
  return 'pro'
}

export function ResultScreen(props: ResultScreenProps) {
  const {
    outcome,
    score,
    completed,
    durationMs,
    failedAttempts,
    challenge,
    isNewBest,
    isFastest,
    lang,
    onPlayAgain,
    onHome,
    onSaveLeaderboard,
  } = props

  const [playerName, setPlayerName] = useState('')
  const [savedToBoard, setSavedToBoard] = useState(false)
  const t = translations[lang]

  const success = outcome === 'completed'
  const achievementKey = getAchievementKey(durationMs, failedAttempts)
  const achievement = t.achievements[achievementKey]
  const AchievementIcon = ACHIEVEMENT_ICONS[achievementKey]
  const localizedChallenge = challenge ? t.challenges[challenge.id] : null
  const challengeTitle = localizedChallenge?.title ?? challenge?.title ?? ''

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault()
    if (!playerName.trim() || savedToBoard) return
    onSaveLeaderboard(playerName.trim())
    setSavedToBoard(true)
  }

  return (
    <section className="relative mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 md:py-12">
      {success && <Confetti />}

      <div className="grid items-center gap-6 text-center md:grid-cols-[0.8fr_1.2fr] md:text-left">
        <div className="mx-auto w-48 sm:w-64 md:w-full">
          {success ? (
            <Mascot variant="celebrate" />
          ) : (
            <div className="relative">
              <Mascot variant="wave" className="opacity-90 grayscale-[35%]" />
              <span className="absolute top-4 right-2 flex size-16 items-center justify-center rounded-full bg-white text-danger shadow-card ring-1 ring-danger/20">
                <Timer className="size-8" aria-hidden="true" />
              </span>
            </div>
          )}
        </div>

        <div className="animate-fade-up">
          <p className={`text-sm font-bold tracking-[0.2em] uppercase ${success ? 'text-success' : 'text-danger'}`}>
            {success ? t.resultSuccessBadge : t.resultTimeoutBadge}
          </p>
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">
            {success ? t.resultSuccessTitle : t.resultTimeoutTitle}
          </h1>
          <p className="mt-3 text-lg text-pretty text-navy/70 sm:text-xl">
            {success ? t.resultSuccessDesc : t.resultTimeoutDesc}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-brand/10">
              <dt className="flex items-center justify-center gap-1.5 text-xs font-bold tracking-wide text-navy/50 uppercase md:justify-start">
                <Trophy className="size-4 text-brand" aria-hidden="true" />
                {t.finalScore}
              </dt>
              <dd className="mt-1 text-3xl font-extrabold tabular-nums sm:text-4xl">
                {score}
                <span className="text-lg text-navy/40">/{MAX_SCORE}</span>
              </dd>
              {isNewBest && (
                <span className="mt-1 inline-block rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-white">
                  {t.newBestBadge}
                </span>
              )}
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-brand/10">
              <dt className="flex items-center justify-center gap-1.5 text-xs font-bold tracking-wide text-navy/50 uppercase md:justify-start">
                <Clock className="size-4 text-brand" aria-hidden="true" />
                {success ? t.completionTime : t.timePlayed}
              </dt>
              <dd className="mt-1 text-3xl font-extrabold tabular-nums sm:text-4xl">
                {formatDuration(durationMs)}
              </dd>
              {success && isFastest && (
                <span className="mt-1 inline-block rounded-full bg-success px-2.5 py-0.5 text-xs font-bold text-white">
                  {t.fastestBadge}
                </span>
              )}
            </div>
          </dl>
        </div>
      </div>

      {success ? (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-card ring-1 ring-brand/10 animate-pop">
              <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-white shadow-[0_10px_24px_-10px_rgb(36_119_212/0.9)]">
                <AchievementIcon className="size-8" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold tracking-wide text-navy/50 uppercase">{t.achievementBadge}</p>
                <p className="text-xl font-extrabold">{achievement.title}</p>
                <p className="text-sm font-semibold text-navy/60">
                  {achievement.desc}
                  {challengeTitle ? ` · ${challengeTitle}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-brand to-brand-dark p-5 text-white shadow-card animate-pop [animation-delay:150ms]">
              <img
                src="/images/gift-sticker.png"
                alt="PillMate souvenir sticker"
                className="size-20 shrink-0 rounded-2xl bg-white/95 object-contain p-1"
              />
              <div>
                <p className="flex items-center gap-1.5 text-2xl font-extrabold">
                  <Gift className="size-6" aria-hidden="true" />
                  {t.giftUnlocked}
                </p>
                <p className="text-sm font-semibold text-pretty text-white/85">
                  {t.giftDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Record on booth leaderboard form */}
          <div className="mt-6 rounded-3xl bg-white p-5 shadow-card ring-1 ring-brand/15">
            <p className="font-extrabold text-navy">{t.saveToLeaderboard}</p>
            {savedToBoard ? (
              <div className="mt-3 flex items-center gap-2 font-bold text-success">
                <Check className="size-5" />
                <span>{t.recordSaved}</span>
              </div>
            ) : (
              <form onSubmit={handleSaveName} className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  maxLength={25}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder={t.enterNamePlaceholder}
                  className="h-12 flex-1 rounded-xl bg-brand-light/50 px-4 font-bold text-navy outline-none ring-2 ring-brand/15 focus:ring-brand"
                />
                <Button type="submit" size="lg" disabled={!playerName.trim()} icon={<Send className="size-4" />}>
                  {t.btnSaveRecord}
                </Button>
              </form>
            )}
          </div>
        </>
      ) : (
        <div className="mt-8 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-brand/10">
          <h2 className="mb-3 text-lg font-extrabold">{t.completedStages}</h2>
          <ul className="grid gap-2 sm:grid-cols-3">
            {(Object.keys(t.stageLabels) as Stage[]).map((stage) => (
              <li
                key={stage}
                className={`flex items-center gap-2 rounded-2xl px-4 py-3 font-bold ${
                  completed[stage] ? 'bg-success-light text-success' : 'bg-brand-light/60 text-navy/50'
                }`}
              >
                {completed[stage] ? (
                  <CircleCheck className="size-5" aria-hidden="true" />
                ) : (
                  <CircleDashed className="size-5" aria-hidden="true" />
                )}
                <span className="flex-1">{t.stageLabels[stage]}</span>
                <span className="tabular-nums">{completed[stage] ? `+${STAGE_POINTS}` : '0'}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm font-semibold text-navy/50">{t.timeoutTip}</p>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <Button size="xl" onClick={onPlayAgain} autoFocus icon={<RotateCcw className="size-6" aria-hidden="true" />}>
          {success ? t.btnPlayAgain : t.btnTryAgain}
        </Button>
        <Button size="xl" variant="secondary" onClick={onHome} icon={<Home className="size-6" aria-hidden="true" />}>
          {t.btnBackHome}
        </Button>
      </div>
    </section>
  )
}
