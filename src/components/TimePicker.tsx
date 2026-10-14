import { Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Period, TimeDraft } from '../game/types'

const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const MINUTES = [0, 15, 30, 45]
const PERIODS: Period[] = ['AM', 'PM']

interface TimePickerProps {
  index: number
  value: TimeDraft
  error: boolean
  disabled: boolean
  onChange: (value: TimeDraft) => void
  onRemove?: () => void
}

function Chip({ selected, error, onClick, children, label }: { selected: boolean; error: boolean; onClick: () => void; children: ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={label}
      className={`flex h-12 items-center justify-center rounded-xl text-base font-bold tabular-nums transition-all outline-none focus-visible:ring-4 focus-visible:ring-brand/40 disabled:opacity-60 ${
        selected
          ? error
            ? 'bg-danger text-white'
            : 'bg-brand text-white shadow-[0_6px_16px_-8px_rgb(36_119_212/0.8)]'
          : 'bg-brand-light/70 text-navy hover:bg-brand-light hover:ring-2 hover:ring-brand/30'
      }`}
    >
      {children}
    </button>
  )
}

export function TimePicker({ index, value, error, disabled, onChange, onRemove }: TimePickerProps) {
  const display = `${value.hour === null ? '--' : String(value.hour).padStart(2, '0')}:${
    value.minute === null ? '--' : String(value.minute).padStart(2, '0')
  } ${value.period ?? '--'}`

  return (
    <fieldset
      disabled={disabled}
      className={`rounded-2xl p-4 ring-2 transition-colors ${error ? 'bg-danger-light/60 ring-danger animate-shake' : 'bg-white ring-brand/10'}`}
    >
      <legend className="sr-only">Reminder time {index + 1}</legend>
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm font-bold tracking-wide text-navy/60 uppercase">Time {index + 1}</span>
        <div className="flex items-center gap-2">
          <output className={`text-2xl font-extrabold tabular-nums ${error ? 'text-danger' : 'text-navy'}`} aria-live="polite">
            {display}
          </output>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="flex size-10 items-center justify-center rounded-xl text-navy/50 transition hover:bg-danger-light hover:text-danger focus-visible:ring-4 focus-visible:ring-brand/40 focus-visible:outline-none"
            >
              <Trash2 className="size-5" aria-hidden="true" />
              <span className="sr-only">Remove time {index + 1}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-3">
        <div role="group" aria-label="Hour" className="grid grid-cols-6 gap-1.5">
          {HOURS.map((h) => (
            <Chip key={h} label={`${h} o'clock`} selected={value.hour === h} error={error} onClick={() => onChange({ ...value, hour: h })}>
              {h}
            </Chip>
          ))}
        </div>
        <div className="grid grid-cols-[2fr_1fr] gap-3">
          <div role="group" aria-label="Minutes" className="grid grid-cols-4 gap-1.5">
            {MINUTES.map((m) => (
              <Chip key={m} label={`${m} minutes`} selected={value.minute === m} error={error} onClick={() => onChange({ ...value, minute: m })}>
                :{String(m).padStart(2, '0')}
              </Chip>
            ))}
          </div>
          <div role="group" aria-label="AM or PM" className="grid grid-cols-2 gap-1.5">
            {PERIODS.map((p) => (
              <Chip key={p} label={p} selected={value.period === p} error={error} onClick={() => onChange({ ...value, period: p })}>
                {p}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </fieldset>
  )
}
