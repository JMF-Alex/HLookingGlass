import { type NextRequest, NextResponse } from "next/server";
import { randomFill } from "crypto";
import { checkRateLimit } from "@/lib/rate-limit";
import { DOWNLOAD_PRESETS, type DownloadPreset, RATE_LIMIT, CHUNK_SIZE } from "@/config/download";

type Params = Promise<{ size: string }>;

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isValidPreset(size: string): size is DownloadPreset {
  return size in DOWNLOAD_PRESETS;
}

function randomFillAsync(buffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    randomFill(buffer, (err, buf) => (err ? reject(err) : resolve(buf)))
  );
}

function createRandomStream(totalBytes: number): ReadableStream<Uint8Array> {
  let remaining = totalBytes;
  const reusableChunk = Buffer.allocUnsafe(CHUNK_SIZE);

  return new ReadableStream<Uint8Array>(
    {
      async pull(controller) {
        if (remaining <= 0) {
          controller.close();
          return;
        }

        const chunkSize = Math.min(CHUNK_SIZE, remaining);
        const chunk = chunkSize === CHUNK_SIZE ? reusableChunk : Buffer.allocUnsafe(chunkSize);

        await randomFillAsync(chunk);

        controller.enqueue(new Uint8Array(chunk.buffer, 0, chunkSize));
        remaining -= chunkSize;
      },
    },
    new CountQueuingStrategy({ highWaterMark: 1 }),
  );
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const ip = getIp(req);
  const rl = checkRateLimit(ip, RATE_LIMIT);

  if (!rl.allowed) {
    const retryAfter = Math.ceil(rl.retryAfterMs / 1000);
    return NextResponse.json(
      { error: "Too many requests", retryAfter },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(RATE_LIMIT.maxRequests),
        },
      }
    );
  }

  const { size } = await params;

  if (!isValidPreset(size)) {
    return NextResponse.json(
      { error: "Invalid size", available: Object.keys(DOWNLOAD_PRESETS) },
      { status: 400 }
    );
  }

  const totalBytes = DOWNLOAD_PRESETS[size] * 1024 * 1024;

  return new Response(createRandomStream(totalBytes), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(totalBytes),
      "Content-Disposition": `attachment; filename="test-${size}.bin"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}