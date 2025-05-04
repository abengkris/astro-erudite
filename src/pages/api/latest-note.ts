export const prerender = false
import type { APIRoute } from 'astro'
import { nip19 } from 'nostr-tools'

// Import the package
import NDK, { NDKEvent } from '@nostr-dev-kit/ndk'
import { formatDateNostr, getNevent } from '@/lib/utils'

// Create a new NDK instance with explicit relays
const ndk = new NDK({
  explicitRelayUrls: [
    'wss://relay.nostr.band',
    'wss://relay.damus.io',
    'wss://nos.lol',
  ],
})

// Connect the instance immediately
ndk
  .connect()
  .then(() => console.log('NDK connected'))
  .catch((e) => console.error('NDK connection error:', e))

async function fetchLatestNote(hexPubKey: string): Promise<NDKEvent> {
  return new Promise<NDKEvent>((resolve, reject) => {
    const subscription = ndk.subscribe(
      { kinds: [1], authors: [hexPubKey], limit: 1 },
      { closeOnEose: true },
    )

    subscription.on('event', (event) => {
      console.log('Received event:', event.id)
      resolve(event)
      subscription.stop()
    })

    subscription.on('eose', () => {
      console.log('Initial events loaded')
    })

    setTimeout(() => {
      subscription.stop()
      reject(new Error('Timed out waiting for event'))
    }, 5000)
  })
}

export const GET: APIRoute = async ({ url }) => {
  const headers = { 'Content-Type': 'application/json' }
  const hexPubKey = url.searchParams.get('hexpubkey')

  if (!hexPubKey) {
    return new Response(
      JSON.stringify({
        status: 400,
        error: 'Missing required parameter: hexpubkey',
      }),
      {
        status: 400,
        headers,
      },
    )
  }

  try {
    const latestNote = await fetchLatestNote(hexPubKey)
    const nevent = getNevent(latestNote.id)
    const formattedDate = formatDateNostr(latestNote.created_at)

    return new Response(JSON.stringify({ latestNote, nevent, formattedDate }), {
      status: 200,
      headers,
    })
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Unexpected error occurred.'

    console.error('API Error:', message)

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers,
    })
  }
}
