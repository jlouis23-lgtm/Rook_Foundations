import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';
import WhatHappensNextSection from '@/components/booking/WhatHappensNextSection';

const EASE = [0.22, 1, 0.36, 1];

// Pre-launch switch. Flip to true once Rook Foundations opens bookings —
// this alone restores the live Google Calendar links, the original
// "Book X Session" button copy and the "Scheduling powered by Google
// Calendar" caption, and hides the pre-launch box and "Interested in Rook
// Foundations?" prompt below. Nothing else needs to change.
const BOOKINGS_OPEN = false;

// Colour treatment reused from the Pricing page's three session-format
// cards (Individual/Pair/Group), reapplied here in the same order purely as
// part of the shared Rook Foundations visual system — the two pages group
// sessions differently (length vs. group size), so the colours don't imply
// the categories are equivalent. All three cards use the same card
// structure/elevation so none reads as more prominent than the others.
const sessionCards = [
  {
    title: 'Focus Session',
    duration: '30 Minutes',
    label: 'Focused Learning',
    labelStyle: 'bg-[#7a48c0] text-white',
    cardStyle: 'bg-[#7a48c0]/10 border-[#7a48c0]/30',
    description: 'A shorter, concentrated learning experience that can work well around specific goals.',
    goodFor: [
      "You're looking for a shorter, highly focused session.",
      'Your child engages particularly well with shorter periods of concentrated learning.',
      "You'd like to work towards one or two specific learning goals.",
    ],
    buttonLabel: 'Book Focus Session',
    scheduleUrl: 'https://calendar.app.google/btKSKkRKfRatY6m3A',
  },
  {
    title: 'Core Session',
    duration: '60 Minutes',
    label: 'Balanced Learning',
    labelStyle: 'bg-[#b8790a] text-white',
    cardStyle: 'bg-amber-50/60 border-[#E8A020]/30',
    description: 'A balanced combination of gameplay, puzzles, discussion and reflection.',
    goodFor: [
      "You'd like a session that combines different elements of the Rook Foundations approach.",
      "You'd like a balanced mix of gameplay, discussion and reflection.",
      "You're looking for regular, personalised sessions that build progress over time.",
    ],
    buttonLabel: 'Book Core Session',
    scheduleUrl: 'https://calendar.app.google/YHKcCMkE477HWNBg7',
  },
  {
    title: 'Extended Session',
    duration: '90 Minutes',
    label: 'Deep Learning',
    labelStyle: 'bg-[#2d8c62] text-white',
    cardStyle: 'bg-green-50/60 border-green-200',
    description: 'A longer opportunity for sustained engagement, exploration and deeper learning through a wider range of activities.',
    goodFor: [
      'Your child enjoys spending longer exploring new ideas and challenges.',
      "You'd like more time for gameplay, discussion and reflection.",
      "You're looking for a deeper learning experience across a wider range of activities.",
    ],
    buttonLabel: 'Book Extended Session',
    scheduleUrl: 'https://calendar.app.google/QM8JkChdny7yU8Cs9',
  },
];

