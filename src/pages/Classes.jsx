import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users, MapPin, Info, BookOpen, Search, Check, Heart, HelpCircle, Sprout, Puzzle, Trophy } from 'lucide-react';
import LessonPlans from '../components/classes/LessonPlans';
import ChessBg from '@/components/ui/ChessBg';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';

const phases = [
  {
    phase: '01', title: 'Discovery', subtitle: 'The First Move', ages: '', Icon: Sprout,
    accent: '#2d8c62',
    duration: '1 or 2 hours', groupSize: 'Up to 4 students', frequency: 'Once weekly',
    description: 'An introduction to the wonderful world of chess, designed for young learners who are completely new to the game. We use storytelling, colourful pieces, and tactile learning to make chess feel magical.',
    whatYouLearn: ['Names and movements of all piece types', 'How to set up the board correctly', 'Basic check and checkmate concepts', 'Simple 1-move tactical puzzles', 'Sportsmanship and turn-taking'],
    parentNote: 'Every child develops at their own pace, and that is something we fully embrace. Some children will grasp concepts quickly. Others may need repetition or take longer to build confidence. That is completely normal. My approach ensures no child is ever pushed ahead before they are ready. The focus is on encouragement and building a love of thinking.',
  },
  {
    phase: '02', title: 'Development', subtitle: 'The Middle Game', ages: '', Icon: Puzzle,
    accent: '#4a7eb8',
    duration: '1 or 2 hours', groupSize: 'Up to 4 students', frequency: 'Once weekly',
    description: 'For students with a basic understanding of the rules, this phase introduces the art of planning. Students begin to see patterns, set traps, and think 2–3 moves ahead.',
    whatYouLearn: ['Opening principles (control the centre)', 'Tactical motifs: forks, pins, discovered attacks', 'Basic endgame technique', 'Time management and tactics', 'Friendly in-class tournament play'],
    parentNote: "In a world that increasingly rewards speed and instant reactions, we believe there is real value in motivating children to slow down, think carefully, and act with intention over impulse.",
  },
  {
    phase: '03', title: 'Strategy', subtitle: 'The Endgame', ages: '', Icon: Trophy,
    accent: '#7a48c0',
    duration: '1 or 2 hours', groupSize: 'Up to 4 students', frequency: 'Once weekly',
    description: 'For students ready to take the next step. This phase focuses on stronger positional understanding, tactical awareness, and confidence in competitive play.',
    whatYouLearn: ['Opening theory', 'Judging positions and planning attacks', 'Focus on puzzles', 'Board memory and thinking with time pressure', 'Finding tactics and special moves'],
    parentNote: "Rook Foundations is designed primarily for beginner to intermediate students. Some students may reach a point where they would benefit from a more competitive environment. This is something I will always be transparent about. Every lesson is designed to adapt as closely as possible to each child's individual strengths.",
  },
];

