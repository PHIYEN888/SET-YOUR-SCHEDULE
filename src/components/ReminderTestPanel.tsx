import { BellRing, CalendarDays, CheckCircle2, CircleCheck, FlaskConical, Flag, Pill, Tag, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { describeDays, formatTime12, STAGE_POINTS } from '../game/logic'
import type { Lang } from '../game/i18n'
import { translations } from '../game/i18n'
import type { ReminderConfig } from '../game/types'
import { Mascot } from './Mascot'
import { Button } from './ui/Button'

type TestState = 'idle' | 'ringing' | 'done'

const AUTO_COMPLETE_MS = 6000

interface ReminderTestPanelProps {
  reminder: ReminderConfig
  completed: boolean
  soundOn: boolean
  lang: Lang
  onToggleSound: () => void
  onRing: () => void
  onSuccess: () => void
  onFinish: () => void
}

export function ReminderTestPanel({
  reminder,
  completed,
  soundOn,
  lang,
  onToggleSound,
  onRing,
  onSuccess,
  onFinish,
}: ReminderTestPanelProps) {
  const [testState, setTestState] = useState<TestState>(completed ? 'done' : 'idle')
  const t = translations[lang]
  const timerRef = useRef<number | null>(null)

  const handleTakeDose = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    setTestState('done')
    onSuccess()
  }

  useEffect(() => {
    if (testState !== 'ringing') return
    timerRef.current = window.setTimeout(() => {
      setTestState('done')
      onSuccess()
    }, AUTO_COMPLETE_MS)
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [testState, onSuccess])

  useEffect(() => {
    if (testState !== 'done') return
    const id = window.setTimeout(() => {
      onFinish()
    }, 1800)
    return () => window.clearTimeout(id)
  }, [testState, onFinish])

  const startTest = () => {
    if (testState !== 'idle') return
    setTestState('ringing')
    onRing()
  }

  const ringing = testState === 'ringing'
  const showNotification = testState !== 'idle'
  const firstTime = formatTime12(reminder.times[0])

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-10">
      <header className="mb-6 text-center">
        <p className="text-sm font-bold tracking-[0.2em] text-brand uppercase">{t.testStepBadge}</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-5xl">{t.testTitle}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-pretty text-navy/70">
          {t.testDesc}
        </p>
      </header>

      <div className="grid items-center gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-white to-brand-light p-4 shadow-card ring-1 ring-brand/15 sm:p-8">
          <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-navy/90 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
            <FlaskConical className="size-3.5" aria-hidden="true" />
            {t.simBadge}
          </span>

          <div className="relative mx-auto max-w-xl">
            <div className={`relative ${ringing ? 'animate-wiggle' : ''}`}>
              <img
                src="/images/pillbox.png"
                alt={t.pillboxAlt}
                className="w-full select-none"
                draggable={false}
              />
              <span
                aria-hidden="true"
                className={`absolute top-[49.2%] left-[60%] size-[4.5%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
                  ringing
                    ? 'animate-led bg-brand shadow-[0_0_24px_10px_rgb(36_119_212/0.65)]'
                    : testState === 'done'
                    ? 'bg-success shadow-[0_0_18px_6px_rgb(54_179_126/0.6)]'
                    : 'bg-transparent'
                }`}
              />
            </div>

            <div className="absolute -bottom-2 -left-2 w-24 sm:-left-6 sm:w-36">
              <Mascot
                variant={testState === 'done' ? 'celebrate' : 'wave'}
                floating={!ringing}
                className={ringing ? 'animate-wiggle' : ''}
              />
            </div>

            {showNotification && (
              <div
                role="status"
                className="absolute top-0 right-0 w-[min(19rem,82%)] rounded-2xl bg-white/95 p-3 shadow-card ring-1 ring-brand/15 backdrop-blur animate-slide-in sm:p-4"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-white ${
                      testState === 'done' ? 'bg-success' : 'bg-brand'
                    }`}
                  >
                    {testState === 'done' ? (
                      <CircleCheck className="size-5" aria-hidden="true" />
                    ) : (
                      <BellRing className="size-5 animate-wiggle" aria-hidden="true" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold tracking-wide text-navy/50 uppercase">{t.notificationNow}</p>
                    <p className="font-extrabold text-navy">{reminder.label || 'PillMate'}</p>
                    <p className="text-sm font-semibold text-navy/70">
                      {firstTime} — {t.notificationText}
                    </p>
                  </div>
                </div>

                {ringing && (
                  <button
                    type="button"
                    onClick={handleTakeDose}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-success py-2 text-xs font-black text-white shadow-soft transition hover:bg-emerald-600 focus-visible:ring-2 focus-visible:ring-success"
                  >
                    <CheckCircle2 className="size-4" />
                    {t.btnTakeDose}
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="mt-4 text-center text-xs font-semibold text-navy/45">
            {t.simNotice}
          </p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-brand/10 sm:p-6">
            <h2 className="mb-4 text-lg font-extrabold">{t.configuredReminder}</h2>
            <dl className="grid gap-3">
              <div className="flex items-start gap-3">
                <BellRing className="mt-1 size-5 shrink-0 text-brand" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-bold tracking-wide text-navy/50 uppercase">{t.reminderTimeLabel}</dt>
                  <dd className="flex flex-wrap gap-2 text-xl font-extrabold tabular-nums">
                    {reminder.times.map((tVal) => (
                      <span key={tVal}>{formatTime12(tVal)}</span>
                    ))}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-1 size-5 shrink-0 text-brand" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-bold tracking-wide text-navy/50 uppercase">{t.repeatsLabel}</dt>
                  <dd className="text-lg font-bold">{describeDays(reminder.days)}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Tag className="mt-1 size-5 shrink-0 text-brand" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-bold tracking-wide text-navy/50 uppercase">{t.labelField}</dt>
                  <dd className="text-lg font-bold">{reminder.label || <span className="text-navy/40">{t.noLabel}</span>}</dd>
                </div>
              </div>
            </dl>
          </div>

          <button
            type="button"
            onClick={onToggleSound}
            aria-pressed={soundOn}
            className="flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-3 font-bold text-navy shadow-soft ring-1 ring-brand/10 transition hover:ring-brand/30 focus-visible:ring-4 focus-visible:ring-brand/40 focus-visible:outline-none"
          >
            <span className="flex items-center gap-2">
              {soundOn ? <Volume2 className="size-5 text-brand" aria-hidden="true" /> : <VolumeX className="size-5 text-navy/50" aria-hidden="true" />}
              {t.soundToggle}
            </span>
            <span className={`rounded-full px-3 py-1 text-sm ${soundOn ? 'bg-brand text-white' : 'bg-brand-light text-navy/60'}`}>
              {soundOn ? t.soundOnText : t.soundMutedText}
            </span>
          </button>

          <div aria-live="polite">
            {testState === 'done' && (
              <div className="flex items-center gap-3 rounded-2xl bg-success-light px-4 py-4 ring-1 ring-success/30 animate-pop">
                <Pill className="size-8 shrink-0 text-success" aria-hidden="true" />
                <p className="flex-1 text-base font-extrabold text-success">{t.doseTakenBadge}</p>
                <span className="rounded-full bg-success px-4 py-1.5 text-lg font-extrabold text-white">+{STAGE_POINTS}</span>
              </div>
            )}
          </div>

          {testState === 'done' ? (
            <Button size="xl" variant="success" onClick={onFinish} autoFocus icon={<Flag className="size-6" aria-hidden="true" />}>
              {t.btnFinish}
            </Button>
          ) : ringing ? (
            <Button size="xl" variant="success" onClick={handleTakeDose} icon={<CheckCircle2 className="size-6 animate-pulse" aria-hidden="true" />}>
              {t.btnTakeDose}
            </Button>
          ) : (
            <Button size="xl" onClick={startTest} icon={<BellRing className="size-6" aria-hidden="true" />}>
              {t.btnTestNow}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
