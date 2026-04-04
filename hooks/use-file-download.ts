// The file downloads only works in production environments, not in development mode!

"use client";

import { useState, useCallback, useRef, useEffect } from "react";

import { TEST_FILES } from "@/lib/data";
import { ApiError, fetchFile, streamToDisk, streamToBlob, supportsFilePicker, triggerBlobDownload } from "@/lib/download";

export type DownloadState =
  | { status: "idle" }
  | { status: "downloading"; progress: number }
  | { status: "error"; message: string };

type DownloadStates = Record<string, DownloadState>;

export function useFileDownload() {
  const [states, setStates] = useState<DownloadStates>(() =>
    Object.fromEntries<DownloadState>(
      TEST_FILES.map((f) => [f.url, { status: "idle" }]),
    ),
  );

  const inFlightRef = useRef<Set<string>>(new Set());
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const handleUnload = () => {
      abortControllersRef.current.forEach((c) => c.abort());
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      mountedRef.current = false;
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const setFileState = useCallback((url: string, state: DownloadState) => {
    setStates((prev) => ({ ...prev, [url]: state }));
  }, []);

  const download = useCallback(
    async (url: string, filename: string) => {
      if (inFlightRef.current.has(url)) return;

      inFlightRef.current.add(url);
      const controller = new AbortController();
      abortControllersRef.current.set(url, controller);

      setFileState(url, { status: "downloading", progress: 0 });

      const onProgress = (progress: number) =>
        setFileState(url, { status: "downloading", progress });

      try {
        if (supportsFilePicker()) {
          const fileHandle = await window.showSaveFilePicker({
            suggestedName: filename,
            types: [
              {
                description: "Binary file",
                accept: { "application/octet-stream": [".bin"] },
              },
            ],
          });

          const writable = await fileHandle.createWritable();
          try {
            const res = await fetchFile(url, controller.signal);
            await streamToDisk(res, writable, onProgress);
            await writable.close();
          } catch (err) {
            await writable.abort();
            throw err;
          }
        } else {
          const res = await fetchFile(url, controller.signal);
          const blob = await streamToBlob(res, onProgress);
          triggerBlobDownload(blob, filename);
        }

        setFileState(url, { status: "idle" });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          if (mountedRef.current) setFileState(url, { status: "idle" });
          return;
        }
        if (!mountedRef.current) return;
        const message = err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Download failed";
        setFileState(url, { status: "error", message });
      } finally {
        inFlightRef.current.delete(url);
        abortControllersRef.current.delete(url);
      }
    },
    [setFileState],
  );

  const reset = useCallback(
    (url: string) => setFileState(url, { status: "idle" }),
    [setFileState],
  );

  return { states, download, reset };
}