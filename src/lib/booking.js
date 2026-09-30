// Booking rules shared by the booking form (for instant feedback) and the
// create-checkout Netlify function (which re-runs them before charging, so a
// tampered request can never change the price). Relative imports only — this
// file is bundled into netlify/functions too.
import {
  CLUB,
  PER,
  SEND,
  formatPrice,
  privateFormatFor,
  zoneById,
} from '../data/pricing.js';

export const SERVICES = [
  { id: 'private', label: 'Private sessions', hint: 'For families — held at your home, a venue you choose, or a venue we arrange.' },
  { id: 'club', label: 'School club place', hint: "For families — a place at an after-school or lunchtime club at your child's school." },
  { id: 'send', label: 'SEND enrichment', hint: 'For schools — sessions for groups of up to 6 pupils.' },
  { id: 'per', label: 'Personalised Enrichment Review', hint: 'For schools — a written review for pupils who have attended at least 4 sessions.' },
];

export const MAX_SESSIONS = { private: 12, club: 15, send: 12 };
export const MAX_CLUB_CHILDREN = 4;
export const CHILD_AGES = [5, 6, 7, 8, 9, 10, 11, 12];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isFamilyService = (service) => service === 'private' || service === 'club';
const needsDuration = (service) => service !== 'per';
const toInt = (v) => (typeof v === 'number' ? v : parseInt(v, 10));
const text = (v) => (typeof v === 'string' ? v.trim() : '');

