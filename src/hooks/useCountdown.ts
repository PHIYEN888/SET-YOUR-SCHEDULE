import { useEffect, useRef, useState } from 'react'

/** Returns remaining ms until `deadline`. Calls `onExpire` once when it reaches zero while active. */
export function useCountdown(deadline: number | null, active: boolean, onExpire: () => void): number {
  const [now, setNow] = useState(() => Date.now())
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    if (!active || deadline === null) return
    setNow(Date.now())
    const id = window.setInterval(() => {
      const current = Date.now()
      setNow(current)
      if (current >= deadline) {
        window.clearInterval(id)
        onExpireRef.current()
      }
    }, 250)
    return () => window.clearInterval(id)
  }, [deadline, active])

  if (deadline === null) return 0
  return Math.max(0, deadline - now)
}
