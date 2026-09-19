import React from 'react'

const metrics = [
  { label: 'Organic sessions', value: '+142%' },
  { label: 'Qualified RFQs', value: '3.4x' },
  { label: 'Indexed product pages', value: '1,860' },
] as const

/**
 * Renders the current palette across the interface primitives the real site
 * will be built from, so a palette can be judged as a working UI rather than as
 * five swatches. Uses semantic tokens only.
 */
export const ComponentPreview: React.FC = () => {
  return (
    <section aria-labelledby="component-preview-heading" className="border-t border-default py-16">
      <div className="container">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">Component Preview</p>
        <h2
          className="mt-3 text-2xl font-semibold tracking-tight text-heading md:text-3xl"
          id="component-preview-heading"
        >
          The palette as an interface
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Typography + actions */}
          <div className="rounded-lg border border-default bg-surface p-6">
            <span className="inline-flex items-center rounded-full bg-cta px-3 py-1 text-xs font-medium uppercase tracking-wider text-on-cta">
              Capability
            </span>

            <h3 className="mt-5 text-xl font-semibold tracking-tight text-heading">
              Precision sheet metal fabrication
            </h3>

            <p className="mt-3 text-sm leading-6 text-main">
              Body copy sits on the surface token and stays at AAA contrast in every palette. It
              carries the technical detail an engineer actually reads before requesting a quote.
            </p>

            <p className="mt-3 text-sm leading-6 text-muted">
              Muted text handles metadata, captions and secondary specifications.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                className="rounded-md bg-cta px-4 py-2 text-sm font-medium text-on-cta transition-colors hover:bg-cta-hover active:bg-cta-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                type="button"
              >
                Request a quote
              </button>

              <button
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary-hover active:bg-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                type="button"
              >
                Download specs
              </button>

              <button
                className="rounded-md border border-border-strong px-4 py-2 text-sm font-medium text-heading transition-colors hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                type="button"
              >
                Outline
              </button>
            </div>

            <hr className="my-6 border-default" />

            <p className="text-sm text-main">
              Inline navigation uses the link token:{' '}
              <a
                className="text-link underline underline-offset-4 transition-colors hover:text-link-hover"
                href="#component-preview-heading"
              >
                view the tolerance table
              </a>
              .
            </p>
          </div>

          {/* Metrics + form */}
          <div className="flex flex-col gap-6">
            <div className="rounded-lg border border-default bg-surface p-6">
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted">
                Programme results
              </h3>

              <dl className="mt-5 grid grid-cols-3 gap-4">
                {metrics.map((metric) => (
                  <div key={metric.label}>
                    <dt className="text-xs leading-5 text-muted">{metric.label}</dt>
                    <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-heading">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <form className="rounded-lg border border-default bg-surface p-6">
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted">
                Enquiry form
              </h3>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-heading" htmlFor="preview-company">
                    Company
                  </label>
                  <input
                    className="mt-2 w-full rounded-md border border-border-strong bg-body px-3 py-2 text-sm text-main placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                    id="preview-company"
                    name="company"
                    placeholder="Laser Made Manufacturing"
                    type="text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-heading" htmlFor="preview-volume">
                    Annual volume
                  </label>
                  <input
                    className="mt-2 w-full rounded-md border border-border-strong bg-body px-3 py-2 text-sm text-main placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                    id="preview-volume"
                    name="volume"
                    placeholder="12,000 units"
                    type="text"
                  />
                </div>

                <p className="text-xs leading-5 text-muted">
                  Preview only. This form is not wired to a submission endpoint.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
