import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import PeopleIcon from '@/components/pricing/PeopleIcon';
import BookingForm from '@/components/pricing/BookingForm';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';
import Reveal from '@/components/ui/Reveal';
import { usePageMeta } from '@/hooks/use-page-meta';
import { CLUB, PER, PRIVATE_FORMATS, SEND, TRAVEL_ZONES, formatPrice } from '@/data/pricing';

// All figures come from src/data/pricing.js, which the checkout function
// also charges from. Chess and general strategy-game sessions are priced
// identically, and all sessions run as either 30 or 60 minutes.
const privateRows = PRIVATE_FORMATS.map((f) => ({
  label: f.label,
  people: f.people,
  children: f.min === f.max ? `${f.min} ${f.min === 1 ? 'child' : 'children'}` : `${f.min}–${f.max} children`,
  price30: formatPrice(f.price[30]),
  price60: formatPrice(f.price[60]),
}));

const clubRows = [
  { label: 'Chess or strategy games club', people: 8, children: `Up to ${CLUB.maxChildren} children`, price30: formatPrice(CLUB.price[30]), price60: formatPrice(CLUB.price[60]) },
];

const sendRows = [
  { label: 'SEND enrichment session', people: 6, children: `Up to ${SEND.maxPupils} pupils`, price30: formatPrice(SEND.price[30]), price60: formatPrice(SEND.price[60]) },
];

const sections = [
  { id: 'private-sessions', label: 'Private sessions' },
  { id: 'school-clubs', label: 'School clubs' },
  { id: 'send-pricing', label: 'SEND enrichment' },
  { id: 'travel', label: 'Travel' },
  { id: 'book', label: 'Book & pay' },
];

// Town lists only name places comfortably inside each band — anything close
// to a boundary is confirmed individually at booking.
const travelZones = TRAVEL_ZONES.map((z) => ({
  zone: z.label,
  distance: z.distance,
  fee: z.fee ? `+${formatPrice(z.fee)}` : 'Free',
  clubs: z.clubUplift ? `+${formatPrice(z.clubUplift)} per child` : 'Standard price',
  towns: z.towns,
  sixtyOnly: z.sixtyOnly,
}));

const travelNotes = [
  'Distances are measured by road from Great Dunmow town centre. We don’t travel more than 30 miles.',
  'The travel fee is charged once per visit, not per child. Two or more sessions at the same place on the same day count as one visit.',
  'There’s no travel fee for sessions held at a venue we choose.',
  'School clubs don’t have a separate travel fee — the small per-child increase shown above covers it instead.',
  'For SEND enrichment, the travel fee is charged once per visit to the school.',
  'In Zone 4, all sessions are 60 minutes — 30-minute sessions, including lunchtime clubs, aren’t available.',
  'Any travel fee is confirmed in your booking confirmation, and there’s no travel fee for a session that doesn’t go ahead.',
];

function TravelTable() {
  return (
    <div className="bg-white border border-[#2D2520]/10 rounded-3xl overflow-hidden shadow-sm">
      <div className="grid grid-cols-[1fr_4.5rem_5.5rem] sm:grid-cols-[1fr_7rem_8rem] gap-3 px-5 sm:px-6 py-3 bg-[#2D2520]/[0.04] border-b border-[#2D2520]/8">
        <span className="font-nunito text-[#2D2520]/55 text-xs font-800 uppercase tracking-wide">Zone</span>
        <span className="font-nunito text-[#2D2520]/55 text-xs font-800 uppercase tracking-wide text-right">Per visit</span>
        <span className="font-nunito text-[#2D2520]/55 text-xs font-800 uppercase tracking-wide text-right">School clubs</span>
      </div>
      {travelZones.map((z, i) => (
        <div
          key={z.zone}
          className={`grid grid-cols-[1fr_4.5rem_5.5rem] sm:grid-cols-[1fr_7rem_8rem] gap-3 items-center px-5 sm:px-6 py-5 ${
            i < travelZones.length - 1 ? 'border-b border-[#2D2520]/8' : ''
          }`}
        >
          <div className="min-w-0">
            <p className="font-fredoka text-[#2D2520] text-base sm:text-lg leading-snug">
              {z.zone} <span className="font-nunito text-[#2D2520]/55 text-xs sm:text-sm">· {z.distance}</span>
            </p>
            <p className="font-nunito text-[#2D2520]/55 text-xs mt-1 leading-snug">Including {z.towns}</p>
            {z.sixtyOnly && (
              <p className="font-nunito text-[#b8790a] text-xs font-700 mt-1">60-minute sessions only</p>
            )}
          </div>
          <p className={`font-fredoka text-lg sm:text-2xl text-right leading-tight ${z.fee === 'Free' ? 'text-[#2d8c62]' : 'text-[#2D2520]'}`}>{z.fee}</p>
          <p className="font-nunito text-[#2D2520]/70 text-xs sm:text-sm font-700 text-right leading-snug">{z.clubs}</p>
        </div>
      ))}
      <p className="px-5 sm:px-6 py-3 bg-[#2D2520]/[0.02] border-t border-[#2D2520]/8 font-nunito text-[#2D2520]/55 text-xs sm:text-sm">
        Over 30 miles: not available. Places near a zone boundary are confirmed when you book.
      </p>
    </div>
  );
}

