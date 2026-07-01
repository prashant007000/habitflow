import clsx from 'clsx'

export default function GlassCard({
  children,
  className,
  hover = false,
  ...props
}) {
  return (
    <div
      className={clsx(
        `
        rounded-3xl
        border
        border-zinc-900
        bg-[#0A0A0A]
        p-6
        shadow-[0_0_30px_rgba(255,255,255,0.02)]
        transition-all
        duration-200
        `,
        hover &&
          `
          hover:scale-[1.02]
          hover:border-zinc-800
          `,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}