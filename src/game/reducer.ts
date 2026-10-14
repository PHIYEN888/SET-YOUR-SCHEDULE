import { TIME_LIMIT_MS } from './logic'
import type { Challenge, Outcome, Phase, ReminderConfig, Stage } from './types'

export interface GameState {
  phase: Phase
  gameId: number
  deck: Challenge[]
  challenge: Challenge | null
  reminder: ReminderConfig | null
  completed: Record<Stage, boolean>
  failedAttempts: number
  startedAt: number | null
  deadline: number | null
  finishedAt: number | null
  outcome: Outcome | null
}

export type GameAction =
  | { type: 'START'; deck: Challenge[]; now: number }
  | { type: 'DRAW'; cardIndex?: number }
  | { type: 'REDRAW'; deck: Challenge[] }
  | { type: 'ACCEPT_CHALLENGE' }
  | { type: 'SETUP_SUCCESS'; reminder: ReminderConfig }
  | { type: 'MATCH_SUCCESS' }
  | { type: 'TEST_SUCCESS' }
  | { type: 'ATTEMPT_FAILED' }
  | { type: 'NEXT_STEP' }
  | { type: 'FINISH'; now: number }
  | { type: 'TIMEOUT'; now: number }
  | { type: 'GO_HOME' }

const emptyCompleted: Record<Stage, boolean> = { setup: false, match: false, test: false }

export const initialGameState: GameState = {
  phase: 'welcome',
  gameId: 0,
  deck: [],
  challenge: null,
  reminder: null,
  completed: emptyCompleted,
  failedAttempts: 0,
  startedAt: null,
  deadline: null,
  finishedAt: null,
  outcome: null,
}

export const GAMEPLAY_PHASES: Phase[] = ['draw', 'setup', 'match', 'test']

export const isPlaying = (state: GameState) => GAMEPLAY_PHASES.includes(state.phase)

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START':
      return {
        ...initialGameState,
        phase: 'draw',
        gameId: state.gameId + 1,
        deck: action.deck,
        startedAt: action.now,
        deadline: action.now + TIME_LIMIT_MS,
      }

    case 'DRAW': {
      if (state.phase !== 'draw' || state.challenge || state.deck.length === 0) return state
      const idx = typeof action.cardIndex === 'number' && action.cardIndex >= 0 && action.cardIndex < state.deck.length ? action.cardIndex : 0
      return { ...state, challenge: state.deck[idx] }
    }

    case 'REDRAW': {
      if (state.phase !== 'draw') return state
      return { ...state, deck: action.deck, challenge: null }
    }

    case 'ACCEPT_CHALLENGE':
      if (state.phase !== 'draw' || !state.challenge) return state
      return { ...state, phase: 'setup' }

    case 'SETUP_SUCCESS':
      if (state.phase !== 'setup' || state.completed.setup) return state
      return { ...state, reminder: action.reminder, completed: { ...state.completed, setup: true } }

    case 'MATCH_SUCCESS':
      if (state.phase !== 'match' || state.completed.match) return state
      return { ...state, completed: { ...state.completed, match: true } }

    case 'TEST_SUCCESS':
      if (state.phase !== 'test' || state.completed.test) return state
      return { ...state, completed: { ...state.completed, test: true } }

    case 'ATTEMPT_FAILED':
      if (!isPlaying(state)) return state
      return { ...state, failedAttempts: state.failedAttempts + 1 }

    case 'NEXT_STEP':
      if (state.phase === 'setup' && state.completed.setup) return { ...state, phase: 'match' }
      if (state.phase === 'match' && state.completed.match) return { ...state, phase: 'test' }
      return state

    case 'FINISH': {
      const allDone = state.completed.setup && state.completed.match && state.completed.test
      if (state.phase !== 'test' || !allDone || state.deadline === null) return state
      if (action.now > state.deadline) {
        return { ...state, phase: 'result', outcome: 'timeout', finishedAt: state.deadline }
      }
      return { ...state, phase: 'result', outcome: 'completed', finishedAt: action.now }
    }

    case 'TIMEOUT':
      if (!isPlaying(state)) return state
      return { ...state, phase: 'result', outcome: 'timeout', finishedAt: state.deadline ?? action.now }

    case 'GO_HOME':
      return { ...initialGameState, gameId: state.gameId }

    default:
      return state
  }
}
