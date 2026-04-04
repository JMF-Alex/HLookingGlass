export const DOWNLOAD_PRESETS = {
  "100mb": 100,
  "1gb":   1024,
  "10gb":  10240,
} as const satisfies Record<string, number>;

export type DownloadPreset = keyof typeof DOWNLOAD_PRESETS;

export const RATE_LIMIT = {
  maxRequests: 5,
  windowMs: 60_000,
} as const;

export const CHUNK_SIZE = 64 * 1024;