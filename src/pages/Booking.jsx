import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, ArrowRight, Calendar } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';

const sessions = [
  {
    type: '1-to-1 Session',
    ratio: '1-to-1',
    duration: '1 Hour',
    students: 1,
    description: "Fully personalised one-to-one coaching, tailored entirely to your child's pace and learning style.",
    accent: '#b8790a',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    pill: 'bg-amber-100 text-amber-700',
    url: 'https://calendly.com/louis-jenkins-rookfoundations/1-to-1-session-1-hour',
  },
  {
    type: '1-to-1 Session',
    ratio: '1-to-1',
    duration: '2 Hours',
    students: 1,
    description: 'An extended one-to-one session with deeper exploration of concepts and longer practice time.',
    accent: '#b8790a',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    pill: 'bg-amber-100 text-amber-700',
    url: 'https://calendly.com/louis-jenkins-rookfoundations/1-to-1-session-2-hours',
  },
  {
    type: '2-to-1 Session',
    ratio: '2-to-1',
    duration: '1 Hour',
    students: 2,
    description: 'A shared session for two children — ideal for siblings or friends learning together.',
    accent: '#4a7eb8',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    pill: 'bg-blue-100 text-blue-700',
    url: 'https://calendly.com/louis-jenkins-rookfoundations/2-to-1-session-1-hour',
  },
  {
    type: '2-to-1 Session',
    ratio: '2-to-1',
    duration: '2 Hours',
    students: 2,
    description: 'An extended shared session for two, allowing more time for games, review, and discussion.',
    accent: '#4a7eb8',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    pill: 'bg-blue-100 text-blue-700',
    url: 'https://calendly.com/louis-jenkins-rookfoundations/2-to-1-session-2-hours',
  },
  {
    type: '3-to-1 Session',
    ratio: '3-to-1',
    duration: '1 Hour',
    students: 3,
    description: 'Small group coaching for three children, balancing individual attention with collaborative play.',
    accent: '#2d8c62',
    bg: 'bg-green-50',
    border: 'border-green-200',
    pill: 'bg-green-100 text-green-700',
    url: 'https://calendly.com/louis-jenkins-rookfoundations/3-to-1-session-1-hour',
  },
  {
    type: '3-to-1 Session',
    ratio: '3-to-1',
    duration: '2 Hours',
    students: 3,
    description: 'A longer small group session with more time for in-depth strategy and peer learning.',
    accent: '#2d8c62',
    bg: 'bg-green-50',
    border: 'border-green-200',
    pill: 'bg-green-100 text-green-700',
    url: 'https://calendly.com/louis-jenkins-rookfoundations/3-to-1-session-2-hours',
  },
  {
    type: '4-to-1 Session',
    ratio: '4-to-1',
    duration: '1 Hour',
    students: 4,
    description: 'Group coaching for four children — great value, with structured activities and shared discovery.',
    accent: '#7a48c0',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    pill: 'bg-purple-100 text-purple-700',
    url: 'https://calendly.com/louis-jenkins-rookfoundations/4-to-1-session-1-hour',
  },
  {
    type: '4-to-1 Session',
    ratio: '4-to-1',
    duration: '2 Hours',
    students: 4,
    description: 'An extended group session offering more gameplay, strategy discussion, and collaborative learning.',
    accent: '#7a48c0',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    pill: 'bg-purple-100 text-purple-700',
    url: 'https://calendly.com/louis-jenkins-rookfoundations/4-to-1-session-2-hours',
  },
];

const StudentPips = ({ count, color }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className="inline-block w-2 h-2 rounded-full opacity-60" style={{ backgroundColor: color }} />
    ))}
  </div>
);

export default function Booking() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-32">

      {/* Header */}
      <section className="relative overflow-hidden py-20">
        <ChessBg variant="booking" />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#E8A020]/12 border border-[#E8A020]/25 rounded-full px-4 py-2 mb-5">
            <span className="text-sm">📅</span>
            <span className="font-nunito text-[#b8790a] text-sm font-700">Pick a time that suits you</span>
          </div>
          <h1 className="font-fredoka text-[#2D2520] mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Find a session that works for your family
          </h1>
          <p className="font-nunito text-[#2D2520]/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Choose your preferred session type below. Each option opens directly in our booking calendar so you can pick a date and time that suits you.
          </p>
        </div>
      </section>

      {/* Session Cards */}
      <section className="pb-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { label: '1-to-1', color: 'bg-amber-100 text-amber-700 border-amber-200' },
              { label: '2-to-1', color: 'bg-blue-100 text-blue-700 border-blue-200' },
              { label: '3-to-1', color: 'bg-green-100 text-green-700 border-green-200' },
              { label: '4-to-1', color: 'bg-purple-100 text-purple-700 border-purple-200' },
            ].map(({ label, color }) => (
              <span key={label} className={`font-nunito text-sm font-700 border rounded-full px-4 py-1.5 ${color}`}>
                {label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sessions.map((s, i) => (
              <motion.div
                key={`${s.ratio}-${s.duration}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className={`play-card flex flex-col ${s.bg} border-2 ${s.border} rounded-3xl p-6 shadow-sm`}
              >
                {/* Ratio pill */}
                <div className="mb-4">
                  <span className={`inline-flex items-center gap-1.5 font-nunito text-xs font-700 rounded-full px-3 py-1 ${s.pill}`}>
                    <Users size={11} />
                    {s.ratio}
                  </span>
                </div>

                {/* Session type + duration */}
                <div className="mb-3">
                  <h2 className="font-fredoka leading-tight" style={{ fontSize: '1.35rem', color: s.accent }}>
                    {s.type}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Clock size={13} style={{ color: s.accent, opacity: 0.6 }} />
                    <span className="font-nunito font-800 text-base text-[#2D2520]">{s.duration}</span>
                  </div>
                </div>

                {/* Student pips */}
                <div className="mb-4">
                  <StudentPips count={s.students} color={s.accent} />
                </div>

                {/* Description */}
                <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed flex-1 mb-6">
                  {s.description}
                </p>

                {/* CTA */}
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-nunito font-700 text-sm px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md text-white"
                  style={{ backgroundColor: s.accent }}
                >
                  <Calendar size={14} />
                  Book this session
                  <ArrowRight size={14} />
                </a>
              </motion.div>
            ))}
          </div>

          <p className="font-nunito text-[#2D2520]/35 text-xs text-center mt-10 font-600">
            Scheduling powered by Calendly · Synced with Google Calendar
          </p>
        </div>
      </section>
    </div>
  );
}