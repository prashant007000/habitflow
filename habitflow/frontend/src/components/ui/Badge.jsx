import clsx from 'clsx'

const variants = {
  violet: 'bg-accent-violet/15 text-accent-violet border-accent-violet/30',
  amber: 'bg-accent-amber/15 text-accent-amber border-accent-amber/30',
  green: 'bg-accent-green/15 text-accent-green border-accent-green/30',
  red: 'bg-accent-red/15 text-accent-red border-accent-red/30',
  neutral: 'bg-base-700/60 text-ink-dim border-base-border',
}

export default function Badge({ children, variant = 'neutral', className }) {
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}
