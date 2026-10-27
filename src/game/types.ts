export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

export type RepeatMode = 'daily' | 'weekdays' | 'weekends' | 'custom'

export type TimeSlot = 'morning' | 'noon' | 'evening'

export type ChallengeIcon = 'sunrise' | 'sun' | 'moon' | 'early' | 'weekend' | 'afternoon' | 'custom' | 'double'

export interface Challenge {
  id: number
  title: string
  /** Required reminder times in 24h "HH:MM" format. */
  times: string[]
  /** Required recurrence days. */
  days: Weekday[]
  scheduleLabel: string
  mission: string
  icon: ChallengeIcon
}

export type Period = 'AM' | 'PM'

export interface TimeDraft {
  hour: number | null
  minute: number | null
  period: Period | null
}

export interface ReminderConfig {
  times: string[]
  days: Weekday[]
  repeat: RepeatMode
  label: string
  startDate: string
}

export type Stage = 'setup' | 'match' | 'test'

export type Phase = 'welcome' | 'draw' | 'setup' | 'match' | 'test' | 'result'

export type Outcome = 'completed' | 'timeout'
