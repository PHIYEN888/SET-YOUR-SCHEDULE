import { Trophy } from 'lucide-react'
import { formatDuration } from '../game/logic'
import type { Lang } from '../game/i18n'
import { translations } from '../game/i18n'
import type { LeaderboardEntry } from '../game/storage'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'

interface LeaderboardModalProps {
  open: boolean
  lang: Lang
  entries: LeaderboardEntry[]
  onClose: () => void
  onClear: () => void
}

export function LeaderboardModal({ open, lang, entries, onClose, onClear }: LeaderboardModalProps) {
  const t = translations[lang]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.leaderboardTitle}
      size="lg"
      footer={
        <div className="flex w-full items-center justify-between">
          {entries.length > 0 ? (
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg px-2 py-1 text-xs font-semibold text-navy/40 hover:text-danger hover:underline"
            >
              {t.btnClearLeaderboard}
            </button>
          ) : (
            <span />
          )}
          <Button onClick={onClose}>{t.btnGotIt}</Button>
        </div>
      }
    >
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Trophy className="size-16 text-brand/20" />
          <p className="mt-3 text-lg font-bold text-navy/60">{t.leaderboardEmpty}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brand/10 text-xs font-extrabold uppercase tracking-wider text-navy/50">
                <th className="py-2.5 pl-3">{t.rankHeader}</th>
                <th className="py-2.5">{t.nameHeader}</th>
                <th className="py-2.5">{t.scoreHeader}</th>
                <th className="py-2.5">{t.timeHeader}</th>
                <th className="py-2.5 pr-3">{t.missionHeader}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand/5">
              {entries.map((entry, idx) => {
                const isTop1 = idx === 0
                const isTop2 = idx === 1
                const isTop3 = idx === 2
                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${
                      isTop1
                        ? 'bg-amber-500/10 font-bold'
                        : isTop2
                        ? 'bg-slate-300/20 font-semibold'
                        : isTop3
                        ? 'bg-amber-700/10 font-semibold'
                        : 'hover:bg-brand-light/40'
                    }`}
                  >
                    <td className="py-3 pl-3">
                      <span className="flex items-center gap-1.5">
                        {isTop1 ? (
                          <span className="flex size-7 items-center justify-center rounded-full bg-amber-500 text-xs font-black text-white shadow-sm">
                            1
                          </span>
                        ) : isTop2 ? (
                          <span className="flex size-7 items-center justify-center rounded-full bg-slate-400 text-xs font-black text-white shadow-sm">
                            2
                          </span>
                        ) : isTop3 ? (
                          <span className="flex size-7 items-center justify-center rounded-full bg-amber-700 text-xs font-black text-white shadow-sm">
                            3
                          </span>
                        ) : (
                          <span className="flex size-7 items-center justify-center rounded-full bg-navy/10 text-xs font-bold text-navy/70">
                            {idx + 1}
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-extrabold text-navy sm:text-base">{entry.name}</span>
                        {entry.date && <span className="text-[10px] text-navy/40">{entry.date}</span>}
                      </div>
                    </td>
                    <td className="py-3 font-extrabold text-brand tabular-nums sm:text-base">{entry.score}</td>
                    <td className="py-3 font-mono text-sm font-bold text-navy/80 sm:text-base">
                      {formatDuration(entry.durationMs)}
                    </td>
                    <td className="py-3 pr-3 text-xs font-medium text-navy/60 sm:text-sm">
                      {entry.challengeTitle}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  )
}
