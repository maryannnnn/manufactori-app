import React from 'react'

/** Central watermark copy. Not stored on Media or Case Study documents. */
export const IMAGE_WATERMARK_TEXT = 'Neolines.com'

/**
 * Soft photographic credit. Sits on the existing Media image — it does not
 * write a second file or change alt text.
 */
export const ImageWatermark: React.FC = () => (
  <span
    aria-hidden
    className="pointer-events-none absolute bottom-3 left-4 select-none font-sans text-[10px] font-normal tracking-wide text-white/55 [text-shadow:0_1px_2px_rgb(0_0_0_/_0.35)] sm:bottom-5 sm:left-7 sm:text-[11px]"
  >
    {IMAGE_WATERMARK_TEXT}
  </span>
)
