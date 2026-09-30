// POST /.netlify/functions/stripe-webhook
// Receives Stripe events, verifies their signature, and emails a booking
// notification to Rook Foundations when a Checkout payment succeeds.
import Stripe from 'stripe';

const NOTIFY_EMAIL = process.env.BOOKING_NOTIFY_EMAIL || 'louis.jenkins@rookfoundations.com';
const FROM_EMAIL = process.env.BOOKING_FROM_EMAIL || 'Rook Foundations Bookings <onboarding@resend.dev>';

// Metadata keys in the order they appear in the email, with readable labels.
const FIELDS = [
  ['service', 'Service'],
  ['format', 'Format'],
  ['children', 'Children'],
  ['children_more', 'Children (continued)'],
  ['pupils', 'Number of pupils'],
  ['duration', 'Session length'],
  ['sessions', 'Number of sessions'],
  ['start_date', 'Preferred start date'],
  ['preferred_times', 'Preferred days / times'],
  ['location', 'Location'],
  ['address', 'Session address'],
  ['school', 'School'],
  ['school_address', 'School address'],
  ['travel_zone', 'Travel zone'],
  ['payer_name', 'Booked by'],
  ['role', 'Role at school'],
  ['payer_email', 'Email'],
  ['payer_phone', 'Phone'],
  ['emergency_contact', 'Emergency contact'],
  ['additional_needs', 'Additional needs'],
  ['po_number', 'Purchase order number'],
  ['notes', 'Notes'],
  ['agreed_terms', 'Accepted Terms & Conditions'],
  ['agreed_cancellation', 'Accepted cancellation policy'],
  ['early_start_request', 'Asked for sessions to start within 14 days'],
  ['adult_present', 'Adult present throughout (home/venue)'],
  ['staff_support', 'School staff available for support'],
  ['per_min_sessions', 'Pupils have attended at least 4 sessions'],
  ['submitted_at', 'Submitted at'],
];

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const money = (pence) => `£${(pence / 100).toFixed(2)}`;

function buildEmail(session) {
  const meta = session.metadata || {};
  const lines = session.line_items?.data || [];
  const paymentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
  const dashboardUrl = `https://dashboard.stripe.com/${session.livemode ? '' : 'test/'}payments/${paymentId}`;
  const rows = FIELDS.filter(([key]) => meta[key]).map(([key, label]) => [label, meta[key]]);

  const subject = `${session.livemode ? '' : '[TEST] '}New booking paid – ${meta.service || 'Booking'} – ${money(session.amount_total)} – ${meta.payer_name || ''}`.trim();

  const text = [
    `A payment of ${money(session.amount_total)} has been received.`,
    '',
    'CHARGES',
    ...lines.map((l) => `${l.description} × ${l.quantity}: ${money(l.amount_total)}`),
    `Total paid: ${money(session.amount_total)}`,
    '',
    'BOOKING DETAILS',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    `Stripe payment: ${paymentId}`,
    `View in Stripe: ${dashboardUrl}`,
  ].join('\n');

  const cell = 'padding:6px 10px;border-bottom:1px solid #eee;vertical-align:top;font-family:Arial,sans-serif;font-size:14px;';
  const html = `
<div style="max-width:640px;font-family:Arial,sans-serif;color:#2D2520">
  ${session.livemode ? '' : '<p style="background:#fff3cd;padding:8px 12px;border-radius:6px"><strong>Test mode</strong> — no real money was taken.</p>'}
  <h2 style="margin:0 0 6px">New booking paid: ${money(session.amount_total)}</h2>
  <p style="margin:0 0 18px">${escapeHtml(meta.service || 'Booking')} — booked by ${escapeHtml(meta.payer_name || 'unknown')}</p>

  <h3 style="margin:18px 0 6px">Charges</h3>
  <table style="border-collapse:collapse;width:100%">
    ${lines
      .map((l) => `<tr><td style="${cell}">${escapeHtml(l.description)} × ${l.quantity}</td><td style="${cell}text-align:right">${money(l.amount_total)}</td></tr>`)
      .join('')}
    <tr><td style="${cell}font-weight:bold">Total paid</td><td style="${cell}text-align:right;font-weight:bold">${money(session.amount_total)}</td></tr>
  </table>

  <h3 style="margin:22px 0 6px">Booking details</h3>
  <table style="border-collapse:collapse;width:100%">
    ${rows
      .map(([label, value]) => `<tr><td style="${cell}color:#777;width:42%">${escapeHtml(label)}</td><td style="${cell}">${escapeHtml(value)}</td></tr>`)
      .join('')}
  </table>

  <p style="margin-top:22px"><a href="${dashboardUrl}">View this payment in Stripe</a> (${escapeHtml(paymentId || '')})</p>
  <p style="color:#999;font-size:12px">Reply to this email to contact the person who booked.</p>
</div>`;

  return { subject, text, html };
}

async function sendNotification(session) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');

  const { subject, text, html } = buildEmail(session);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      // Stripe can deliver the same event more than once; this stops a
      // retry from sending a second copy of the email.
      'Idempotency-Key': `booking-${session.id}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [NOTIFY_EMAIL],
      reply_to: session.metadata?.payer_email || undefined,
      subject,
      text,
      html,
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) return new Response('Webhook not configured', { status: 503 });

  const stripe = new Stripe(secretKey);
  const payload = await req.text();

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(payload, req.headers.get('stripe-signature'), webhookSecret);
  } catch (err) {
    console.error('Webhook signature check failed:', err.message);
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object;
    if (session.payment_status !== 'paid') return new Response('Awaiting payment', { status: 200 });

    try {
      const full = await stripe.checkout.sessions.retrieve(session.id, { expand: ['line_items'] });
      await sendNotification(full);
    } catch (err) {
      // A non-2xx response makes Stripe retry the event later.
      console.error('Booking notification failed:', err.message);
      return new Response('Notification failed', { status: 500 });
    }
  }

  return new Response('ok', { status: 200 });
};
