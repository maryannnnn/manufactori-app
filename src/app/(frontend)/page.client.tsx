'use client'

import { useEffect } from 'react'

const PageClient = () => {
  useEffect(() => {
    document.documentElement.dataset.landing = 'true'

    return () => {
      delete document.documentElement.dataset.landing
    }
  }, [])

  return null
}

export default PageClient
