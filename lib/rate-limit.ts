type Entry = { count: number; windowStart: number };

const store = new Map<string, Entry>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now - entry.windowStart > 60_000) store.delete(key);
  }
}, 5 * 60_000);

type Options = { maxRequests: number; windowMs: number };
type Result = { allowed: true } | { allowed: false; retryAfterMs: number };

export function checkRateLimit(ip: string, opts: Options): Result {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now - entry.windowStart > opts.windowMs) {
    store.set(ip, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (entry.count >= opts.maxRequests) {
    return { allowed: false, retryAfterMs: opts.windowMs - (now - entry.windowStart) };
  }

  entry.count++;
  return { allowed: true };
}