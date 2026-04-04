// The file downloads only works in production environments, not in development mode!

import { ApiError, parseErrorMessage } from "./errors";

const API_BASE = "/api/download";

async function readStream(
  res: Response,
  onChunk: (chunk: Uint8Array) => Promise<void> | void,
  onProgress: (progress: number) => void,
): Promise<void> {
  const total = Number(res.headers.get("Content-Length")) || null;
  const reader = res.body?.getReader();
  if (!reader) throw new Error("No readable stream");

  let received = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      await onChunk(value);
      received += value.byteLength;
      if (total) onProgress(Math.round((received / total) * 100));
    }
  } finally {
    reader.releaseLock();
  }
}

export async function fetchFile(
  url: string,
  signal: AbortSignal,
): Promise<Response> {
  const res = await fetch(`${API_BASE}/${url}`, { signal });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(parseErrorMessage(res, body));
  }
  return res;
}

// Only working in prod mode
export async function streamToDisk(
  res: Response,
  writable: FileSystemWritableFileStream,
  onProgress: (p: number) => void,
): Promise<void> {
  await readStream(
    res,
    (chunk) => writable.write(chunk.buffer.slice(0) as ArrayBuffer),
    onProgress,
  );
}

// Only working in prod mode
export async function streamToBlob(
  res: Response,
  onProgress: (p: number) => void,
): Promise<Blob> {
  const total = Number(res.headers.get("Content-Length")) || null;

  if (!total) {
    return res.blob();
  }

  const chunks: Uint8Array<ArrayBuffer>[] = [];
  await readStream(res, (chunk) => { chunks.push(new Uint8Array(chunk)); }, onProgress);
  return new Blob(chunks, { type: "application/octet-stream" });
}