function SessionCard({ session, index }) {
  const Wrapper = BOOKINGS_OPEN ? motion.a : motion.div;

  const interactiveProps = BOOKINGS_OPEN
    ? {
        href: session.scheduleUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
        whileTap: ctaTap,
        whileHover: { y: -4, rotate: 0.5, transition: { duration: 0.25, ease: 'easeOut' } },
        'aria-label': `${session.buttonLabel} — opens Google Calendar in a new tab`,
      }
    : {
        // Not a link/button, so it can't be tabbed to or accidentally
        // activated — the card is informational only during pre-launch.
        'aria-label': `${session.title}: bookings are not yet open`,
      };

  return (
    <Wrapper
      {...interactiveProps}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`play-card group relative flex flex-col border rounded-3xl p-7 ${session.cardStyle} ${
        BOOKINGS_OPEN ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAF7]' : ''
      }`}
    >
      <span className={`absolute -top-3 left-1/2 -translate-x-1/2 ${session.labelStyle} font-nunito text-xs font-700 px-4 py-1.5 rounded-full shadow-md whitespace-nowrap`}>
        {session.label}
      </span>

      <div className="mb-5">
        <h2 className="font-fredoka text-[#2D2520] text-2xl mb-2">{session.title}</h2>
        <span className="inline-flex items-center gap-1.5 font-nunito text-[#E8A020] text-sm font-700 bg-[#E8A020]/10 rounded-full px-3 py-1">
          <Clock size={13} /> {session.duration}
        </span>
      </div>

      <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed flex-1 mb-5">
        {session.description}
      </p>

      <div className="mb-5 pt-4 border-t border-[#2D2520]/8">
        <p className="font-fredoka text-[#2D2520] text-sm font-600 mb-2">A great choice if…</p>
        <ul className="space-y-1.5">
          {session.goodFor.map((item) => (
            <li key={item} className="flex items-start gap-2 font-nunito text-[#2D2520]/60 text-xs leading-snug">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-[#E8A020] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {BOOKINGS_OPEN ? (
        <span className="w-full bg-[#E8A020] text-white font-fredoka font-600 text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all group-hover:bg-[#d4940e] group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-[#E8A020]/20">
          {session.buttonLabel} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </span>
      ) : (
        <span className="w-full bg-[#2D2520]/[0.06] text-[#2D2520]/70 font-fredoka font-600 text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 border border-[#2D2520]/12">
          <Clock size={14} className="text-[#2D2520]/50" aria-hidden="true" /> Bookings Opening Soon
        </span>
      )}
    </Wrapper>
  );
}

export default function Booking() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-32">
      {/* Header */}
      <section className="relative overflow-hidden py-20">
        <ChessBg variant="booking" />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-5">
            Pick a time that suits you
          </span>
          <h1 className="font-fredoka text-[#2D2520] leading-[1.1] mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Finding the right session
          </h1>
          {!BOOKINGS_OPEN && (
            <>
              <p className="font-fredoka text-[#E8A020] mb-6" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
                Bookings coming soon
              </p>
              <p className="font-nunito text-[#2D2520]/65 text-lg leading-relaxed max-w-2xl mx-auto">
                Rook Foundations is currently preparing for launch and running pilot sessions and workshops to refine our approach. These sessions help us test our resources, learn how different children respond to different games and ensure that every session provides a thoughtful and engaging learning experience.
              </p>
              <p className="font-nunito text-[#2D2520] text-lg leading-relaxed font-600 mt-4 max-w-2xl mx-auto">
                Bookings will open once our initial programme is ready.
              </p>
            </>
          )}
        </div>
      </section>

      {/* Booking cards */}
      <section className="pb-24 relative overflow-hidden">
        <ChessBg variant="page" />
        <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-3 max-w-xl lg:max-w-none mx-auto">
            {sessionCards.map((session, i) => (
              <SessionCard key={session.title} session={session} index={i} />
            ))}
          </div>

          {BOOKINGS_OPEN ? (
            <p className="font-nunito text-[#2D2520]/35 text-xs text-center mt-10 font-600">
              Scheduling powered by Google Calendar
            </p>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
              className="text-center mt-14"
            >
              <p className="font-fredoka text-[#2D2520] text-lg mb-2">Interested in Rook Foundations?</p>
              <p className="font-nunito text-[#2D2520]/60 text-sm max-w-md mx-auto leading-relaxed mb-5">
                Please get in touch If you'd like to hear when bookings open, or if you have any other queries about this project. I'd like to hear your input to help me make this right for your child.
              </p>
              <MotionLink
                whileTap={ctaTap}
                to="/contact"
                onClick={() => window.scrollTo(0, 0)}
                className="inline-flex items-center gap-2 bg-[#E8A020] text-white font-fredoka font-600 text-sm px-6 py-3.5 rounded-2xl hover:bg-[#d4940e] transition-all hover:shadow-lg hover:shadow-[#E8A020]/20"
              >
                Get in Touch <ArrowRight size={14} />
              </MotionLink>
            </motion.div>
          )}
        </div>
      </section>

      {/* What Happens Next */}
      <section className="pt-20 pb-24 bg-[#F5F3EE]">
        <WhatHappensNextSection />
      </section>
    </div>
  );
}
