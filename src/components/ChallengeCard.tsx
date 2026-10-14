import { AlarmClock, CalendarCheck, CalendarDays, Clock, Coffee, Moon, Sun, Sunrise, type LucideIcon } from 'lucide-react'
import { WEEKDAYS } from '../game/challenges'
import { formatTime12 } from '../game/logic'
import type { Lang } from '../game/i18n'
import { translations } from '../game/i18n'
import type { Challenge, ChallengeIcon as IconKey } from '../game/types'

const ICONS: Record<IconKey, LucideIcon> = {
  sunrise: Sunrise,
  sun: Sun,
  moon: Moon,
  early: AlarmClock,
  weekend: CalendarDays,
  afternoon: Coffee,
  custom: CalendarCheck,
  double: Clock,
}

const VI_CHALLENGE_DETAILS: Record<number, { title: string; schedule: string; mission: string }> = {
  1: {
    title: 'Nhắc Nhở Buổi Sáng',
    schedule: 'Mỗi ngày',
    mission: 'Cài đặt nhắc nhở hàng ngày lúc 8:00 Sáng.',
  },
  2: {
    title: 'Nhắc Nhở Buổi Trưa',
    schedule: 'Mỗi ngày',
    mission: 'Cài đặt nhắc nhở hàng ngày lúc 12:00 Trưa.',
  },
  3: {
    title: 'Nhắc Nhở Buổi Tối',
    schedule: 'Mỗi ngày',
    mission: 'Cài đặt nhắc nhở hàng ngày lúc 7:00 Tối (19:00).',
  },
  4: {
    title: 'Dậy Sớm Tinh Mơ',
    schedule: 'Mỗi ngày',
    mission: 'Tạo lịch nhắc nhở lúc 6:30 Sáng.',
  },
  5: {
    title: 'Lịch Cuối Tuần',
    schedule: 'Thứ Bảy và Chủ Nhật',
    mission: 'Cài đặt nhắc nhở lúc 9:00 Sáng vào các ngày cuối tuần.',
  },
  6: {
    title: 'Lịch Đi Làm / Đi Học',
    schedule: 'Thứ Hai đến Thứ Sáu',
    mission: 'Cài đặt nhắc nhở lúc 7:30 Sáng từ Thứ 2 đến Thứ 6.',
  },
  7: {
    title: 'Kiểm Tra Buổi Chiều',
    schedule: 'Mỗi ngày',
    mission: 'Tạo lịch nhắc nhở hàng ngày lúc 3:00 Chiều (15:00).',
  },
  8: {
    title: 'Lịch Cách Ngày',
    schedule: 'Thứ Hai, Thứ Tư và Thứ Sáu',
    mission: 'Cài đặt nhắc nhở lúc 8:30 Tối (20:30) vào Thứ 2, Thứ 4 và Thứ 6.',
  },
  9: {
    title: 'Nhắc Hai Lần Mỗi Ngày',
    schedule: 'Mỗi ngày',
    mission: 'Thiết lập hai mốc giờ hàng ngày: 8:00 Sáng và 8:00 Tối (20:00).',
  },
  10: {
    title: 'Lịch Uống 3 Lần Mỗi Ngày',
    schedule: 'Mỗi ngày',
    mission: 'Thiết lập ba mốc giờ hàng ngày: 8:00 Sáng, 12:00 Trưa và 8:00 Tối (20:00).',
  },
}

export function ChallengeIcon({ icon, className = 'size-7' }: { icon: IconKey; className?: string }) {
  const Icon = ICONS[icon]
  return <Icon className={className} aria-hidden="true" />
}

interface ChallengeCardProps {
  challenge: Challenge
  compact?: boolean
  lang?: Lang
}

export function ChallengeCard({ challenge, compact = false, lang = 'vi' }: ChallengeCardProps) {
  const t = translations[lang]
  const isVi = lang === 'vi'
  const localized = isVi && VI_CHALLENGE_DETAILS[challenge.id] ? VI_CHALLENGE_DETAILS[challenge.id] : null

  const title = localized?.title ?? challenge.title
  const scheduleLabel = localized?.schedule ?? challenge.scheduleLabel
  const mission = localized?.mission ?? challenge.mission

  return (
    <article className={`flex h-full flex-col rounded-3xl bg-white ${compact ? 'p-5 sm:p-6' : 'p-6 sm:p-7'}`}>
      <div className="flex items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-brand">
          <ChallengeIcon icon={challenge.icon} />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold tracking-[0.18em] text-brand uppercase">
            {isVi ? `Thẻ thử thách #${challenge.id}` : `Challenge #${challenge.id}`}
          </p>
          <h3 className="truncate text-xl font-extrabold tracking-tight sm:text-2xl">{title}</h3>
        </div>
      </div>

      <dl className="mt-5 grid gap-4">
        <div>
          <dt className="text-xs font-bold tracking-wider text-navy/50 uppercase">{t.reminderTimeLabel}</dt>
          <dd className="mt-1.5 flex flex-wrap gap-2">
            {challenge.times.map((timeVal) => (
              <span key={timeVal} className="rounded-xl bg-navy px-3 py-1.5 text-lg font-extrabold text-white tabular-nums sm:text-xl">
                {formatTime12(timeVal)}
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold tracking-wider text-navy/50 uppercase">{t.scheduleLabel}</dt>
          <dd className="mt-1 text-lg font-bold">{scheduleLabel}</dd>
          <dd className="mt-2 flex gap-1" aria-hidden="true">
            {WEEKDAYS.map((d) => (
              <span
                key={d}
                className={`flex h-8 flex-1 items-center justify-center rounded-lg text-[11px] font-bold ${
                  challenge.days.includes(d) ? 'bg-brand text-white' : 'bg-brand-light text-navy/40'
                }`}
              >
                {d}
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold tracking-wider text-navy/50 uppercase">{t.dateLabel}</dt>
          <dd className="mt-1 text-base font-semibold text-navy/80">{t.anyDateNote}</dd>
        </div>
      </dl>

      <p className="mt-5 rounded-2xl bg-brand-light px-4 py-3 text-base leading-relaxed font-semibold text-navy">
        <span className="font-extrabold text-brand">{t.missionLabel} </span>
        {mission}
      </p>
    </article>
  )
}
