import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.metadata?.type !== 'donation') {
      return NextResponse.json({ received: true });
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from('donations').insert({
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent
        ? String(session.payment_intent)
        : null,
      amount_cents: session.amount_total ?? 0,
      currency: session.currency ?? 'gbp',
      status: 'completed',
      donor_email: session.customer_details?.email ?? null
    });

    if (error) {
      console.error('Failed to save donation:', error);
      return NextResponse.json(
        { error: 'Failed to save donation record' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
