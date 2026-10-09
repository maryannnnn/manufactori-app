import { contact, getTelegramUrl, getWhatsAppUrl } from '@/config/contact'

export type FooterChannelValues = {
  linkedin?: string | null
  facebook?: string | null
  whatsapp?: string | null
  telegram?: string | null
  email?: string | null
  phone?: string | null
}

export type FooterChannelLink = {
  id: 'linkedin' | 'facebook' | 'whatsapp' | 'telegram' | 'email' | 'phone'
  label: string
  href: string
  external: boolean
}

const trim = (value?: string | null): string => value?.trim() || ''

const asHttpsUrl = (value: string): string => {
  if (/^https?:\/\//i.test(value)) return value
  if (value.startsWith('//')) return `https:${value}`
  return `https://${value}`
}

const linkedinHref = (value?: string | null): string | null => {
  const raw = trim(value)
  if (!raw) return null
  if (/linkedin\.com/i.test(raw) || /^https?:\/\//i.test(raw)) return asHttpsUrl(raw)
  return null
}

const facebookHref = (value?: string | null): string | null => {
  const raw = trim(value)
  if (!raw) return null
  if (/facebook\.com|fb\.com/i.test(raw) || /^https?:\/\//i.test(raw)) return asHttpsUrl(raw)
  return null
}

const whatsappHref = (value?: string | null): string | null => {
  const raw = trim(value)
  if (!raw) return getWhatsAppUrl()
  if (/^https?:\/\//i.test(raw) || /wa\.me/i.test(raw)) return asHttpsUrl(raw)
  const digits = raw.replace(/\D/g, '')
  if (digits.length >= 8) return `https://wa.me/${digits}`
  return getWhatsAppUrl()
}

const telegramHref = (value?: string | null): string | null => {
  const raw = trim(value)
  if (!raw) return getTelegramUrl()
  if (/^https?:\/\//i.test(raw) || /t\.me\//i.test(raw)) return asHttpsUrl(raw)
  const username = raw.replace(/^@/, '')
  if (/^[a-zA-Z0-9_]{5,32}$/.test(username)) return `https://t.me/${username}`
  return getTelegramUrl()
}

const emailHref = (value?: string | null): string | null => {
  const raw = trim(value)
  if (!raw) return null
  if (/^mailto:/i.test(raw)) return raw
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return `mailto:${raw}`
  return null
}

const phoneHref = (value?: string | null): string | null => {
  const raw = trim(value)
  if (!raw) return `tel:${contact.displayPhone}`
  if (/^tel:/i.test(raw)) return raw
  const tel = raw.replace(/[^\d+]/g, '')
  if (tel.replace(/\D/g, '').length >= 8) return `tel:${tel}`
  return `tel:${contact.displayPhone}`
}

export const resolveFooterChannels = (channels?: FooterChannelValues | null): FooterChannelLink[] => {
  const items: Array<[FooterChannelLink['id'], string, string | null, boolean]> = [
    ['linkedin', 'LinkedIn', linkedinHref(channels?.linkedin), true],
    ['facebook', 'Facebook', facebookHref(channels?.facebook), true],
    ['whatsapp', 'WhatsApp', whatsappHref(channels?.whatsapp), true],
    ['telegram', 'Telegram', telegramHref(channels?.telegram), true],
    ['email', 'Email', emailHref(channels?.email), false],
    ['phone', 'Phone', phoneHref(channels?.phone), false],
  ]

  return items.flatMap(([id, label, href, external]) =>
    href ? [{ id, label, href, external }] : [],
  )
}
