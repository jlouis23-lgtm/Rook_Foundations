import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';

const sessionOptions = [
  {
    id: '1hr',
    label: '1 Hour Session',
    sub: '60 minutes',
    scheduleUrl: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ04eY24j1TkFtl0mGtFq_hHbNiBpYi1VzspUjXJe51xfq9rqjFnXt9qJ2dMq9YynjCsgJ59DCuy?gv=true',
  },
  {
    id: '2hr',
    label: '2 Hour Session',
    sub: '120 minutes',
    scheduleUrl: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3fXud7O906lmx0V4Cb06VTW5jDKE9yBAl-daRNiC8c20oa6GO1E6KC1ON_8MUr57YfA3ROwWjK?gv=true',
  },
];

export default function Booking() {
  const [selected, setSelected] = useState('1hr');
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const active = sessionOptions.find((o) => o.id === selected);

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
            Choose a session length, browse available slots, and book directly. Sessions are confirmed instantly and synced to my calendar.
          </p>
        </div>
      </section>

      {/* Google Calendar booking */}
      <section className="pb-24" style={{ backgroundColor: '#FAFAF7' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          {/* Session length selector */}
          <div className="flex justify-center gap-3 mb-10">
            {sessionOptions.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelected(o.id)}
                aria-pressed={selected === o.id}
                className={`relative overflow-hidden flex items-center gap-3 px-6 py-3.5 rounded-2xl font-nunito font-700 text-sm transition-colors duration-300 border-2 ${
                  selected === o.id
                    ? 'text-white border-[#E8A020]'
                    : 'bg-white text-[#2D2520]/60 border-[#E8A020]/20 hover:border-[#E8A020]/50'
                }`}
              >
                {selected === o.id && (
                  <motion.div
                    layoutId="booking-session-pill"
                    className="absolute inset-0 bg-[#E8A020] rounded-2xl shadow-lg shadow-[#E8A020]/25"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Clock size={16} className="relative z-10" />
                <div className="relative z-10 text-left">
                  <span className="block leading-tight">{o.label}</span>
                  <span className={`text-[10px] font-600 leading-tight ${selected === o.id ? 'text-white/70' : 'text-[#E8A020]/60'}`}>{o.sub}</span>
                </div>
              </button>
            ))}
          </div>

          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white border border-[#E8A020]/15 rounded-3xl overflow-hidden shadow-sm"
          >
            <div className="h-1 bg-gradient-to-r from-[#E8A020] via-[#F4C261] to-[#E8A020]" />
            <iframe
              src={active.scheduleUrl}
              width="100%"
              height="700"
              frameBorder="0"
              title={`Book a ${active.label} — Rook Foundations`}
              style={{ display: 'block', border: 0, minWidth: '320px', backgroundColor: '#FFFFFF' }}
            />
          </motion.div>
          <p className="font-nunito text-[#2D2520]/35 text-xs text-center mt-5 font-600">
            Scheduling powered by Google Calendar
          </p>
        </div>
      </section>
    </div>
  );
}