import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    },
    cache: 'no-store'
  });

  return NextResponse.json({
    ok: res.ok,
    status: res.status
  });
}
