import { ArrowRight, CircleAlert, CircleCheck, Plus, Save } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { WEEKDAYS } from '../game/challenges'
import type { Lang } from '../game/i18n'
import { translations } from '../game/i18n'
import { daysForRepeat, draftTo24h, STAGE_POINTS, validateReminder, type ReminderValidation } from '../game/logic'
import type { Challenge, ReminderConfig, RepeatMode, TimeDraft, Weekday } from '../game/types'
import { ChallengeCard } from './ChallengeCard'
import { TimePicker } from './TimePicker'
import { Button } from './ui/Button'

interface ReminderSetupFormProps {
  challenge: Challenge
  completed: boolean
  lang: Lang
  onSuccess: (reminder: ReminderConfig) => void
  onFail: () => void
  onNext: () => void
}

const emptyTime = (): TimeDraft => ({ hour: null, minute: null, period: null })

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function ReminderSetupForm({ challenge, completed, lang, onSuccess, onFail, onNext }: ReminderSetupFormProps) {
  const [times, setTimes] = useState<TimeDraft[]>([emptyTime()])
  const [repeat, setRepeat] = useState<RepeatMode | null>(null)
  const [customDays, setCustomDays] = useState<Weekday[]>([])
  const [label, setLabel] = useState('')
  const [startDate, setStartDate] = useState(todayISO)
  const [result, setResult] = useState<ReminderValidation | null>(null)
  const [attempt, setAttempt] = useState(0)
  const labelId = useId()
  const dateId = useId()
  const t = translations[lang]

  useEffect(() => {
    if (!completed) return
    const timer = window.setTimeout(() => {
      onNext()
    }, 1400)
    return () => window.clearTimeout(timer)
  }, [completed, onNext])

  const repeatOptions: { id: RepeatMode; label: string; hint: string }[] = [
    { id: 'daily', label: t.repeatDaily, hint: t.repeatDailyHint },
    { id: 'weekdays', label: t.repeatWorkdays, hint: t.repeatWorkdaysHint },
    { id: 'weekends', label: t.repeatWeekends, hint: t.repeatWeekendsHint },
    { id: 'custom', label: t.repeatCustom, hint: t.repeatCustomHint },
  ]

  const clearErrors = () => setResult((r) => (r && !r.ok ? null : r))

  const updateTime = (index: number, value: TimeDraft) => {
    setTimes((prev) => prev.map((item, i) => (i === index ? value : item)))
    clearErrors()
  }

  const toggleDay = (day: Weekday) => {
    setCustomDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
    clearErrors()
  }

  const handleSave = () => {
    if (completed) return
    const validation = validateReminder(challenge, times, repeat, customDays, t)
    setResult(validation)
    setAttempt((a) => a + 1)
    if (validation.ok && repeat) {
      onSuccess({
        times: times.map((tm) => draftTo24h(tm) as string).sort(),
        days: daysForRepeat(repeat, customDays),
        repeat,
        label: label.trim(),
        startDate,
      })
    } else {
      onFail()
    }
  }

  const showError = result && !result.ok

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:py-10">
      <header className="mb-6 text-center lg:text-left">
        <p className="text-sm font-bold tracking-[0.2em] text-brand uppercase">{t.setupStepBadge}</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-5xl">{t.setupTitle}</h1>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <div className="lg:sticky lg:top-32">
          <div className="rounded-3xl shadow-card ring-1 ring-brand/10">
            <ChallengeCard challenge={challenge} compact lang={lang} />
          </div>
        </div>

        <form
          className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-brand/10 sm:p-7"
          onSubmit={(e) => {
            e.preventDefault()
            handleSave()
          }}
          noValidate
        >
          <fieldset disabled={completed} className="grid gap-6">
            <legend className="sr-only">{t.setupTitle}</legend>

            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-extrabold">{t.reminderTimeLabel}</h2>
                {times.length < 3 && !completed && (
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => {
                      setTimes((prev) => [...prev, emptyTime()])
                      clearErrors()
                    }}
                    icon={<Plus className="size-4" aria-hidden="true" />}
                  >
                    {t.addTime}
                  </Button>
                )}
              </div>
              <div className={`grid gap-3 rounded-2xl ${showError && result.timeCountError ? 'ring-2 ring-danger ring-offset-4' : ''}`}>
                {times.map((tm, i) => (
                  <TimePicker
                    key={`${attempt}-${i}`}
                    index={i}
                    value={tm}
                    disabled={completed}
                    lang={lang}
                    error={Boolean(showError && result.timeErrors[i])}
                    onChange={(v) => updateTime(i, v)}
                    onRemove={
                      times.length > 1 && !completed
                        ? () => {
                            setTimes((prev) => prev.filter((_, idx) => idx !== i))
                            clearErrors()
                          }
                        : undefined
                    }
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              <h2 className="text-lg font-extrabold" id="repeat-heading">
                {t.repeatSchedule}
              </h2>
              <div
                role="group"
                aria-labelledby="repeat-heading"
                className={`grid grid-cols-2 gap-2 rounded-2xl sm:grid-cols-4 ${
                  showError && result.repeatError ? 'animate-shake ring-2 ring-danger ring-offset-4' : ''
                }`}
                key={`repeat-${attempt}`}
              >
                {repeatOptions.map((opt) => {
                  const selected = repeat === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        setRepeat(opt.id)
                        clearErrors()
                      }}
                      className={`flex min-h-16 flex-col items-center justify-center rounded-2xl px-3 py-2 transition-all outline-none focus-visible:ring-4 focus-visible:ring-brand/40 ${
                        selected
                          ? 'bg-brand text-white shadow-[0_8px_20px_-10px_rgb(36_119_212/0.8)]'
                          : 'bg-brand-light/70 text-navy hover:bg-brand-light hover:ring-2 hover:ring-brand/30'
                      }`}
                    >
                      <span className="text-base font-extrabold">{opt.label}</span>
                      <span className={`text-xs font-semibold ${selected ? 'text-white/80' : 'text-navy/50'}`}>{opt.hint}</span>
                    </button>
                  )
                })}
              </div>

              {repeat === 'custom' && (
                <div
                  role="group"
                  aria-label={t.customDaysGroupAria}
                  key={`days-${attempt}`}
                  className={`grid grid-cols-7 gap-1.5 rounded-2xl p-1 animate-fade-up ${showError && result.daysError ? 'animate-shake ring-2 ring-danger' : ''}`}
                >
                  {WEEKDAYS.map((day) => {
                    const selected = customDays.includes(day)
                    return (
                      <button
                        key={day}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleDay(day)}
                        className={`flex h-12 items-center justify-center rounded-xl text-sm font-extrabold transition-all outline-none focus-visible:ring-4 focus-visible:ring-brand/40 sm:h-14 sm:text-base ${
                          selected ? 'bg-navy text-white' : 'bg-white text-navy ring-2 ring-brand/15 hover:ring-brand/40'
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <label htmlFor={dateId} className="text-sm font-bold text-navy">
                  {t.startDate} <span className="font-semibold text-navy/40">{t.startDateHint}</span>
                </label>
                <input
                  id={dateId}
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-12 rounded-xl bg-brand-light/50 px-4 text-base font-semibold text-navy ring-2 ring-brand/10 outline-none focus:ring-brand/50"
                />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor={labelId} className="text-sm font-bold text-navy">
                  {t.reminderLabel} <span className="font-semibold text-navy/40">{t.reminderLabelHint}</span>
                </label>
                <input
                  id={labelId}
                  type="text"
                  value={label}
                  maxLength={30}
                  autoComplete="off"
                  placeholder={t.reminderLabelPlaceholder}
                  onChange={(e) => setLabel(e.target.value)}
                  className="h-12 rounded-xl bg-brand-light/50 px-4 text-base font-semibold text-navy ring-2 ring-brand/10 outline-none placeholder:text-navy/30 focus:ring-brand/50"
                />
              </div>
            </div>
          </fieldset>

          <div className="mt-6 grid gap-4" aria-live="polite">
            {showError && (
              <p className="flex items-start gap-3 rounded-2xl bg-danger-light px-4 py-3 font-semibold text-navy ring-1 ring-danger/30 animate-fade-up">
                <CircleAlert className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
                {result.message}
              </p>
            )}
            {completed && (
              <div className="flex flex-col items-center gap-2 rounded-2xl bg-success-light px-4 py-5 text-center ring-1 ring-success/30 animate-pop sm:flex-row sm:text-left">
                <CircleCheck className="size-10 shrink-0 text-success" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-xl font-extrabold text-success">{t.setupSuccessTitle}</p>
                  <p className="text-sm font-semibold text-navy/70">{t.setupSuccessSub}</p>
                </div>
                <span className="rounded-full bg-success px-4 py-1.5 text-lg font-extrabold text-white">+{STAGE_POINTS}</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            {completed ? (
              <Button type="button" size="xl" onClick={onNext} autoFocus iconRight={<ArrowRight className="size-6" aria-hidden="true" />} className="w-full sm:w-auto">
                {t.btnNextStep}
              </Button>
            ) : (
              <Button type="submit" size="xl" icon={<Save className="size-6" aria-hidden="true" />} className="w-full sm:w-auto">
                {t.btnSaveReminder}
              </Button>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
