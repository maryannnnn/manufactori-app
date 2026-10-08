import React from 'react'

const problems = [
  {
    heading: 'The website describes production, not demand',
    body: 'Your website explains what you manufacture, but it does not generate enough qualified inquiries.',
  },
  {
    heading: 'Expertise stays inside the sales team',
    body: 'Your sales team knows the products, but the website and marketing do not communicate that expertise clearly.',
  },
  {
    heading: 'Channels work as separate pieces',
    body: 'You are investing in SEO, advertising or content, but the pieces are not working together as one system.',
  },
] as const

export const HomeProblems: React.FC = () => {
  return (
    <section className="border-b border-border py-16 md:py-20">
      <div className="container">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Does This Sound Like Your Company?
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {problems.map((item) => (
            <article className="border border-border bg-card p-6" key={item.heading}>
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                {item.heading}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
