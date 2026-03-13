import { NextRequest, NextResponse } from "next/server";
import app from "@/src/modules/auth/api/register/route";

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const honoRequest = new Request(url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    duplex: 'half'
  } as RequestInit);

  const response = await app.fetch(honoRequest);
  
  // Convert Hono response to Next.js response
  const body = await response.text();
  const headers = new Headers(response.headers);
  
  return new NextResponse(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
