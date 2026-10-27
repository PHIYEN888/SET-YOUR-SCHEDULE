import { ArrowRight, Check, CircleAlert, CircleCheck, Eraser, Info, Moon, Sun, Sunrise, type LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { WEEKDAYS } from '../game/challenges'
import type { Lang, Translation } from '../locales'
import { translations } from '../locales'
import { cellKey, describeDays, formatTime12, STAGE_POINTS, TIME_SLOTS, validateMatch, type MatchValidation } from '../game/logic'
import type { Challenge, ReminderConfig, TimeSlot, Weekday } from '../game/types'
import { Button } from './ui/Button'

const SLOT_ICONS: Record<TimeSlot, LucideIcon> = {
  morning: Sunrise,
  noon: Sun,
  evening: Moon,
}

interface ScheduleMatchingBoardProps {
  challenge: Challenge
  reminder: ReminderConfig
  completed: boolean
  lang: Lang
  onSuccess: () => void
  onFail: () => void
  onNext: () => void
  onTap: () => void
}

function feedbackMessage(result: MatchValidation, t: Translation): string {
  if (result.missing > 0 && result.extra > 0) {
    return t.matchFeedbackMissingAndExtra(result.missing, result.extra)
  }
  if (result.missing > 0) {
    return t.matchFeedbackMissing(result.missing)
  }
  return t.matchFeedbackExtra(result.extra)
}

export function ScheduleMatchingBoard({
  challenge,
  reminder,
  completed,
  lang,
  onSuccess,
  onFail,
  onNext,
  onTap,
}: ScheduleMatchingBoardProps) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [result, setResult] = useState<MatchValidation | null>(null)
  const [attempt, setAttempt] = useState(0)
  const t = translations[lang]

  useEffect(() => {
    if (!completed) return
    const timer = window.setTimeout(() => {
      onNext()
    }, 1400)
    return () => window.clearTimeout(timer)
  }, [completed, onNext])

  const update = (fn: (next: Set<string>) => void) => {
    if (completed) return
    onTap()
    setSelected((prev) => {
      const next = new Set(prev)
      fn(next)
      return next
    })
    setResult(null)
  }

  const toggleCell = (key: string) =>
    update((next) => {
      if (next.has(key)) next.delete(key)
      else next.add(key)
    })

  const toggleGroup = (keys: string[]) =>
    update((next) => {
      const allOn = keys.every((k) => next.has(k))
      for (const k of keys) {
        if (allOn) next.delete(k)
        else next.add(k)
      }
    })

  const handleCheck = () => {
    if (completed) return
    const validation = validateMatch(challenge, selected)
    setResult(validation)
    setAttempt((a) => a + 1)
    if (validation.ok) onSuccess()
    else onFail()
  }

  const showError = result && !result.ok
  const rowKeys = (slot: TimeSlot) => WEEKDAYS.map((d) => cellKey(d, slot))
  const colKeys = (day: Weekday) => TIME_SLOTS.map((s) => cellKey(day, s.id))

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-10">
      <header className="mb-6 text-center">
        <p className="text-sm font-bold tracking-[0.2em] text-brand uppercase">{t.matchStepBadge}</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-5xl">{t.matchTitle}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-pretty text-navy/70">
          {t.matchDesc}
        </p>
      </header>

      <div className="mb-5 flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-soft ring-1 ring-brand/10 sm:flex-row sm:items-center sm:p-5">
        <p className="text-xs font-bold tracking-[0.18em] text-navy/50 uppercase sm:w-28">{t.yourReminder}</p>
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {reminder.times.map((tVal) => (
            <span key={tVal} className="rounded-xl bg-navy px-3 py-1.5 text-lg font-extrabold text-white tabular-nums">
              {formatTime12(tVal)}
            </span>
          ))}
          <span className="rounded-xl bg-brand-light px-3 py-1.5 text-base font-bold text-brand">
            {describeDays(reminder.days, t)}
          </span>
          {reminder.label && <span className="rounded-xl bg-success-light px-3 py-1.5 text-base font-bold text-success">{reminder.label}</span>}
        </div>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-navy/50">
          <Info className="size-4" aria-hidden="true" />
          {t.matchTip}
        </p>
      </div>

      <div className="rounded-[2rem] bg-gradient-to-b from-white to-brand-light p-2.5 shadow-card ring-1 ring-brand/15 sm:p-5">
        <div
          key={`board-${attempt}`}
          role="group"
          aria-label={t.organizerAriaLabel}
          className={`grid grid-cols-[3rem_repeat(7,minmax(0,1fr))] gap-1.5 sm:grid-cols-[8.5rem_repeat(7,minmax(0,1fr))] sm:gap-2.5 ${
            showError ? 'animate-shake' : ''
          }`}
        >
          <div className="contents">
            <span aria-hidden="true" />
            {WEEKDAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleGroup(colKeys(day))}
                disabled={completed}
                aria-label={t.toggleAllDayAria(t.weekdaysShort[day])}
                className="flex h-10 items-center justify-center rounded-xl bg-navy text-xs font-extrabold text-white transition outline-none hover:bg-brand focus-visible:ring-4 focus-visible:ring-brand/40 disabled:hover:bg-navy sm:h-12 sm:text-base"
              >
                {t.weekdaysShort[day]}
              </button>
            ))}
          </div>

          {TIME_SLOTS.map((slot) => {
            const Icon = SLOT_ICONS[slot.id]
            const slotInfo = t.slots[slot.id]
            return (
              <div key={slot.id} className="contents">
                <button
                  type="button"
                  onClick={() => toggleGroup(rowKeys(slot.id))}
                  disabled={completed}
                  aria-label={t.toggleAllSlotAria(slotInfo.label, slotInfo.range)}
                  className="flex flex-col items-center justify-center gap-0.5 rounded-xl bg-white px-1 py-2 text-navy ring-1 ring-brand/15 transition outline-none hover:bg-brand-light focus-visible:ring-4 focus-visible:ring-brand/40 disabled:hover:bg-white sm:flex-row sm:justify-start sm:gap-2.5 sm:px-3"
                >
                  <Icon className="size-5 shrink-0 text-brand sm:size-6" aria-hidden="true" />
                  <span className="text-left">
                    <span className="block text-[10px] leading-tight font-extrabold sm:text-base">{slotInfo.label}</span>
                    <span className="hidden text-xs font-semibold text-navy/50 sm:block">{slotInfo.range}</span>
                  </span>
                </button>
                {WEEKDAYS.map((day) => {
                  const key = cellKey(day, slot.id)
                  const isOn = selected.has(key)
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={isOn}
                      aria-label={t.compartmentAria(t.weekdaysShort[day], slotInfo.label)}
                      disabled={completed}
                      onClick={() => toggleCell(key)}
                      className={`group relative flex aspect-square items-center justify-center rounded-xl transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:ring-brand/40 sm:aspect-[4/3] sm:rounded-2xl ${
                        isOn
                          ? completed
                            ? 'bg-success text-white shadow-[0_8px_20px_-10px_rgb(54_179_126/0.9)]'
                            : 'scale-[1.03] bg-brand text-white shadow-[0_8px_20px_-10px_rgb(36_119_212/0.9)]'
                          : 'bg-[#d7e9fd]/70 text-brand/0 ring-1 ring-white hover:bg-[#cfe4fc] hover:text-brand/40 ring-inset'
                      }`}
                    >
                      <span className="absolute inset-x-[18%] top-1.5 h-1 rounded-full bg-white/50 sm:top-2" aria-hidden="true" />
                      <Check className="size-5 sm:size-7" strokeWidth={3} aria-hidden="true" />
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      <p className="mt-3 text-center text-xs font-semibold text-navy/45">
        {t.simulationNote}
      </p>

      <div className="mt-5 grid gap-4" aria-live="polite">
        {showError && (
          <p className="mx-auto flex max-w-2xl items-start gap-3 rounded-2xl bg-danger-light px-4 py-3 font-semibold text-navy ring-1 ring-danger/30 animate-fade-up">
            <CircleAlert className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
            {feedbackMessage(result, t)}
          </p>
        )}
        {completed && (
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-2 rounded-2xl bg-success-light px-4 py-5 text-center ring-1 ring-success/30 animate-pop sm:flex-row sm:text-left">
            <CircleCheck className="size-10 shrink-0 text-success" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-xl font-extrabold text-success">{t.matchSuccessTitle}</p>
              <p className="text-sm font-semibold text-navy/70">{t.matchSuccessSub}</p>
            </div>
            <span className="rounded-full bg-success px-4 py-1.5 text-lg font-extrabold text-white">+{STAGE_POINTS}</span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col-reverse items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        {completed ? (
          <Button size="xl" onClick={onNext} autoFocus iconRight={<ArrowRight className="size-6" aria-hidden="true" />}>
            {t.btnNextStep}
          </Button>
        ) : (
          <>
            <Button
              size="xl"
              variant="secondary"
              onClick={() => update((next) => next.clear())}
              disabled={selected.size === 0}
              icon={<Eraser className="size-5" aria-hidden="true" />}
            >
              {t.btnClear}
            </Button>
            <Button size="xl" onClick={handleCheck} disabled={selected.size === 0} icon={<Check className="size-6" strokeWidth={3} aria-hidden="true" />}>
              {t.btnCheckMatch}
            </Button>
          </>
        )}
      </div>
    </section>
  )
}
