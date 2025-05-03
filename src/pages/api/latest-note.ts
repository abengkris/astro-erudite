export const prerender = false;
import type { APIRoute } from 'astro';
import { nip19, Relay } from 'nostr-tools';
import { useWebSocketImplementation } from 'nostr-tools/relay';
import WebSocket from 'ws';

export type NostrEvent = {
	id: string;
	pubkey: string;
	created_at: number;
	kind: number;
	tags: string[][];
	content: string;
	sig: string;
};

const RELAYS = [
	'wss://relay.nostr.band',
	'wss://relay.damus.io',
	'wss://nos.lol',
];

// Setup WebSocket for node environment
if (typeof WebSocket !== 'function') {
	useWebSocketImplementation(WebSocket);
}

async function connectToRelay(): Promise<Relay> {
	const connections = await Promise.allSettled(RELAYS.map(url => Relay.connect(url)));

	for (const result of connections) {
		if (result.status === 'fulfilled') return result.value;
	}
	throw new Error('Failed to connect to any relay.');
}

async function fetchLatestNote(hexPubKey: string): Promise<NostrEvent> {
	const relay = await connectToRelay();

	return new Promise<NostrEvent>((resolve, reject) => {
		const timeout = setTimeout(() => {
			sub.close();
			relay.close();
			reject(new Error('Request aborted due to timeout'));
		}, 10000);

		const sub = relay.subscribe([{ kinds: [1], authors: [hexPubKey], limit: 1 }], {
			onevent(event) {
				clearTimeout(timeout);
				sub.close();
				relay.close();
				resolve(event);
			},
		});
	});
}

function getNevent(eventId: string): string {
	try {
		return nip19.noteEncode(eventId);
	} catch (e) {
		console.error('Invalid event ID for noteEncode:', eventId);
		return '';
	}
}

export function formatDateNostr(timestamp: number, timeZone = 'Asia/Jakarta'): string {
	if (!timestamp || isNaN(timestamp)) return 'Invalid date';

	const now = Math.floor(Date.now() / 1000);
	const diff = now - timestamp;

	const plural = (n: number, unit: string) => `${n} ${unit}${n !== 1 ? 's' : ''} ago`;

	if (diff < 60) return 'just now';
	if (diff < 3600) return plural(Math.floor(diff / 60), 'minute');
	if (diff < 86400) return plural(Math.floor(diff / 3600), 'hour');
	if (diff < 604800) return plural(Math.floor(diff / 86400), 'day');
	if (diff < 31536000) return plural(Math.floor(diff / 604800), 'week');

	return new Date(timestamp * 1000).toLocaleString('id-ID', {
		timeZone,
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	});
}

export const GET: APIRoute = async ({ url }) => {
	const headers = { 'Content-Type': 'application/json' };
	const hexPubKey = url.searchParams.get('hexpubkey');

	if (!hexPubKey) {
		return new Response(JSON.stringify({ status: 400, error: 'Missing required parameter: hexpubkey' }), {
			status: 400,
			headers,
		});
	}

	try {
		const latestNote = await fetchLatestNote(hexPubKey);
		const nevent = getNevent(latestNote.id);
		const formattedDate = formatDateNostr(latestNote.created_at);

		return new Response(JSON.stringify({ latestNote, nevent, formattedDate }), {
			status: 200,
			headers,
		});
	} catch (error) {
		const message =
			error instanceof Error && error.message
				? error.message
				: 'Unexpected error occurred.';

		console.error('API Error:', message);

		return new Response(JSON.stringify({ error: message }), {
			status: 500,
			headers,
		});
	}
};