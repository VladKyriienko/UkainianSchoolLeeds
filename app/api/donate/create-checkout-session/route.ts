import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amountCents = Number(body.amountCents);

    if (!amountCents || amountCents < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least £1 (100 pence)' },
        { status: 400 }
      );
    }

    if (amountCents > 100000) {
      return NextResponse.json(
        { error: 'Amount cannot exceed £1000' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Donation to Ukrainian Saturday School of Leeds',
              description: 'Thank you for supporting our school community.',
              images: [`${SITE_URL}/logo.png`]
            },
            unit_amount: amountCents
          },
          quantity: 1
        }
      ],
      success_url: `${SITE_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/donate`,
      metadata: {
        type: 'donation'
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Donation checkout error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
