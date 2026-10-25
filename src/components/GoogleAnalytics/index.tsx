import Script from 'next/script'
import React from 'react'

/** One Google tag for the public site. Do not render this component twice. */
export const GA_MEASUREMENT_ID = 'G-8QWJMFZX57'

const gaSnippet = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');
`

/**
 * Same tag as the Google snippet. It loads after the page is shown, during
 * browser idle time, so it does not compete with the first screen. The
 * page view is sent when the tag loads.
 */
export const GoogleAnalytics: React.FC = () => {
  return (
    <>
      <Script id="google-analytics" strategy="lazyOnload">
        {gaSnippet}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
    </>
  )
}
