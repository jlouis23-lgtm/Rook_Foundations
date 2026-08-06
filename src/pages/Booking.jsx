import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import { ctaTap } from '@/components/ui/MotionLink';

const sessionCards = [
  {
    title: 'Focus Session',
    duration: '30 Minutes',
    description: 'A focused one-to-one session designed around one or two personalised learning goals. Ideal for younger learners, shorter attention spans, or families looking for a concise lesson.',
    buttonLabel: 'Book Focus Session',
    scheduleUrl: 'https://calendar.app.google/btKSKkRKfRatY6m3A',
    recommended: false,
  },
  {
    title: 'Core Session',
    duration: '60 Minutes',
    description: 'Our recommended session length, providing the ideal balance of gameplay, discussion and reflection while working towards personalised learning targets.',
    buttonLabel: 'Book Core Session',
    scheduleUrl: 'https://calendar.app.google/YHKcCMkE477HWNBg7',
    recommended: true,
  },
  {
    title: 'Extended Session',
    duration: '90 Minutes',
    description: 'A longer session allowing deeper exploration of strategy games, extended discussion and additional opportunities for guided thinking and reflection.',
    buttonLabel: 'Book Extended Session',
    scheduleUrl: 'https://calendar.app.google/QM8JkChdny7yU8Cs9',
    recommended: false,
  },
];

function SessionCard({ session, index }) {
  return (
    <motion.a
      href={session.scheduleUrl}
      target="_blank"
      rel="noopener noreferrer"
      whileTap={ctaTap}
      whileHover={{ y: -4, rotate: 0.5, transition: { duration: 0.25, ease: 'easeOut' } }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      aria-label={`${session.buttonLabel} — opens Google Calendar in a new tab`}
      className={`play-card group relative flex flex-col border rounded-3xl p-7 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAF7] ${
        session.recommended ? 'border-[#E8A020]/30 shadow-lg shadow-[#E8A020]/8' : 'border-[#2D2520]/10'
      }`}
    >
      {session.recommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E8A020] text-white font-nunito text-xs font-700 px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
          Recommended
        </span>
      )}

      <div className="mb-5">
        <h2 className="font-fredoka text-[#2D2520] text-2xl mb-2">{session.title}</h2>
        <span className="inline-flex items-center gap-1.5 font-nunito text-[#E8A020] text-sm font-700 bg-[#E8A020]/10 rounded-full px-3 py-1">
          <Clock size={13} /> {session.duration}
        </span>
      </div>

      <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed flex-1 mb-7">
        {session.description}
      </p>

      <span className="w-full bg-[#E8A020] text-white font-fredoka font-600 text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all group-hover:bg-[#d4940e] group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-[#E8A020]/20">
        {session.buttonLabel} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </span>
    </motion.a>
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
            📅 Pick a time that suits you
          </span>
          <h1 className="font-fredoka text-[#2D2520] mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Find a session that works for your family
          </h1>
          <p className="font-nunito text-[#2D2520]/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Choose the session that best suits your child's needs. Every session is personalised to support their individual learning journey through carefully selected strategy games.
          </p>
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

          <p className="font-nunito text-[#2D2520]/35 text-xs text-center mt-10 font-600">
            Scheduling powered by Google Calendar
          </p>
        </div>
      </section>
    </div>
  );
}
