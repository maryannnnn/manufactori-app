import React from 'react'

const goodFit = [
  'Manufacturers',
  'Industrial companies',
  'Engineering businesses',
  'Technical B2B companies',
  'Companies with complex products or long sales cycles',
] as const

const notAFit = [
  'Businesses looking for generic social media posting only',
  'Companies expecting instant results without strategic work',
  'Projects where marketing has no connection to sales or business goals',
] as const

export const HomeFit: React.FC = () => {
  return (
    <section className="border-b border-border py-16 md:py-20">
      <div className="container">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Is This a Good Fit?
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="border border-border bg-card p-6">
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Good fit for
            </h3>
            <ul className="mt-5 space-y-3">
              {goodFit.map((item) => (
                <li className="text-sm leading-6 text-foreground" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-border bg-card p-6">
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Not a fit for
            </h3>
            <ul className="mt-5 space-y-3">
              {notAFit.map((item) => (
                <li className="text-sm leading-6 text-muted-foreground" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