export function usesTravelZone(input) {
  if (input.service === 'per') return false;
  if (input.service === 'private') return input.location === 'your-venue';
  return true;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// Returns { field: message } for every problem found. An empty object means
// the booking is complete and valid.
export function validateBooking(input = {}) {
  const e = {};
  const service = input.service;
  if (!['private', 'club', 'send', 'per'].includes(service)) {
    e.service = 'Please choose what you would like to book.';
    return e;
  }

  const payer = input.payer || {};
  if (!text(payer.name)) e.payerName = 'Please enter your full name.';
  else if (text(payer.name).length > 100) e.payerName = 'Please shorten your name.';
  if (!EMAIL_RE.test(text(payer.email))) e.payerEmail = 'Please enter a valid email address.';
  if (text(payer.phone).replace(/\D/g, '').length < 10) e.payerPhone = 'Please enter a valid phone number.';

  if (needsDuration(service)) {
    const duration = toInt(input.duration);
    if (![30, 60].includes(duration)) e.duration = 'Please choose a session length.';
    const sessions = toInt(input.sessions);
    if (!Number.isInteger(sessions) || sessions < 1 || sessions > MAX_SESSIONS[service]) {
      e.sessions = `Please choose between 1 and ${MAX_SESSIONS[service]} sessions.`;
    }
    if (!text(input.startDate) || Number.isNaN(Date.parse(input.startDate))) {
      e.startDate = 'Please choose a preferred start date.';
    } else if (text(input.startDate) < todayISO()) {
      e.startDate = 'The start date can’t be in the past.';
    }
  }

  if (usesTravelZone(input)) {
    const zone = zoneById(input.zone);
    if (!zone) e.zone = 'Please choose the travel zone.';
    else if (zone.sixtyOnly && toInt(input.duration) !== 60) {
      e.duration = `${zone.label} sessions are 60 minutes only.`;
    }
  }

  if (isFamilyService(service)) {
    const max = service === 'private' ? 12 : MAX_CLUB_CHILDREN;
    const count = toInt(input.childrenCount);
    if (!Number.isInteger(count) || count < 1 || count > max) {
      e.childrenCount = `Please choose between 1 and ${max} children.`;
    } else {
      const children = Array.isArray(input.children) ? input.children : [];
      for (let i = 0; i < count; i++) {
        const child = children[i] || {};
        if (!text(child.firstName) || text(child.firstName).length > 40) e[`child${i}Name`] = "Please enter the child's first name.";
        if (!CHILD_AGES.includes(toInt(child.age))) e[`child${i}Age`] = "Please choose the child's age.";
      }
    }
    if (!text(input.emergencyName)) e.emergencyName = 'Please enter an emergency contact name.';
    if (text(input.emergencyPhone).replace(/\D/g, '').length < 10) e.emergencyPhone = 'Please enter a valid emergency contact number.';
    if (!['yes', 'no'].includes(input.additionalNeeds)) e.additionalNeeds = 'Please answer this question.';
    if (!input.agree?.earlyStart) e.earlyStart = 'Please confirm this to continue.';
  }

  if (service === 'private') {
    if (!['rf-venue', 'your-venue'].includes(input.location)) e.location = 'Please choose where sessions will take place.';
    if (input.location === 'your-venue') {
      if (!text(input.address)) e.address = 'Please enter the address where sessions will take place.';
      if (!input.agree?.adultPresent) e.adultPresent = 'Please confirm this to continue.';
    }
  }

  if (service === 'club' && !text(input.schoolName)) e.schoolName = "Please enter your child's school.";

  if (service === 'send' || service === 'per') {
    if (!text(input.schoolName)) e.schoolName = 'Please enter the school name.';
    if (!text(input.role)) e.role = 'Please enter your role at the school.';
    const pupils = toInt(input.pupils);
    if (!Number.isInteger(pupils) || pupils < 1 || pupils > SEND.maxPupils) e.pupils = `Please choose between 1 and ${SEND.maxPupils} pupils.`;
  }
  if (service === 'send') {
    if (!text(input.schoolAddress)) e.schoolAddress = 'Please enter the school address.';
    if (!input.agree?.staffSupport) e.staffSupport = 'Please confirm this to continue.';
  }
  if (service === 'per' && !input.agree?.perSessions) e.perSessions = 'Please confirm this to continue.';

  if (text(input.notes).length > 450) e.notes = 'Please keep notes under 450 characters.';
  if (!input.agree?.terms) e.terms = 'Please accept the Terms & Conditions.';
  if (!input.agree?.cancellation) e.cancellation = 'Please confirm you understand the cancellation policy.';

  return e;
}

// Builds the itemised charges. Only call with a booking that passed
// validateBooking.
export function calculateBooking(input) {
  const service = input.service;
  const duration = toInt(input.duration);
  const sessions = toInt(input.sessions);
  const zone = usesTravelZone(input) ? zoneById(input.zone) : null;
  const items = [];

  if (service === 'private') {
    const count = toInt(input.childrenCount);
    const format = privateFormatFor(count);
    const perChild = format.price[duration];
    items.push({
      name: `Private session (${format.label}) – ${duration} min`,
      description: `${count} ${count === 1 ? 'child' : 'children'} × ${formatPrice(perChild)} per child`,
      unitAmount: perChild * count,
      quantity: sessions,
    });
    if (zone && zone.fee > 0) {
      items.push({ name: `Travel fee – ${zone.label}`, description: 'Per visit', unitAmount: zone.fee, quantity: sessions });
    }
  }

  if (service === 'club') {
    const count = toInt(input.childrenCount);
    const perChild = CLUB.price[duration];
    items.push({
      name: `School club place – ${duration} min`,
      description: `${count} ${count === 1 ? 'child' : 'children'} × ${formatPrice(perChild)} per child`,
      unitAmount: perChild * count,
      quantity: sessions,
    });
    if (zone && zone.clubUplift > 0) {
      items.push({
        name: `Travel supplement – ${zone.label}`,
        description: `${count} ${count === 1 ? 'child' : 'children'} × ${formatPrice(zone.clubUplift)} per child`,
        unitAmount: zone.clubUplift * count,
        quantity: sessions,
      });
    }
  }

  if (service === 'send') {
    items.push({
      name: `SEND enrichment session – ${duration} min`,
      description: `Fixed price for up to ${SEND.maxPupils} pupils`,
      unitAmount: SEND.price[duration],
      quantity: sessions,
    });
    if (zone && zone.fee > 0) {
      items.push({ name: `Travel fee – ${zone.label}`, description: 'Per visit', unitAmount: zone.fee, quantity: sessions });
    }
  }

  if (service === 'per') {
    items.push({
      name: 'Personalised Enrichment Review',
      description: 'Per pupil',
      unitAmount: PER.price,
      quantity: toInt(input.pupils),
    });
  }

  const total = items.reduce((sum, item) => sum + item.unitAmount * item.quantity, 0);
  return { items, total };
}

// Flattens the booking into Stripe metadata (max 50 keys, 500 chars each),
// which the webhook reads back to build the notification email. Deliberately
// excludes anything about a child's needs beyond a yes/no flag.
export function bookingMetadata(input) {
  const service = SERVICES.find((s) => s.id === input.service);
  const zone = usesTravelZone(input) ? zoneById(input.zone) : null;
  const count = toInt(input.childrenCount);
  const children = isFamilyService(input.service)
    ? (input.children || []).slice(0, count).map((c) => `${text(c.firstName)} (age ${toInt(c.age)})`).join('; ')
    : '';

  const meta = {
    service: service?.label,
    payer_name: text(input.payer?.name),
    payer_email: text(input.payer?.email),
    payer_phone: text(input.payer?.phone),
    role: text(input.role),
    school: text(input.schoolName),
    school_address: text(input.schoolAddress),
    children,
    pupils: input.service === 'send' || input.service === 'per' ? String(toInt(input.pupils)) : '',
    duration: needsDuration(input.service) ? `${toInt(input.duration)} minutes` : '',
    sessions: needsDuration(input.service) ? String(toInt(input.sessions)) : '',
    format: input.service === 'private' ? privateFormatFor(count)?.label : '',
    location:
      input.service === 'private'
        ? input.location === 'your-venue' ? 'Family’s home or chosen venue' : 'Venue arranged by Rook Foundations'
        : '',
    address: input.service === 'private' && input.location === 'your-venue' ? text(input.address) : '',
    travel_zone: zone ? `${zone.label} (${zone.distance})` : '',
    start_date: needsDuration(input.service) ? text(input.startDate) : '',
    preferred_times: text(input.preferredTimes),
    emergency_contact: isFamilyService(input.service) ? `${text(input.emergencyName)} – ${text(input.emergencyPhone)}` : '',
    additional_needs: isFamilyService(input.service) ? (input.additionalNeeds === 'yes' ? 'Yes – please contact the family to discuss' : 'No') : '',
    po_number: text(input.poNumber),
    notes: text(input.notes),
    agreed_terms: input.agree?.terms ? 'Yes' : 'No',
    agreed_cancellation: input.agree?.cancellation ? 'Yes' : 'No',
    early_start_request: isFamilyService(input.service) ? (input.agree?.earlyStart ? 'Yes' : 'No') : '',
    adult_present: input.service === 'private' && input.location === 'your-venue' ? (input.agree?.adultPresent ? 'Yes' : 'No') : '',
    staff_support: input.service === 'send' ? (input.agree?.staffSupport ? 'Yes' : 'No') : '',
    per_min_sessions: input.service === 'per' ? (input.agree?.perSessions ? 'Yes' : 'No') : '',
    submitted_at: new Date().toISOString(),
  };

  return Object.fromEntries(
    Object.entries(meta)
      .filter(([, v]) => v)
      .map(([k, v]) => [k, String(v).slice(0, 500)])
  );
}
