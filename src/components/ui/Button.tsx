import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'success' | 'ghost' | 'danger'
type Size = 'md' | 'lg' | 'xl'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  iconRight?: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-brand text-white shadow-[0_10px_24px_-10px_rgb(36_119_212/0.7)] hover:bg-brand-dark active:translate-y-px disabled:bg-brand/40 disabled:shadow-none',
  secondary:
    'bg-white text-brand ring-2 ring-brand/20 hover:ring-brand/50 hover:bg-brand-light active:translate-y-px disabled:text-brand/40',
  success:
    'bg-success text-white shadow-[0_10px_24px_-10px_rgb(54_179_126/0.8)] hover:brightness-95 active:translate-y-px disabled:opacity-50',
  ghost: 'bg-transparent text-navy hover:bg-brand-light disabled:opacity-40',
  danger: 'bg-danger text-white hover:brightness-95 active:translate-y-px',
}

const sizes: Record<Size, string> = {
  md: 'h-11 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-14 px-6 text-base gap-2.5 rounded-2xl',
  xl: 'h-16 px-8 text-lg gap-3 rounded-2xl',
}

export function Button({ variant = 'primary', size = 'lg', icon, iconRight, className = '', children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex shrink-0 items-center justify-center font-bold tracking-wide transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:ring-brand/40 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  )
}
