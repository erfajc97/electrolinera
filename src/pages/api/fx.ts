import type { APIRoute } from 'astro';

export const prerender = false;

type FxPayload = {
  base: 'USD';
  cop: number;
  source: string;
  updated: string;
};

const FALLBACK: FxPayload = {
  base: 'USD',
  cop: 4100,
  source: 'fallback',
  updated: new Date().toISOString(),
};

let cache: { payload: FxPayload; expires: number } | null = null;
const TTL_MS = 60 * 60 * 1000;

async function fetchRate(): Promise<FxPayload> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`bad status ${res.status}`);
    const json = (await res.json()) as { rates?: Record<string, number>; time_last_update_utc?: string };
    const cop = json?.rates?.COP;
    if (typeof cop !== 'number' || cop <= 0) throw new Error('missing COP rate');
    return {
      base: 'USD',
      cop: Math.round(cop * 100) / 100,
      source: 'open.er-api.com',
      updated: json.time_last_update_utc ?? new Date().toISOString(),
    };
  } finally {
    clearTimeout(timeout);
  }
}

export const GET: APIRoute = async () => {
  const now = Date.now();
  if (cache && cache.expires > now) {
    return json(cache.payload, 200);
  }
  try {
    const payload = await fetchRate();
    cache = { payload, expires: now + TTL_MS };
    return json(payload, 200);
  } catch {
    if (cache) return json(cache.payload, 200);
    return json(FALLBACK, 200);
  }
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=3600',
    },
  });
}
