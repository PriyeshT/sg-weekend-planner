import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const secret = process.env.SYNC_SECRET;
  const url = new URL(request.url);
  const provided = url.searchParams.get("secret");
  const authHeader = request.headers.get("authorization");
  const cronHeader = request.headers.get("x-vercel-cron");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;

  const authorized =
    !secret || provided === secret || bearer === secret || cronHeader === "1";

  if (!authorized) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Placeholder for weekly ingestion pipeline.
  // In v1.1, this will fetch official event sources + evergreen updates,
  // normalize records, and upsert into Supabase.
  return NextResponse.json({ ok: true, syncedAt: new Date().toISOString() });
}