export default function Classes() {
  const [activePhase, setActivePhase] = useState(0);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const p = phases[activePhase];

  return (
    <div className="bg-[#FAFAF7] pt-32">
      {/* Header */}
      <section className="relative overflow-hidden py-20">
        <ChessBg variant="page" />

        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-5">
            <BookOpen size={14} /> Learning at every level
          </span>
          <h1 className="font-fredoka text-[#2D2520] mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            A class for every curious mind
          </h1>
          <p className="font-nunito text-[#2D2520]/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Three carefully designed phases that take every child from their very first move to confident, independent strategic thinking.
          </p>

          <div className="mt-8 text-left bg-white/70 border border-[#E8A020]/20 rounded-2xl px-6 py-5 max-w-xl mx-auto">
            <span className="font-nunito text-[#b8790a] text-xs font-800 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Info size={14} /> Our chess curriculum
            </span>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
              This is our lesson structure for chess. We use a similar step-by-step framework for the other strategy games we teach, though each one is adapted in its own way to suit that game. Chess remains our core focus, because of the depth it offers for building planning, patience, and independent thinking.
            </p>
          </div>
        </div>
      </section>

      {/* Phase selector */}
      <section className="py-12 pb-24 relative overflow-hidden">
        <ChessBg variant="classes" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          {/* Phase pills */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-12">
            {phases.map((ph, i) => (
              <button
                key={i}
                onClick={() => setActivePhase(i)}
                className={`relative overflow-hidden flex items-center gap-3 px-6 py-3.5 rounded-2xl font-nunito font-700 text-sm transition-colors duration-300 border-2 ${
                  activePhase === i
                    ? 'text-white border-[#E8A020]'
                    : 'bg-white text-[#2D2520]/60 border-[#E8A020]/20 hover:border-[#E8A020]/50'
                }`}
              >
                {activePhase === i && (
                  <motion.div
                    layoutId="classes-page-pill"
                    className="absolute inset-0 bg-[#E8A020] rounded-2xl shadow-lg shadow-[#E8A020]/25"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <ph.Icon size={20} className="relative z-10" />
                <div className="relative z-10 text-left">
                  <span className="block leading-tight">{ph.title}</span>
                  <span className={`text-[10px] font-600 leading-tight ${activePhase === i ? 'text-white/70' : 'text-[#E8A020]/60'}`}>Phase {ph.phase}</span>
                </div>
              </button>
            ))}
          </div>

          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${p.accent}18` }}>
                    <p.Icon size={30} style={{ color: p.accent }} />
                  </div>
                  <div>
                    <span className="font-nunito text-xs font-800 uppercase tracking-widest block mb-1" style={{ color: p.accent }}>{p.subtitle}</span>
                    <h2 className="font-fredoka text-3xl" style={{ color: p.accent }}>{p.title} Level</h2>
                  </div>
                </div>
                <p className="font-nunito text-[#2D2520]/70 text-base leading-relaxed">{p.description}</p>
              </div>

              <div>
                <h3 className="font-fredoka text-[#2D2520] text-xl mb-5 flex items-center gap-2">
                  <Search size={18} className="text-[#2D2520]/50" /> What children discover
                </h3>
                <ul className="space-y-3">
                  {p.whatYouLearn.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-nunito text-[#2D2520]/70 text-sm">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-white flex-shrink-0"
                        style={{ backgroundColor: p.accent }}><Check size={13} /></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-l-4 border-amber-300 pl-6">
                <h3 className="font-fredoka text-[#b8790a] text-lg mb-2 flex items-center gap-2">
                  <Heart size={17} /> A note for parents
                </h3>
                <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed italic">
                  "{p.parentNote}"
                </p>
              </div>

              <LessonPlans activePhaseTitle={p.title} />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-white border border-[#E8A020]/15 rounded-3xl p-7 shadow-sm">
                <h3 className="font-fredoka text-[#2D2520] text-xl mb-5">Session details</h3>
                <div className="space-y-4">
                  {[
                    { icon: Clock, label: 'Session Length', value: p.duration },
                    { icon: Users, label: 'Group Size', value: p.groupSize },
                    { icon: Clock, label: 'Frequency', value: p.frequency },
                    { icon: MapPin, label: 'Format', value: 'In-person only' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 py-3 border-b border-[#E8A020]/8 last:border-0">
                      <div className="w-8 h-8 bg-[#E8A020]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon size={14} className="text-[#E8A020]" />
                      </div>
                      <div>
                        <p className="font-nunito text-[#E8A020]/70 text-xs font-700 uppercase tracking-wide">{label}</p>
                        <p className="font-nunito text-[#2D2520] text-sm font-700 mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <MotionLink
                  whileTap={ctaTap}
                  to="/contact"
                  className="w-full mt-6 bg-[#E8A020] text-white font-fredoka font-600 text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#d4940e] transition-all hover:shadow-lg hover:shadow-[#E8A020]/20"
                >
                  Enquire Now <ArrowRight size={16} />
                </MotionLink>
              </div>

              <div className="pt-2">
                <HelpCircle size={28} className="text-[#E8A020] block mb-3" />
                <h4 className="font-fredoka text-[#2D2520] text-xl mb-2">Not sure which level?</h4>
                <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed mb-5">
                  In our first session, we'll recommend the perfect starting point. You can also get 50% off your first lesson.
                </p>
                <MotionLink
                  whileTap={ctaTap}
                  to="/contact"
                  className="block bg-[#E8A020] text-white font-fredoka font-600 text-sm py-3 rounded-2xl text-center hover:bg-[#d4940e] transition-all hover:shadow-md"
                >
                  Free Assessment Session
                </MotionLink>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}