import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-2xl' }

export function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      className={`m-auto w-[calc(100%-2rem)] ${widths[size]} rounded-3xl bg-white p-0 text-navy shadow-card open:animate-pop`}
    >
      <div className="flex items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-8">
        <h2 id={titleId} className="text-2xl font-extrabold tracking-tight text-balance">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="-mt-1 -mr-2 flex size-11 items-center justify-center rounded-full text-navy/60 transition hover:bg-brand-light hover:text-navy focus-visible:ring-4 focus-visible:ring-brand/40 focus-visible:outline-none"
        >
          <X className="size-6" aria-hidden="true" />
          <span className="sr-only">Close</span>
        </button>
      </div>
      <div className="px-6 py-5 sm:px-8">{children}</div>
      {footer && <div className="flex flex-col-reverse gap-3 px-6 pb-6 sm:flex-row sm:justify-end sm:px-8 sm:pb-8">{footer}</div>}
    </dialog>
  )
}
