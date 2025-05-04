import { type ClassValue, clsx } from 'clsx'
import { nip19 } from 'nostr-tools'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function readingTime(html: string) {
  const textOnly = html.replace(/<[^>]+>/g, '')
  const wordCount = textOnly.split(/\s+/).length
  const readingTimeMinutes = (wordCount / 200 + 1).toFixed()
  return `${readingTimeMinutes} min read`
}

export function getNevent(eventId: string): string {
  try {
    return nip19.noteEncode(eventId)
  } catch (e) {
    console.error('Invalid event ID for noteEncode:', eventId)
    return ''
  }
}

export function formatDateNostr(
  timestamp: number,
  timeZone = 'Asia/Jakarta',
): string {
  if (!timestamp || isNaN(timestamp)) return 'Tanggal tidak valid'

  const now = Math.floor(Date.now() / 1000)
  const diff = now - timestamp

  const MENIT = 60
  const JAM = 3600
  const HARI = 86400
  const MINGGU = 604800
  const TAHUN = 31536000

  const plural = (n: number, satuan: string) =>
    `${n} ${satuan}${n > 1 ? '' : ''} yang lalu`

  if (diff < MENIT) return 'baru saja'
  if (diff < JAM) return plural(Math.floor(diff / MENIT), 'menit')
  if (diff < HARI) return plural(Math.floor(diff / JAM), 'jam')
  if (diff < MINGGU) return plural(Math.floor(diff / HARI), 'hari')
  if (diff < TAHUN) return plural(Math.floor(diff / MINGGU), 'minggu')

  return new Date(timestamp * 1000).toLocaleString('id-ID', {
    timeZone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}
