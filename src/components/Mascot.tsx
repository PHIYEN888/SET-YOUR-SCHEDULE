interface MascotProps {
  variant?: 'wave' | 'celebrate'
  className?: string
  floating?: boolean
}

export function Mascot({ variant = 'wave', className = '', floating = true }: MascotProps) {
  return (
    <div className={`relative aspect-square overflow-hidden ${floating ? 'animate-float' : ''} ${className}`}>
      <img
        src={variant === 'celebrate' ? '/images/mascot-celebrate.png' : '/images/mascot.png'}
        alt={variant === 'celebrate' ? 'PillMate robot mascot celebrating' : 'PillMate robot mascot waving hello'}
        className="size-full object-cover mix-blend-multiply"
        draggable={false}
      />
    </div>
  )
}
