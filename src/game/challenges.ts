import type { Challenge, Weekday } from './types'

export const WEEKDAYS: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const WORKDAYS: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const WEEKENDS: Weekday[] = ['Sat', 'Sun']

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: 'Morning Reminder',
    times: ['08:00'],
    days: WEEKDAYS,
    scheduleLabel: 'Every day',
    mission: 'Set a daily reminder for 8:00 AM.',
    icon: 'sunrise',
  },
  {
    id: 2,
    title: 'Midday Reminder',
    times: ['12:00'],
    days: WEEKDAYS,
    scheduleLabel: 'Every day',
    mission: 'Set a daily reminder for 12:00 PM.',
    icon: 'sun',
  },
  {
    id: 3,
    title: 'Evening Reminder',
    times: ['19:00'],
    days: WEEKDAYS,
    scheduleLabel: 'Every day',
    mission: 'Set a daily reminder for 7:00 PM.',
    icon: 'moon',
  },
  {
    id: 4,
    title: 'Early Bird',
    times: ['06:30'],
    days: WEEKDAYS,
    scheduleLabel: 'Every day',
    mission: 'Create a reminder for 6:30 AM.',
    icon: 'early',
  },
  {
    id: 5,
    title: 'Weekend Schedule',
    times: ['09:00'],
    days: WEEKENDS,
    scheduleLabel: 'Saturday and Sunday',
    mission: 'Set a reminder for 9:00 AM on weekends.',
    icon: 'weekend',
  },
  {
    id: 6,
    title: 'Workday Routine',
    times: ['07:30'],
    days: WORKDAYS,
    scheduleLabel: 'Monday to Friday',
    mission: 'Set a reminder for 7:30 AM on weekdays (Mon–Fri).',
    icon: 'sunrise',
  },
  {
    id: 7,
    title: 'Afternoon Check',
    times: ['15:00'],
    days: WEEKDAYS,
    scheduleLabel: 'Every day',
    mission: 'Create a daily reminder for 3:00 PM.',
    icon: 'afternoon',
  },
  {
    id: 8,
    title: 'Custom Routine',
    times: ['20:30'],
    days: ['Mon', 'Wed', 'Fri'],
    scheduleLabel: 'Monday, Wednesday, and Friday',
    mission: 'Set a reminder for 8:30 PM on Monday, Wednesday, and Friday.',
    icon: 'custom',
  },
  {
    id: 9,
    title: 'Double Reminder',
    times: ['08:00', '20:00'],
    days: WEEKDAYS,
    scheduleLabel: 'Every day',
    mission: 'Configure two daily reminder times: 8:00 AM and 8:00 PM.',
    icon: 'double',
  },
  {
    id: 10,
    title: 'Triple Dose Plan',
    times: ['08:00', '12:00', '20:00'],
    days: WEEKDAYS,
    scheduleLabel: 'Every day',
    mission: 'Configure three daily reminder times: 8:00 AM, 12:00 PM, and 8:00 PM.',
    icon: 'double',
  },
]

export function shuffleChallenges(list: Challenge[] = CHALLENGES, random: () => number = Math.random): Challenge[] {
  const deck = [...list]
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}
