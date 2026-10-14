import { WEEKDAYS } from './challenges'
import type { Challenge, RepeatMode, Stage, TimeDraft, TimeSlot, Weekday } from './types'

export const TIME_LIMIT_MS = 5 * 60 * 1000
export const STAGE_POINTS = 100
export const STAGES: Stage[] = ['setup', 'match', 'test']
export const MAX_SCORE = STAGE_POINTS * STAGES.length

export const TIME_SLOTS: { id: TimeSlot; label: string; range: string }[] = [
  { id: 'morning', label: 'Morning', range: '5 AM – 11 AM' },
  { id: 'noon', label: 'Noon', range: '11 AM – 2 PM' },
  { id: 'afternoon', label: 'Afternoon', range: '2 PM – 5 PM' },
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

import type { Lang } from './i18n'

const VI_WEEKDAYS: Record<Weekday, string> = {
  Mon: 'Thứ 2',
  Tue: 'Thứ 3',
  Wed: 'Thứ 4',
  Thu: 'Thứ 5',
  Fri: 'Thứ 6',
  Sat: 'Thứ 7',
  Sun: 'Chủ Nhật',
}

export function describeDays(days: Weekday[], lang: Lang = 'en'): string {
  const isVi = lang === 'vi'
  const set = new Set(days)
  if (set.size === 7) return isVi ? 'Mỗi ngày' : 'Every day'
  if (set.size === 5 && !set.has('Sat') && !set.has('Sun')) return isVi ? 'Ngày trong tuần (T2–T6)' : 'Weekdays'
  if (set.size === 2 && set.has('Sat') && set.has('Sun')) return isVi ? 'Cuối tuần (T7 & CN)' : 'Weekends'
  if (isVi) {
    return WEEKDAYS.filter((d) => set.has(d)).map((d) => VI_WEEKDAYS[d]).join(', ')
  }
  return WEEKDAYS.filter((d) => set.has(d)).join(', ')
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
  lang: Lang = 'en',
): ReminderValidation {
  const isVi = lang === 'vi'
  const result: ReminderValidation = {
    ok: false,
    message: '',
    timeErrors: drafts.map(() => false),
    timeCountError: false,
    repeatError: false,
    daysError: false,
  }

  const converted = drafts.map(draftTo24h)
  const incomplete = converted.map((t) => t === null)
  if (incomplete.some(Boolean)) {
    result.timeErrors = incomplete
    result.message = isVi
      ? 'Gần xong rồi! Hãy chọn đầy đủ giờ, phút và AM hoặc PM cho từng mốc nhắc nhở.'
      : 'Almost there! Pick an hour, minutes, and AM or PM for every reminder time.'
    return result
  }
  const times = converted as string[]

  if (times.length !== challenge.times.length) {
    result.timeCountError = true
    if (isVi) {
      result.message =
        challenge.times.length > 1
          ? `Nhiệm vụ này cần ${challenge.times.length} mốc giờ nhắc nhở. Hãy bấm Thêm giờ.`
          : 'Nhiệm vụ này chỉ cần 1 mốc giờ nhắc. Hãy xóa bớt mốc giờ thừa.'
    } else {
      result.message =
        challenge.times.length > 1
          ? `This mission needs ${challenge.times.length} reminder times. Add another time.`
          : 'This mission needs just one reminder time. Remove the extra one.'
    }
    return result
  }

  if (new Set(times).size !== times.length) {
    result.timeErrors = times.map((t, i) => times.indexOf(t) !== i)
    result.message = isVi
      ? 'Hai mốc giờ của bạn đang bị trùng nhau. Mỗi mốc nhắc nhở cần một giờ khác nhau.'
      : 'Two of your reminder times are the same. Each time should be different.'
    return result
  }

  const wrongTimes = times.map((t) => !challenge.times.includes(t))
  if (wrongTimes.some(Boolean)) {
    result.timeErrors = wrongTimes
    result.message = isVi
      ? 'Giờ nhắc chưa đúng với nhiệm vụ. Hãy kiểm tra lại giờ, phút và AM/PM.'
      : "That time doesn't match your mission yet. Check the hour, minutes, and AM/PM."
    return result
  }

  if (repeat === null) {
    result.repeatError = true
    result.message = isVi ? 'Hãy chọn chu kỳ lặp lại cho lịch nhắc nhở.' : 'Choose how often your reminder should repeat.'
    return result
  }

  const days = daysForRepeat(repeat, customDays)
  if (repeat === 'custom' && days.length === 0) {
    result.daysError = true
    result.message = isVi ? 'Hãy chọn ít nhất một ngày cho lịch tùy chọn của bạn.' : 'Select at least one day for your custom schedule.'
    return result
  }

  if (!sameSet(days, challenge.days)) {
    if (repeat === 'custom') result.daysError = true
    else result.repeatError = true
    result.message = isVi
      ? `Chu kỳ lặp lại chưa trùng khớp với nhiệm vụ (${challenge.scheduleLabel}).`
      : `The repeat schedule doesn't match. Your mission says: ${challenge.scheduleLabel}.`
    return result
  }

  result.ok = true
  result.message = isVi ? 'TUYỆT VỜI! LỊCH ĐÃ ĐƯỢC THIẾT LẬP CHÍNH XÁC.' : 'PERFECT! YOUR SCHEDULE IS SET.'
  return result
}

export function slotForTime(time24: string): TimeSlot {
  const [h, m] = time24.split(':').map(Number)
  const minutes = h * 60 + m
  if (minutes >= 5 * 60 && minutes < 11 * 60) return 'morning'
  if (minutes >= 11 * 60 && minutes < 14 * 60) return 'noon'
  if (minutes >= 14 * 60 && minutes < 17 * 60) return 'afternoon'
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
