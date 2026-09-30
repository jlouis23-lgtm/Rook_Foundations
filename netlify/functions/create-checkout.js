// POST /.netlify/functions/create-checkout
// Validates a booking, recalculates the price from src/data/pricing.js (the
// browser's own total is never trusted) and returns a Stripe Checkout URL.
import Stripe from 'stripe';
import { validateBooking, calculateBooking, bookingMetadata, SERVICES } from '../../src/lib/booking.js';

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed.' });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return json(503, { error: 'Online payments are not set up yet. Please get in touch to book.' });
  }

  let input;
  try {
    input = await req.json();
  } catch {
    return json(400, { error: 'Invalid request.' });
  }

  const errors = validateBooking(input);
  if (Object.keys(errors).length > 0) {
    return json(400, { error: 'Please check the highlighted answers.', fields: errors });
  }

  const { items } = calculateBooking(input);
  const metadata = bookingMetadata(input);
  const serviceLabel = SERVICES.find((s) => s.id === input.service)?.label || 'Booking';

  // Netlify sets URL to the site's primary address (and to the local address
  // under `netlify dev`); fall back to the request origin otherwise.
  const origin = process.env.URL || new URL(req.url).origin;

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'gbp',
      customer_email: input.payer.email.trim(),
      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'gbp',
          unit_amount: item.unitAmount,
          product_data: { name: item.name, description: item.description },
        },
      })),
      metadata,
      payment_intent_data: {
        description: `Rook Foundations – ${serviceLabel}`,
        receipt_email: input.payer.email.trim(),
        metadata,
      },
      success_url: `${origin}/pricing?booking=success#book`,
      cancel_url: `${origin}/pricing?booking=cancelled#book`,
    });
    return json(200, { url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err.message);
    return json(502, { error: 'We couldn’t start the payment. Please try again, or get in touch.' });
  }
};
