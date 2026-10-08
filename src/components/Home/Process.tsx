import { Layers3, LineChart, Search, Target, Waypoints } from 'lucide-react'
import React from 'react'

const steps = [
  {
    number: '01',
    title: 'Discovery & Audit',
    text: 'Understand products, buyers and the current digital system.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Strategy & Positioning',
    text: 'Define how the company should appear in search and sales conversations.',
    icon: Waypoints,
  },
  {
    number: '03',
    title: 'Website & Content Architecture',
    text: 'Structure pages around services, applications and technical expertise.',
    icon: Layers3,
  },
  {
    number: '04',
    title: 'Acquisition & Lead Generation',
    text: 'Connect organic, paid and content work to qualified demand.',
    icon: Target,
  },
  {
    number: '05',
    title: 'Optimization & Growth',
    text: 'Improve the system against real enquiries and sales feedback.',
    icon: LineChart,
  },
] as const

export const HomeProcess: React.FC = () => {
  return (
    <section className="border-b border-border py-16 md:py-20">
      <div className="container">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          How We Work
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          A practical process that connects strategy, digital execution and measurable business
          goals.
        </p>
        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <li className="border border-border bg-card p-5" key={step.number}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs tracking-[0.18em] text-muted-foreground">
                    {step.number}
                  </span>
                  <Icon aria-hidden className="size-4 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-sm font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
