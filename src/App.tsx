import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { AppHeader } from './components/AppHeader'
import { ChallengeCardDeck } from './components/ChallengeCardDeck'
import { HowToPlayModal } from './components/HowToPlayModal'
import { LeaderboardModal } from './components/LeaderboardModal'
import { ReminderSetupForm } from './components/ReminderSetupForm'
import { ReminderTestPanel } from './components/ReminderTestPanel'
import { ResultScreen } from './components/ResultScreen'
import { ScheduleMatchingBoard } from './components/ScheduleMatchingBoard'
import { Button } from './components/ui/Button'
import { Modal } from './components/ui/Modal'
import { WelcomeScreen } from './components/WelcomeScreen'
import { shuffleChallenges } from './game/challenges'
import type { Lang } from './game/i18n'
import { translations } from './game/i18n'
import { scoreFor, TIME_LIMIT_MS } from './game/logic'
import { gameReducer, initialGameState, isPlaying } from './game/reducer'
import { sounds } from './game/sound'
import {
  addLeaderboardEntry,
  clearLeaderboard,
  emptyStats,
  loadLanguage,
  loadLeaderboard,
  loadSoundEnabled,
  loadStats,
  recordResult,
  saveLanguage,
  saveSoundEnabled,
  saveStats,
  type GameStats,
  type LeaderboardEntry,
} from './game/storage'
import type { ReminderConfig } from './game/types'
import { useCountdown } from './hooks/useCountdown'

type Confirm = 'restart' | 'home' | 'reset-stats' | null

