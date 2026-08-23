import React from 'react'

const pillars = [
  {
    title: 'Industrial SEO',
    description: 'Technical visibility for complex B2B manufacturing websites and product catalogs.',
  },
  {
    title: 'Demand Generation',
    description: 'Content and campaigns that turn engineering expertise into qualified pipeline.',
  },
  {
    title: 'Brand Authority',
    description: 'Positioning for manufacturers competing in crowded global markets.',
  },
] as const

export const ComingSoonLanding: React.FC = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b10] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_at_center,black,transparent_78%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-amber-500/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[24rem] w-[24rem] translate-x-1/4 translate-y-1/4 rounded-full bg-sky-500/10 blur-3xl"
      />

      <div className="container relative z-10 flex min-h-screen flex-col justify-center py-20">
        <div className="max-w-4xl">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.24em] text-amber-200/90 backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
            </span>
            Website Under Development
          </div>

          <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-white/45">
            Manufacturing Marketing Agency
          </p>

          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-7xl">
            Growth strategy for manufacturers who sell expertise, not impulse buys.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/68 md:text-xl">
            We help industrial brands build search visibility, demand generation, and digital
            authority across complex buying cycles. A new website experience is on the way.
          </p>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {pillars.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm transition-colors hover:border-amber-300/20 hover:bg-white/6"
            >
              <h2 className="text-lg font-medium text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/60">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
          <p>Launching soon. Full site, case studies, and insights are in production.</p>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-white/35">
            Manufactori
          </p>
        </div>
      </div>
    </main>
  )
}
