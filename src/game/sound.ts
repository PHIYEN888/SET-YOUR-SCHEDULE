let ctx: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!ctx) ctx = new Ctor()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(freq: number, start: number, duration: number, volume = 0.18, type: OscillatorType = 'sine') {
  const audio = getContext()
  if (!audio) return
  const t0 = audio.currentTime + start
  const osc = audio.createOscillator()
  const gain = audio.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  gain.gain.setValueAtTime(0, t0)
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(gain).connect(audio.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.05)
}

export const sounds = {
  tap() {
    tone(660, 0, 0.08, 0.08, 'triangle')
  },
  success() {
    tone(523.25, 0, 0.18)
    tone(659.25, 0.1, 0.18)
    tone(783.99, 0.2, 0.3)
  },
  error() {
    tone(330, 0, 0.16, 0.12, 'triangle')
    tone(262, 0.12, 0.22, 0.12, 'triangle')
  },
  reminder() {
    for (let i = 0; i < 3; i++) {
      tone(880, i * 0.6, 0.22, 0.16)
      tone(1174.66, i * 0.6 + 0.18, 0.3, 0.14)
    }
  },
  fanfare() {
    ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.12, 0.35, 0.16))
  },
}