function PriceTable({ rows, unit }) {
  return (
    <div className="bg-white border border-[#2D2520]/10 rounded-3xl overflow-hidden shadow-sm">
      <div className="grid grid-cols-[1fr_4.5rem_4.5rem] sm:grid-cols-[1fr_7rem_7rem] gap-3 px-5 sm:px-6 py-3 bg-[#2D2520]/[0.04] border-b border-[#2D2520]/8">
        <span className="font-nunito text-[#2D2520]/55 text-xs font-800 uppercase tracking-wide">Format</span>
        <span className="font-nunito text-[#2D2520]/55 text-xs font-800 uppercase tracking-wide text-right">30 min</span>
        <span className="font-nunito text-[#2D2520]/55 text-xs font-800 uppercase tracking-wide text-right">60 min</span>
      </div>
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={`grid grid-cols-[1fr_4.5rem_4.5rem] sm:grid-cols-[1fr_7rem_7rem] gap-3 items-center px-5 sm:px-6 py-5 ${
            i < rows.length - 1 ? 'border-b border-[#2D2520]/8' : ''
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="hidden sm:flex w-12 h-12 rounded-2xl bg-[#E8A020]/10 items-center justify-center flex-shrink-0">
              <PeopleIcon count={row.people} size={row.people > 4 ? 30 : 34} style={{ color: '#E8A020' }} />
            </span>
            <div className="min-w-0">
              <p className="font-fredoka text-[#2D2520] text-base sm:text-lg leading-snug">{row.label}</p>
              <p className="font-nunito text-[#2D2520]/55 text-xs sm:text-sm mt-0.5">{row.children}</p>
            </div>
          </div>
          <p className="font-fredoka text-[#2D2520] text-lg sm:text-2xl text-right leading-tight">{row.price30}</p>
          <p className="font-fredoka text-[#E8A020] text-lg sm:text-2xl text-right leading-tight">{row.price60}</p>
        </div>
      ))}
      <p className="px-5 sm:px-6 py-3 bg-[#2D2520]/[0.02] border-t border-[#2D2520]/8 font-nunito text-[#2D2520]/55 text-xs sm:text-sm">
        {unit}
      </p>
    </div>
  );
}

function PricingSection({ id, eyebrow, title, intro, rows, unit, notes, bg, children }) {
  return (
    <section id={id} className={`py-20 relative overflow-hidden scroll-mt-24 ${bg}`}>
      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
        <Reveal className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
            {eyebrow}
          </span>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            {title}
          </h2>
          <p className="font-nunito text-[#2D2520]/60 text-base leading-relaxed mt-4 max-w-xl mx-auto">{intro}</p>
        </Reveal>

        <Reveal delay={0.05}>
          <PriceTable rows={rows} unit={unit} />
        </Reveal>

        {notes && (
          <Reveal delay={0.1}>
            <ul className="mt-8 space-y-3 max-w-xl mx-auto">
              {notes.map((note) => (
                <li key={note} className="flex items-start gap-3 font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
                  <span className="w-5 h-5 bg-[#E8A020] rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    <Check size={11} />
                  </span>
                  {note}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {children}
      </div>
    </section>
  );
}

export default function Pricing() {
  const { hash } = useLocation();
  const [searchParams] = useSearchParams();
  const bookingStatus = searchParams.get('booking');

  usePageMeta(
    'Session Pricing | Rook Foundations',
    'Clear prices for 30 and 60-minute chess and strategy-game sessions: private 1-to-1 and group sessions, school clubs, and SEND enrichment for schools.'
  );

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [hash]);

  return (
    <div className="bg-[#FAFAF7] pt-32">
      {/* Header */}
      <section className="relative overflow-hidden py-20">
        <ChessBg variant="pricing" />
        <Reveal className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-5">
            Simple, honest pricing
          </span>
          <h1 className="font-fredoka text-[#2D2520] leading-[1.1] mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            What does it cost?
          </h1>
          <p className="font-nunito text-[#2D2520]/65 text-lg leading-relaxed max-w-2xl mx-auto mt-6">
            Every session runs for either 30 or 60 minutes. Chess and strategy games sessions are priced the same, so you only need to choose the format and the session length.
          </p>

          <nav aria-label="Pricing sections" className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="font-nunito text-[#2D2520] text-sm font-700 bg-[#E8A020]/10 border border-[#E8A020]/25 rounded-full px-4 py-2 hover:bg-[#E8A020]/20 transition-colors"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </Reveal>
      </section>

      <PricingSection
        id="private-sessions"
        bg="bg-white border-y border-[#2D2520]/8"
        eyebrow="For families"
        title="Private sessions"
        intro="Sessions booked directly by parents and held outside school. The price per child goes down as the group gets bigger."
        rows={privateRows}
        unit="Prices are per child, per session."
        notes={[
          'A travel fee applies when we come to you more than 5 miles from Great Dunmow — see Travel below.',
        ]}
      />

      <PricingSection
        id="school-clubs"
        bg="bg-[#FAFAF7]"
        eyebrow="At your child's school"
        title="After-school and lunchtime clubs"
        intro="Chess and strategy games clubs held on school premises. Parents book and pay directly, so there is no cost to the school."
        rows={clubRows}
        unit="Prices are per child, per session. 30-minute sessions suit lunchtime clubs; 60-minute sessions suit after-school clubs."
        notes={[
          'Up to 12 children per club.',
          'Schools more than 10 miles from Great Dunmow have a small per-child increase instead of a travel fee — see Travel below.',
          'Schools that would like to fund a programme themselves can ask us for a quote.',
        ]}
      >
        <Reveal className="text-center mt-8" delay={0.15}>
          <MotionLink
            whileTap={ctaTap}
            to="/schools"
            className="group inline-flex items-center gap-1.5 font-nunito text-[#E8A020] text-sm font-700 hover:text-[#b8790a] transition-colors"
          >
            Information for schools
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </MotionLink>
        </Reveal>
      </PricingSection>

      <PricingSection
        id="send-pricing"
        bg="bg-white border-y border-[#2D2520]/8"
        eyebrow="For schools"
        title="SEND enrichment"
        intro="Small-group enrichment sessions for pupils with special educational needs and disabilities, arranged with the school."
        rows={sendRows}
        unit="Fixed price per session, for groups of up to 6 pupils."
        notes={[
          'Smaller groups, including 1-to-1 sessions, are charged at the same fixed price.',
          'Schools more than 5 miles from Great Dunmow have a travel fee per visit — see Travel below.',
        ]}
      >
        {/* Personalised Enrichment Review — a per-pupil add-on, not a
            session, so it gets its own box rather than a table row. */}
        <Reveal className="mt-10" delay={0.15}>
          <div className="bg-[#E8A020]/[0.07] border border-[#E8A020]/25 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
            <div className="flex-1">
              <p className="font-fredoka text-[#2D2520] text-xl leading-snug">Personalised Enrichment Review</p>
              <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mt-2">
                An optional written summary of a pupil's engagement, participation and observed strengths. Available once a pupil has attended at least 4 sessions, and can be requested when you first arrange sessions or partway through.
              </p>
            </div>
            <div className="sm:text-right flex-shrink-0">
              <p className="font-fredoka text-[#E8A020] text-3xl leading-tight">{formatPrice(PER.price)}</p>
              <p className="font-nunito text-[#2D2520]/55 text-xs mt-0.5">per pupil</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="text-center mt-8" delay={0.2}>
          <MotionLink
            whileTap={ctaTap}
            to="/schools/send"
            className="group inline-flex items-center gap-1.5 font-nunito text-[#E8A020] text-sm font-700 hover:text-[#b8790a] transition-colors"
          >
            Learn about our SEND provision
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </MotionLink>
        </Reveal>
      </PricingSection>

      {/* Travel */}
      <section id="travel" className="py-20 relative overflow-hidden scroll-mt-24 bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
          <Reveal className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
              Sessions away from Great Dunmow
            </span>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              Travel
            </h2>
            <p className="font-nunito text-[#2D2520]/60 text-base leading-relaxed mt-4 max-w-xl mx-auto">
              Sessions within 5 miles of Great Dunmow have no travel fee. Further away, a small fee covers the extra travel, depending on the zone.
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <TravelTable />
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-8 space-y-3 max-w-xl mx-auto">
              {travelNotes.map((note) => (
                <li key={note} className="flex items-start gap-3 font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
                  <span className="w-5 h-5 bg-[#E8A020] rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    <Check size={11} />
                  </span>
                  {note}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Book & pay — the booking form sends families and schools to Stripe
          Checkout; the stripe-webhook function then emails the booking to
          Rook Foundations. */}
      <section id="book" className="py-20 relative overflow-hidden scroll-mt-24 bg-white border-y border-[#2D2520]/8">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
          <Reveal className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
              Ready to go?
            </span>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              Book and pay
            </h2>
            <p className="font-nunito text-[#2D2520]/60 text-base leading-relaxed mt-4 max-w-xl mx-auto">
              Answer a few questions, check your total, then pay securely by card. I’ll contact you to confirm the dates and times.
            </p>
          </Reveal>
          <BookingForm status={bookingStatus} />
        </div>
      </section>

      {/* Offer CTA */}
      <section className="bg-[#E8A020] py-20 relative overflow-hidden">
        <ChessBg variant="pricingcta" color="#ffffff" />
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className="mb-6 text-center">
            <span className="text-white leading-none" style={{ fontSize: '2.5rem' }}>♜</span>
          </div>
          <h2 className="font-fredoka text-white text-3xl mb-4">Not sure where to start?</h2>
          <p className="font-nunito text-white/80 text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Get in touch and I'll help you choose the most suitable format and session length for your child.
          </p>
          <MotionLink
            whileTap={ctaTap}
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#E8A020] font-fredoka font-600 text-lg px-10 py-4 rounded-2xl hover:bg-[#fdf6e8] transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Register Your Interest <ArrowRight size={18} />
          </MotionLink>
        </div>
      </section>
    </div>
  );
}
