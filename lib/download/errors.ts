export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiErrorBody {
  error?: string;
  retryAfter?: number | string;
}

export function parseErrorMessage(res: Response, body: ApiErrorBody): string {
  if (res.status === 429)
    return `Too many requests — retry in ${body.retryAfter ?? "?"}s`;
  return body.error ?? `Error ${res.status}`;
}