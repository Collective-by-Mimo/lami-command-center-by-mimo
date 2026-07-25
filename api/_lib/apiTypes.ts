/**
 * Minimal structural types for Vercel serverless handlers — avoids pulling
 * in @vercel/node as a dependency just for its request/response types.
 */
export interface ApiRequest {
  method?: string;
  body?: unknown;
}

export interface ApiResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
}
