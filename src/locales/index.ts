import { en } from './en'
import type { Lang, Translation } from './types'
import { vi } from './vi'

export * from './types'
export { en } from './en'
export { vi } from './vi'

export const translations: Record<Lang, Translation> = {
  en,
  vi,
}

export function getTranslation(lang: Lang = 'en'): Translation {
  return translations[lang] || translations.en
}