interface ResultMeta {
  gameId: number
  isNewBest: boolean
  isFastest: boolean
}

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState)
  const [stats, setStats] = useState<GameStats>(loadStats)
  const [soundOn, setSoundOn] = useState(loadSoundEnabled)
  const [lang, setLang] = useState<Lang>(loadLanguage)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(loadLeaderboard)
  const [howToOpen, setHowToOpen] = useState(false)
  const [leaderboardOpen, setLeaderboardOpen] = useState(false)
  const [confirm, setConfirm] = useState<Confirm>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [resultMeta, setResultMeta] = useState<ResultMeta | null>(null)
  const recordedGameRef = useRef<number | null>(null)

  const t = translations[lang]
  const playing = isPlaying(state)
  const score = scoreFor(state.completed)

  const soundOnRef = useRef(soundOn)
  soundOnRef.current = soundOn
  const play = useCallback((name: keyof typeof sounds) => {
    if (soundOnRef.current) sounds[name]()
  }, [])

  const handleTimeout = useCallback(() => {
    dispatch({ type: 'TIMEOUT', now: Date.now() })
  }, [])

  const remainingMs = Math.min(TIME_LIMIT_MS, useCountdown(state.deadline, playing, handleTimeout))

  useEffect(() => {
    if (state.phase !== 'result' || state.outcome === null || recordedGameRef.current === state.gameId) return
    recordedGameRef.current = state.gameId
    const completed = state.outcome === 'completed'
    const duration = (state.finishedAt ?? 0) - (state.startedAt ?? 0)
    const finalScore = scoreFor(state.completed)
    const next = recordResult(stats, finalScore, completed, duration)
    saveStats(next)
    setStats(next)
    setResultMeta({
      gameId: state.gameId,
      isNewBest: finalScore > 0 && finalScore > stats.bestScore,
      isFastest: completed && (stats.fastestMs === null || duration < stats.fastestMs),
    })
    if (completed) play('fanfare')
    else play('error')
  }, [state.phase, state.outcome, state.gameId, state.finishedAt, state.startedAt, state.completed, stats, play])

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [state.phase])

  const startGame = useCallback(() => {
    setHowToOpen(false)
    setConfirm(null)
    setResultMeta(null)
    play('tap')
    dispatch({ type: 'START', deck: shuffleChallenges(), now: Date.now() })
  }, [play])

  const goHome = useCallback(() => {
    setConfirm(null)
    setLeaderboardOpen(false)
    setResultMeta(null)
    dispatch({ type: 'GO_HOME' })
  }, [])

  const toggleSound = () => {
    setSoundOn((prev) => {
      const next = !prev
      saveSoundEnabled(next)
      if (next) sounds.tap()
      return next
    })
  }

  const toggleLanguage = () => {
    setLang((prev) => {
      const next = prev === 'vi' ? 'en' : 'vi'
      saveLanguage(next)
      return next
    })
  }

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.().catch(() => undefined)
  }

  const handleFail = useCallback(() => {
    play('error')
    dispatch({ type: 'ATTEMPT_FAILED' })
  }, [play])

  const handleSetupSuccess = useCallback(
    (reminder: ReminderConfig) => {
      play('success')
      dispatch({ type: 'SETUP_SUCCESS', reminder })
    },
    [play],
  )

  const handleMatchSuccess = useCallback(() => {
    play('success')
    dispatch({ type: 'MATCH_SUCCESS' })
  }, [play])

  const handleTestSuccess = useCallback(() => {
    play('success')
    dispatch({ type: 'TEST_SUCCESS' })
  }, [play])

  const handleSaveToLeaderboard = useCallback(
    (name: string) => {
      const duration = (state.finishedAt ?? 0) - (state.startedAt ?? 0)
      const finalScore = scoreFor(state.completed)
      const challengeTitle =
        (state.challenge ? t.challenges[state.challenge.id]?.title : null) ?? state.challenge?.title ?? 'Challenge'
      const updated = addLeaderboardEntry({
        name,
        score: finalScore,
        durationMs: duration,
        challengeTitle,
      })
      setLeaderboard(updated)
      play('success')
    },
    [state.finishedAt, state.startedAt, state.completed, state.challenge, t, play],
  )

  const handleClearLeaderboard = useCallback(() => {
    const cleared = clearLeaderboard()
    setLeaderboard(cleared)
  }, [])

  const confirmCopy: Record<Exclude<Confirm, null>, { title: string; body: string; action: string; onConfirm: () => void }> = {
    restart: {
      title: t.confirmRestartTitle,
      body: t.confirmRestartBody,
      action: t.confirmRestartAction,
      onConfirm: startGame,
    },
    home: {
      title: t.confirmHomeTitle,
      body: t.confirmHomeBody,
      action: t.confirmHomeAction,
      onConfirm: goHome,
    },
    'reset-stats': {
      title: t.confirmResetStatsTitle,
      body: t.confirmResetStatsBody,
      action: t.confirmResetStatsAction,
      onConfirm: () => {
        saveStats(emptyStats)
        setStats(emptyStats)
        setConfirm(null)
      },
    },
  }

  const activeConfirm = confirm ? confirmCopy[confirm] : null

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader
        phase={state.phase}
        playing={playing}
        score={score}
        remainingMs={remainingMs}
        soundOn={soundOn}
        isFullscreen={isFullscreen}
        lang={lang}
        onToggleSound={toggleSound}
        onToggleFullscreen={toggleFullscreen}
        onToggleLanguage={toggleLanguage}
        onOpenLeaderboard={() => setLeaderboardOpen(true)}
        onRestart={() => setConfirm('restart')}
        onHome={() => (playing ? setConfirm('home') : goHome())}
      />

      <main className="flex flex-1 flex-col" key={`${state.gameId}-${state.phase}`}>
        <div className="flex flex-1 flex-col animate-fade-up">
          {state.phase === 'welcome' && (
            <WelcomeScreen
              stats={stats}
              lang={lang}
              onStart={startGame}
              onHowToPlay={() => setHowToOpen(true)}
              onLeaderboard={() => setLeaderboardOpen(true)}
              onResetStats={() => setConfirm('reset-stats')}
            />
          )}

          {state.phase === 'draw' && (
            <ChallengeCardDeck
              challenge={state.challenge}
              lang={lang}
              onDraw={(idx) => {
                play('tap')
                dispatch({ type: 'DRAW', cardIndex: idx })
              }}
              onRedraw={() => {
                play('tap')
                dispatch({ type: 'REDRAW', deck: shuffleChallenges() })
              }}
              onAccept={() => {
                play('tap')
                dispatch({ type: 'ACCEPT_CHALLENGE' })
              }}
            />
          )}

          {state.phase === 'setup' && state.challenge && (
            <ReminderSetupForm
              challenge={state.challenge}
              completed={state.completed.setup}
              lang={lang}
              onSuccess={handleSetupSuccess}
              onFail={handleFail}
              onNext={() => dispatch({ type: 'NEXT_STEP' })}
            />
          )}

          {state.phase === 'match' && state.challenge && state.reminder && (
            <ScheduleMatchingBoard
              challenge={state.challenge}
              reminder={state.reminder}
              completed={state.completed.match}
              lang={lang}
              onSuccess={handleMatchSuccess}
              onFail={handleFail}
              onNext={() => dispatch({ type: 'NEXT_STEP' })}
              onTap={() => play('tap')}
            />
          )}

          {state.phase === 'test' && state.reminder && (
            <ReminderTestPanel
              reminder={state.reminder}
              completed={state.completed.test}
              soundOn={soundOn}
              lang={lang}
              onToggleSound={toggleSound}
              onRing={() => play('reminder')}
              onSuccess={handleTestSuccess}
              onFinish={() => dispatch({ type: 'FINISH', now: Date.now() })}
            />
          )}

          {state.phase === 'result' && state.outcome && (
            <ResultScreen
              outcome={state.outcome}
              score={score}
              completed={state.completed}
              durationMs={(state.finishedAt ?? 0) - (state.startedAt ?? 0)}
              failedAttempts={state.failedAttempts}
              challenge={state.challenge}
              isNewBest={resultMeta?.gameId === state.gameId && resultMeta.isNewBest}
              isFastest={resultMeta?.gameId === state.gameId && resultMeta.isFastest}
              lang={lang}
              onPlayAgain={startGame}
              onHome={goHome}
              onSaveLeaderboard={handleSaveToLeaderboard}
            />
          )}
        </div>
      </main>

      <footer className="px-4 py-4 text-center text-xs font-semibold text-navy/40">
        {t.footerText}
      </footer>

      <HowToPlayModal open={howToOpen} lang={lang} onClose={() => setHowToOpen(false)} onStart={startGame} />
      <LeaderboardModal
        open={leaderboardOpen}
        lang={lang}
        entries={leaderboard}
        onClose={() => setLeaderboardOpen(false)}
        onClear={handleClearLeaderboard}
      />

      <Modal
        open={activeConfirm !== null}
        onClose={() => setConfirm(null)}
        title={activeConfirm?.title ?? ''}
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="lg" onClick={() => setConfirm(null)}>
              {t.btnCancel}
            </Button>
            <Button variant="danger" size="lg" onClick={activeConfirm?.onConfirm}>
              {activeConfirm?.action}
            </Button>
          </>
        }
      >
        <p className="text-lg text-pretty text-navy/70">{activeConfirm?.body}</p>
      </Modal>
    </div>
  )
}
