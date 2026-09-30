// Single source of truth for every Rook Foundations price. The Pricing page
// displays these figures and the checkout function charges them, so the two
// can never drift apart. All amounts are in pence.
//
// This file is also imported by netlify/functions, so it must only use
// relative imports (no "@/" alias).

export const DURATIONS = [30, 60];

// Private sessions: the format follows from how many children are booked
// together, and the price is per child, per session.
export const PRIVATE_FORMATS = [
  { id: '1-to-1', label: '1-to-1', people: 1, min: 1, max: 1, price: { 30: 1800, 60: 3000 } },
  { id: 'pair', label: 'Pair', people: 2, min: 2, max: 2, price: { 30: 1100, 60: 1800 } },
  { id: 'small-group', label: 'Small group', people: 4, min: 3, max: 4, price: { 30: 800, 60: 1300 } },
  { id: 'group', label: 'Group', people: 8, min: 5, max: 12, price: { 30: 700, 60: 1100 } },
];

// After-school and lunchtime clubs on school premises, per child, per session.
export const CLUB = { maxChildren: 12, price: { 30: 550, 60: 900 } };

// SEND enrichment: fixed price per session for up to 6 pupils.
export const SEND = { maxPupils: 6, price: { 30: 9500, 60: 15000 } };

// Personalised Enrichment Review, per pupil.
export const PER = { price: 12500, minSessions: 4 };

// Travel zones, measured by road from Great Dunmow town centre. `fee` is per
// visit; `clubUplift` is added per child, per session for school clubs.
export const TRAVEL_ZONES = [
  { id: 'local', label: 'Local', distance: 'Up to 5 miles', fee: 0, clubUplift: 0, towns: 'Great Dunmow, Felsted, Stebbing, Takeley' },
  { id: 'zone-2', label: 'Zone 2', distance: '5–10 miles', fee: 500, clubUplift: 0, towns: 'Thaxted, Stansted Mountfitchet, Hatfield Broad Oak' },
  { id: 'zone-3', label: 'Zone 3', distance: '10–20 miles', fee: 1200, clubUplift: 100, towns: 'Chelmsford, Saffron Walden, Harlow, Witham, Halstead' },
  { id: 'zone-4', label: 'Zone 4', distance: '20–30 miles', fee: 2000, clubUplift: 200, towns: 'Colchester, Sudbury, Brentwood, Billericay', sixtyOnly: true },
];

export function formatPrice(pence) {
  return pence % 100 === 0 ? `£${pence / 100}` : `£${(pence / 100).toFixed(2)}`;
}

export function privateFormatFor(childCount) {
  return PRIVATE_FORMATS.find((f) => childCount >= f.min && childCount <= f.max) || null;
}

export function zoneById(id) {
  return TRAVEL_ZONES.find((z) => z.id === id) || null;
}
