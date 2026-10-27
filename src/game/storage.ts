import type { Lang } from './i18n'

export interface GameStats {
  bestScore: number
  fastestMs: number | null
  gamesPlayed: number
  gamesCompleted: number
}

export interface LeaderboardEntry {
  id: string
  name: string
  score: number
  durationMs: number
  challengeTitle: string
  date: string
}

const STATS_KEY = 'pillmate.stats.v1'
const SOUND_KEY = 'pillmate.sound.v1'
const LANG_KEY = 'pillmate.lang.v1'
const LEADERBOARD_KEY = 'pillmate.leaderboard.v1'

export const emptyStats: GameStats = { bestScore: 0, fastestMs: null, gamesPlayed: 0, gamesCompleted: 0 }

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'Dr. Taylor (PillMate Team)', score: 300, durationMs: 64000, challengeTitle: 'Morning Reminder', date: 'Demo' },
  { id: '2', name: 'Alex M. (Booth Visitor)', score: 300, durationMs: 82000, challengeTitle: 'Weekend Schedule', date: 'Demo' },
  { id: '3', name: 'Jordan K.', score: 300, durationMs: 105000, challengeTitle: 'Double Reminder', date: 'Demo' },
]

export function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (!raw) return emptyStats
    const parsed = JSON.parse(raw) as Partial<GameStats>
    return {
      bestScore: Number(parsed.bestScore) || 0,
      fastestMs: typeof parsed.fastestMs === 'number' ? parsed.fastestMs : null,
      gamesPlayed: Number(parsed.gamesPlayed) || 0,
      gamesCompleted: Number(parsed.gamesCompleted) || 0,
    }
  } catch {
    return emptyStats
  }
}

export function saveStats(stats: GameStats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch {
    // Storage may be unavailable (private mode / kiosk lockdown); gameplay still works.
  }
}

export function recordResult(prev: GameStats, score: number, completed: boolean, durationMs: number): GameStats {
  return {
    bestScore: Math.max(prev.bestScore, score),
    fastestMs: completed ? (prev.fastestMs === null ? durationMs : Math.min(prev.fastestMs, durationMs)) : prev.fastestMs,
    gamesPlayed: prev.gamesPlayed + 1,
    gamesCompleted: prev.gamesCompleted + (completed ? 1 : 0),
  }
}

export function loadSoundEnabled(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) !== 'off'
  } catch {
    return true
  }
}

export function saveSoundEnabled(enabled: boolean) {
  try {
    localStorage.setItem(SOUND_KEY, enabled ? 'on' : 'off')
  } catch {
    // ignore
  }
}

export function loadLanguage(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved === 'en' || saved === 'vi') return saved
    return 'en'
  } catch {
    return 'en'
  }
}

export function saveLanguage(lang: Lang) {
  try {
    localStorage.setItem(LANG_KEY, lang)
  } catch {
    // ignore
  }
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY)
    if (!raw) return INITIAL_LEADERBOARD
    const parsed = JSON.parse(raw) as LeaderboardEntry[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_LEADERBOARD
  } catch {
    return INITIAL_LEADERBOARD
  }
}

export function saveLeaderboard(list: LeaderboardEntry[]) {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list))
  } catch {
    // ignore
  }
}

export function addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'date'>): LeaderboardEntry[] {
  const current = loadLeaderboard()
  const now = new Date()
  const dateStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: String(Date.now()),
    date: dateStr,
  }
  const next = [...current, newEntry]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.durationMs - b.durationMs
    })
    .slice(0, 15) // Keep top 15
  saveLeaderboard(next)
  return next
}

export function clearLeaderboard(): LeaderboardEntry[] {
  try {
    localStorage.removeItem(LEADERBOARD_KEY)
  } catch {
    // ignore
  }
  return []
}
