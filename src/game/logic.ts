import { WEEKDAYS } from './challenges'
import type { Challenge, RepeatMode, Stage, TimeDraft, TimeSlot, Weekday } from './types'

export const TIME_LIMIT_MS = 5 * 60 * 1000
export const STAGE_POINTS = 100
export const STAGES: Stage[] = ['setup', 'match', 'test']
export const MAX_SCORE = STAGE_POINTS * STAGES.length

export const TIME_SLOTS: { id: TimeSlot; label: string; range: string }[] = [
  { id: 'morning', label: 'Morning', range: '5 AM – 11 AM' },
  { id: 'noon', label: 'Noon', range: '11 AM – 5 PM' },
  { id: 'evening', label: 'Evening', range: '5 PM – 12 AM' },
]

export const REPEAT_OPTIONS: { id: RepeatMode; label: string; hint: string }[] = [
  { id: 'daily', label: 'Every day', hint: 'Mon – Sun' },
  { id: 'weekdays', label: 'Weekdays', hint: 'Mon – Fri' },
  { id: 'weekends', label: 'Weekends', hint: 'Sat & Sun' },
  { id: 'custom', label: 'Custom days', hint: 'Pick days' },
]

export function scoreFor(completed: Record<Stage, boolean>): number {
  return STAGES.reduce((total, stage) => total + (completed[stage] ? STAGE_POINTS : 0), 0)
}

export function draftTo24h(draft: TimeDraft): string | null {
  if (draft.hour === null || draft.minute === null || draft.period === null) return null
  let hour = draft.hour % 12
  if (draft.period === 'PM') hour += 12
  return `${String(hour).padStart(2, '0')}:${String(draft.minute).padStart(2, '0')}`
}

export function formatTime12(time24: string): string {
  const [h, m] = time24.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function daysForRepeat(mode: RepeatMode, customDays: Weekday[]): Weekday[] {
  switch (mode) {
    case 'daily':
      return [...WEEKDAYS]
    case 'weekdays':
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    case 'weekends':
      return ['Sat', 'Sun']
    case 'custom':
      return WEEKDAYS.filter((d) => customDays.includes(d))
  }
}

import type { Lang, Translation } from '../locales'
import { getTranslation } from '../locales'

export function describeDays(days: Weekday[], tOrLang: Translation | Lang = 'en'): string {
  const t = typeof tOrLang === 'string' ? getTranslation(tOrLang) : tOrLang
  const set = new Set(days)
  if (set.size === 7) return t.repeatEveryDay
  if (set.size === 5 && !set.has('Sat') && !set.has('Sun')) return t.repeatWeekdaysDesc
  if (set.size === 2 && set.has('Sat') && set.has('Sun')) return t.repeatWeekendsDesc
  return WEEKDAYS.filter((d) => set.has(d)).map((d) => t.weekdaysFull[d] || d).join(', ')
}

function sameSet<T>(a: T[], b: T[]): boolean {
  const sa = new Set(a)
  const sb = new Set(b)
  if (sa.size !== sb.size) return false
  for (const v of sa) if (!sb.has(v)) return false
  return true
}

export interface ReminderValidation {
  ok: boolean
  message: string
  timeErrors: boolean[]
  timeCountError: boolean
  repeatError: boolean
  daysError: boolean
}

export function validateReminder(
  challenge: Challenge,
  drafts: TimeDraft[],
  repeat: RepeatMode | null,
  customDays: Weekday[],
  tOrLang: Translation | Lang = 'en',
): ReminderValidation {
  const t = typeof tOrLang === 'string' ? getTranslation(tOrLang) : tOrLang
  const localizedChallenge = t.challenges[challenge.id]
  const expectedSchedule = localizedChallenge?.schedule ?? challenge.scheduleLabel

  const result: ReminderValidation = {
    ok: false,
    message: '',
    timeErrors: drafts.map(() => false),
    timeCountError: false,
    repeatError: false,
    daysError: false,
  }

  const converted = drafts.map(draftTo24h)
  const incomplete = converted.map((item) => item === null)
  if (incomplete.some(Boolean)) {
    result.timeErrors = incomplete
    result.message = t.validationIncompleteTime
    return result
  }
  const times = converted as string[]

  if (times.length !== challenge.times.length) {
    result.timeCountError = true
    result.message =
      challenge.times.length > 1
        ? t.validationNeedMoreTimes(challenge.times.length)
        : t.validationNeedFewerTimes
    return result
  }

  if (new Set(times).size !== times.length) {
    result.timeErrors = times.map((tm, i) => times.indexOf(tm) !== i)
    result.message = t.validationDuplicateTimes
    return result
  }

  const wrongTimes = times.map((tm) => !challenge.times.includes(tm))
  if (wrongTimes.some(Boolean)) {
    result.timeErrors = wrongTimes
    result.message = t.validationWrongTimes
    return result
  }

  if (repeat === null) {
    result.repeatError = true
    result.message = t.validationChooseRepeat
    return result
  }

  const days = daysForRepeat(repeat, customDays)
  if (repeat === 'custom' && days.length === 0) {
    result.daysError = true
    result.message = t.validationChooseAtLeastOneDay
    return result
  }

  if (!sameSet(days, challenge.days)) {
    if (repeat === 'custom') result.daysError = true
    else result.repeatError = true
    result.message = t.validationRepeatMismatch(expectedSchedule)
    return result
  }

  result.ok = true
  result.message = t.validationSuccess
  return result
}

export function slotForTime(time24: string): TimeSlot {
  const [h, m] = time24.split(':').map(Number)
  const minutes = h * 60 + m
  if (minutes >= 5 * 60 && minutes < 11 * 60) return 'morning'
  if (minutes >= 11 * 60 && minutes < 17 * 60) return 'noon'
  return 'evening'
}

export const cellKey = (day: Weekday, slot: TimeSlot) => `${day}|${slot}`

export function requiredCells(challenge: Challenge): Set<string> {
  const cells = new Set<string>()
  for (const time of challenge.times) {
    const slot = slotForTime(time)
    for (const day of challenge.days) cells.add(cellKey(day, slot))
  }
  return cells
}

export interface MatchValidation {
  ok: boolean
  missing: number
  extra: number
}

export function validateMatch(challenge: Challenge, selected: Set<string>): MatchValidation {
  const required = requiredCells(challenge)
  let missing = 0
  let extra = 0
  for (const key of required) if (!selected.has(key)) missing++
  for (const key of selected) if (!required.has(key)) extra++
  return { ok: missing === 0 && extra === 0, missing, extra }
}
