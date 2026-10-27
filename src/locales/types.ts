import type { Phase, Stage, TimeSlot, Weekday } from '../game/types'

export type Lang = 'en' | 'vi'

export interface ChallengeText {
  title: string
  schedule: string
  mission: string
}

export interface SlotInfo {
  label: string
  range: string
}

export interface AchievementText {
  title: string
  desc: string
}

export interface Translation {
  // Navigation & Header
  tagline: string
  step: string
  of: string
  score: string
  restart: string
  home: string
  mute: string
  unmute: string
  fullscreen: string
  exitFullscreen: string
  leaderboard: string
  switchLanguageTooltip: string
  languageBadge: string
  progressSteps: Record<Exclude<Phase, 'welcome'>, string>

  // Welcome Screen
  heroTitlePrefix: string
  heroTitleSuffix: string
  heroSub: string
  badgeTime: string
  badgeInteractive: string
  badgeGift: string
  btnStart: string
  btnHowToPlay: string
  btnLeaderboard: string
  bestScore: string
  fastest: string
  completedStats: string
  staffResetStats: string

  // How to Play Modal
  howToPlayTitle: string
  howToStep1Title: string
  howToStep1Desc: string
  howToStep2Title: string
  howToStep2Desc: string
  howToStep3Title: string
  howToStep3Desc: string
  howToFooter: string
  btnGotIt: string

  // Meet PillMate Modal
  meetTitle: string
  meetIntro: string
  feature1Title: string
  feature1Desc: string
  feature2Title: string
  feature2Desc: string
  feature3Title: string
  feature3Desc: string
  feature4Title: string
  feature4Desc: string
  meetFooter: string

  // Draw Phase
  drawStepBadge: string
  drawTitle: string
  drawDescActive: string
  drawDescIdle: string
  cardChallengeLabel: string
  tapToDraw: string
  btnLetsDoIt: string
  btnRedraw: string
  autoNextNote: string
  cardLockedNote: string
  missionLabel: string
  reminderTimeLabel: string
  scheduleLabel: string
  dateLabel: string
  anyDateNote: string
  mysteryCardHint: string
  drawCardAria: (index: number) => string
  tapCardToContinue: string
  challengeCardNumber: (id: number) => string

  // Setup Phase
  setupStepBadge: string
  setupTitle: string
  addTime: string
  repeatSchedule: string
  repeatDaily: string
  repeatDailyHint: string
  repeatWorkdays: string
  repeatWorkdaysHint: string
  repeatWeekends: string
  repeatWeekendsHint: string
  repeatCustom: string
  repeatCustomHint: string
  customDaysGroupAria: string
  startDate: string
  startDateHint: string
  reminderLabel: string
  reminderLabelHint: string
  reminderLabelPlaceholder: string
  btnSaveReminder: string
  btnNextStep: string
  setupSuccessTitle: string
  setupSuccessSub: string

  // Validation Messages (used by validateReminder)
  validationIncompleteTime: string
  validationNeedMoreTimes: (count: number) => string
  validationNeedFewerTimes: string
  validationDuplicateTimes: string
  validationWrongTimes: string
  validationChooseRepeat: string
  validationChooseAtLeastOneDay: string
  validationRepeatMismatch: (expected: string) => string
  validationSuccess: string

  // Time Picker component labels
  timePickerLegend: (index: number) => string
  timePickerHeading: (index: number) => string
  timePickerRemoveAria: (index: number) => string
  hourAria: (h: number) => string
  minuteAria: (m: number) => string
  periodAria: string

  // Match Phase
  matchStepBadge: string
  matchTitle: string
  matchDesc: string
  yourReminder: string
  matchTip: string
  simulationNote: string
  matchSuccessTitle: string
  matchSuccessSub: string
  btnClear: string
  btnCheckMatch: string
  organizerAriaLabel: string
  toggleAllDayAria: (day: string) => string
  toggleAllSlotAria: (slotLabel: string, range: string) => string
  compartmentAria: (day: string, slotLabel: string) => string
  matchFeedbackMissingAndExtra: (missing: number, extra: number) => string
  matchFeedbackMissing: (missing: number) => string
  matchFeedbackExtra: (extra: number) => string
  slots: Record<TimeSlot, SlotInfo>

  // Test Phase
  testStepBadge: string
  testTitle: string
  testDesc: string
  simBadge: string
  pillboxAlt: string
  simNotice: string
  configuredReminder: string
  repeatsLabel: string
  labelField: string
  noLabel: string
  soundToggle: string
  soundOnText: string
  soundMutedText: string
  btnTestNow: string
  btnTesting: string
  btnTakeDose: string
  doseTakenBadge: string
  btnFinish: string
  notificationNow: string
  notificationText: string

  // Result Phase
  resultSuccessBadge: string
  resultTimeoutBadge: string
  resultSuccessTitle: string
  resultTimeoutTitle: string
  resultSuccessDesc: string
  resultTimeoutDesc: string
  finalScore: string
  completionTime: string
  timePlayed: string
  newBestBadge: string
  fastestBadge: string
  achievementBadge: string
  giftUnlocked: string
  giftDesc: string
  completedStages: string
  timeoutTip: string
  btnPlayAgain: string
  btnTryAgain: string
  btnLearnMore: string
  btnBackHome: string
  saveToLeaderboard: string
  enterNamePlaceholder: string
  btnSaveRecord: string
  recordSaved: string
  stageLabels: Record<Stage, string>
  achievements: {
    flawless: AchievementText
    speed: AchievementText
    precision: AchievementText
    pro: AchievementText
  }

  // Leaderboard Modal
  leaderboardTitle: string
  leaderboardEmpty: string
  rankHeader: string
  nameHeader: string
  scoreHeader: string
  timeHeader: string
  missionHeader: string
  btnClearLeaderboard: string

  // Confirm Dialogs
  confirmRestartTitle: string
  confirmRestartBody: string
  confirmRestartAction: string
  confirmHomeTitle: string
  confirmHomeBody: string
  confirmHomeAction: string
  confirmResetStatsTitle: string
  confirmResetStatsBody: string
  confirmResetStatsAction: string
  btnCancel: string

  // Footer
  footerText: string

  // Weekdays & Repeat Descriptions
  weekdaysShort: Record<Weekday, string>
  weekdaysFull: Record<Weekday, string>
  repeatEveryDay: string
  repeatWeekdaysDesc: string
  repeatWeekendsDesc: string

  // Challenges (1 to 10)
  challenges: Record<number, ChallengeText>
}
