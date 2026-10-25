import React from 'react'

/** One Google tag for the public site. Do not render this component twice. */
export const GA_MEASUREMENT_ID = 'G-8QWJMFZX57'

const gaSnippet = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');
`

/** Official gtag snippet, once, at the start of the public document head. */
export const GoogleAnalytics: React.FC = () => {
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
      <script dangerouslySetInnerHTML={{ __html: gaSnippet }} />
    </>
  )
}
