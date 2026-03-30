/** Client-safe: parse JSON error body from chat API responses. */
export async function parseChatFetchError(res: Response): Promise<string> {
  const data = (await res.json().catch(() => ({}))) as { error?: string; hint?: string };
  const base =
    typeof data.error === "string" ? data.error : `Request failed (${res.status})`;
  const hint = typeof data.hint === "string" ? data.hint : "";
  return hint ? `${base} ${hint}` : base;
}
