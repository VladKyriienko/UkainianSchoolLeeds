import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Vercel Cron endpoint. Called by Vercel on the schedule defined in vercel.json.
 * Set CRON_SECRET in Vercel env and Vercel will send it as Authorization: Bearer <secret>.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Optional: ping DB or run scheduled tasks here
  // e.g. await createClient().from('...').select('1').limit(1);

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString()
  });
}
