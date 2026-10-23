/**
 * Single source for public messaging contact across the site.
 * Change the number or Telegram destination here — not in page templates.
 */

export const contact = {
  /** E.164 display form, including the leading plus. */
  displayPhone: '+972538974802',
  /** Digits only, no plus or spaces — required by wa.me. */
  whatsappPhone: '972538974802',
  defaultMessage: 'Hello, I would like to discuss digital marketing for my manufacturing business.',
  /**
   * Public Telegram username without @.
   * Leave empty until a real username exists. Do not invent one.
   */
  telegramUsername: '',
  /**
   * Verified destination already stored on the footer contact link.
   * This is a phone-based t.me URL, not a username, and it does not take a prefilled message.
   */
  telegramUrl: 'https://t.me/+972538974802',
} as const

export const getWhatsAppUrl = (message: string = contact.defaultMessage): string => {
  const base = `https://wa.me/${contact.whatsappPhone}`
  const text = message.trim()
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

export const getTelegramUrl = (): string | null => {
  const explicit = contact.telegramUrl.trim()
  if (explicit) return explicit

  const username = contact.telegramUsername.trim().replace(/^@/, '')
  if (username) return `https://t.me/${username}`

  return null
}
