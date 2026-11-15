import Image from 'next/image'
import React from 'react'

type Props = {
  title: string
}

/** Canonical About bio — LinkedIn / resume profile text. */
const ABOUT_BIO = [
  'Manufacturing Marketing Strategist and Web Developer with 20+ years in B2B digital marketing, SEO and web development, specializing in manufacturing, industrial equipment, engineering and technically complex products. I help manufacturing companies reach technical buyers and generate qualified business inquiries in European and US markets.',
  'My expertise combines industrial market positioning, technical SEO, performance advertising, AI Search Optimization (GEO/AEO), technical content strategy and modern web development (Next.js, React, TypeScript, Payload CMS). I use AI platforms for research, development and content, with expert review of every result.',
  "With a Master's degree in Computer-Aided Design Systems (CAD), I understand both the technical complexity of industrial products and the digital marketing systems needed to bring them to market. Results include +35% organic traffic and +40% search rankings for export-oriented manufacturers.",
] as const

/**
 * About intro: portrait on the left, heading and bio on the right — same
 * two-column composition as the homepage hero.
 */
export const AboutHero: React.FC<Props> = ({ title }) => {
  return (
    <section className="border-b border-border">
      <div className="container py-10 md:py-14">
        <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="relative min-h-[320px] overflow-hidden bg-card sm:min-h-[420px] lg:min-h-full">
            <Image
              alt="Maryan Polyak"
              className="object-cover object-[center_20%]"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              src="/media/maryan-polyak-about.jpg"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Maryan Polyak
            </p>
            <p className="mt-3 text-base font-medium text-foreground md:text-lg">
              Manufacturing Marketing Strategist
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl">
              {title}
            </h1>
            <div className="mt-6 space-y-4 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              {ABOUT_BIO.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
