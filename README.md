**Welcome to your Base44 project** 

**About**

View and Edit  your app on [Base44.com](http://Base44.com) 

This project contains everything you need to run your app locally.

**Edit the code in your local development environment**

Any change pushed to the repo will also be reflected in the Base44 Builder.

**Prerequisites:** 

1. Clone the repository using the project's Git URL 
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Create an `.env.local` file and set the right environment variables

```
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=your_backend_url

e.g.
VITE_BASE44_APP_ID=cbef744a8545c389ef439ea6
VITE_BASE44_APP_BASE_URL=https://my-to-do-list-81bfaad7.base44.app
```

Run the app: `npm run dev`

**Online booking & payments (Stripe)**

The booking form at `/pricing#book` sends payers to Stripe Checkout. Two Netlify Functions do the server-side work:

- `netlify/functions/create-checkout.js` validates the booking, recalculates the price from `src/data/pricing.js` and creates the Stripe Checkout session.
- `netlify/functions/stripe-webhook.js` verifies Stripe's `checkout.session.completed` event and emails the booking details (via [Resend](https://resend.com)) to `BOOKING_NOTIFY_EMAIL`.

Environment variables (Netlify → Site configuration → Environment variables, or a local `.env` file for `netlify dev`). **Never prefix these with `VITE_`** — that would publish them in the website code.

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
BOOKING_NOTIFY_EMAIL=louis.jenkins@rookfoundations.com
BOOKING_FROM_EMAIL=Rook Foundations Bookings <bookings@rookfoundations.co.uk>
```

`BOOKING_FROM_EMAIL` defaults to Resend's test sender (`onboarding@resend.dev`), which only delivers to the email address the Resend account was created with — fine for testing, but verify the `rookfoundations.co.uk` domain in Resend before going live.

To test locally: `npx netlify dev` (serves the site and functions on http://localhost:8888), then in a second terminal `stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook` and copy the `whsec_...` it prints into `STRIPE_WEBHOOK_SECRET`. Pay with the test card `4242 4242 4242 4242`, any future expiry date and any CVC.

For the live site, add a webhook endpoint in the Stripe dashboard pointing at `https://rookfoundations.co.uk/.netlify/functions/stripe-webhook` for the `checkout.session.completed` and `checkout.session.async_payment_succeeded` events, and use that endpoint's signing secret.

**School clubs booking database (prepared, not yet in use)**

The SQL for the planned school clubs booking system is in `supabase/migrations/` and is described in [`docs/school-clubs-database.md`](docs/school-clubs-database.md). It has not been applied to any Supabase project and nothing on the site uses it yet. Its tests run locally against an in-memory PostgreSQL with `npm run test:db` (PostgreSQL 17) or `npm run test:db:all` (16, 17 and 18); both are separate from `npm test`. `supabase/schema.sql` is a leftover from the removed Rook Play feature and is not part of it.

**Publish your changes**

Open [Base44.com](http://Base44.com) and click on Publish.

**Docs & Support**

Documentation: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)

Support: [https://app.base44.com/support](https://app.base44.com/support)
