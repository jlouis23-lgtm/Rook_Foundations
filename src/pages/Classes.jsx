import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Users, MapPin, Check } from 'lucide-react';

const phases = [
  {
    phase: '01', title: 'Discovery', subtitle: 'The First Move', ages: '', icon: '♟',
    duration: '45 min', groupSize: 'Up to 6 students', frequency: 'Once weekly',
    description: 'An introduction to the wonderful world of chess, designed for young learners who are completely new to the game. We use storytelling, colourful pieces, and tactile learning to make chess feel magical.',
    whatYouLearn: ['Names and movements of all 9 piece types', 'How to set up the board correctly', 'Basic check and checkmate concepts', 'Simple 1-move tactical puzzles', 'Sportsmanship and turn-taking'],
    parentNote: 'Every child develops at their own pace, and that is something we fully embrace. Some children will grasp concepts quickly. Others may need repetition, forget things between sessions, or take longer to build confidence. All of this is completely normal and expected. My approach is guided by the idea that children grow best when gently stretched just beyond what they can already do and sessions are designed to build on prior understanding one small step at a time. Detailed notes are kept after every session to track progress and ensure no child is ever pushed ahead before they are ready. The focus is on encouragement and building a love of thinking rather than how fast a child progresses.',
  },
  {
    phase: '02', title: 'Strategy', subtitle: 'The Middle Game', ages: '', icon: '♞',
    duration: '60 min', groupSize: 'Up to 8 students', frequency: 'Once or twice weekly',
    description: 'For students with a basic understanding of the rules, this phase introduces the art of planning. Students begin to see patterns, set traps, and think 2–3 moves ahead.',
    whatYouLearn: ['Opening principles (control the centre)', 'Tactical motifs: forks, pins, discovered attacks', 'Basic endgame technique', 'Reading and writing chess notation', 'Friendly in-class tournament play'],
    parentNote: "You'll start to notice your child thinking more carefully before acting — in chess and in everyday life. This is where the real cognitive transfer begins.",
  },
  {
    phase: '03', title: 'Advanced', subtitle: 'The Endgame', ages: '', icon: '♛',
    duration: '75 min', groupSize: 'Up to 8 students', frequency: 'Twice weekly',
    description: 'For serious students ready to elevate their game. Deep positional understanding, competitive play preparation, and the psychological dimensions of chess.',
    whatYouLearn: ['Advanced opening theory and preparation', 'Positional judgement and long-term planning', 'Complex endgame technique', 'Tournament psychology and time management', 'Game analysis using databases'],
    parentNote: "Rook Foundations is designed primarily for beginner to intermediate students. Some students may reach or already be at a point where they would benefit from a more competitive coaching environment, and that is something I will always be transparent about. Where appropriate, sessions can shift from theory and understanding to more cognitive development activities such as timed challenges and memory exercises. I also introduce alternative strategy games like Xiang Qi (Chinese Chess) to help students apply their thinking skills in new contexts. Every lesson is designed to adapt as closely as possible to each child's individual strengths, challenges, and learning style.",
  },
];

export default function Classes() {
  const [activePhase, setActivePhase] = useState(0);

  return (
    <div style={{ backgroundColor: '#0A0A0A' }} className="pt-32">
      {/* Header */}
      <section className="relative overflow-hidden py-20 border-b border-[#D4A843]/15">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <div className="gold-line mx-auto mb-5" />
          <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-4">Classes</span>
          <h1 className="font-oswald text-white uppercase mb-4"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.02em' }}>
            Structured learning for every level
          </h1>
          <p className="font-lato text-white/50 text-lg leading-relaxed max-w-2xl mx-auto">
            Three carefully designed phases that take every child from their very first move to confident, independent strategic thinking.
          </p>
        </div>
      </section>

      {/* Phase selector */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row gap-px bg-[#D4A843]/10 mb-12">
            {phases.map((p, i) => (
              <button
                key={i}
                onClick={() => setActivePhase(i)}
                className={`flex-1 text-left px-8 py-6 transition-all duration-300 ${
                  activePhase === i
                    ? 'bg-[#D4A843] text-[#0A0A0A]'
                    : 'bg-[#0A0A0A] text-white/50 hover:text-white hover:bg-[#111]'
                }`}
              >
                <span className={`font-lato text-xs block mb-1 ${activePhase === i ? 'text-[#0A0A0A]/60' : 'text-[#D4A843]/50'}`}>
                  Phase {p.phase}
                </span>
                <span className="font-oswald text-2xl uppercase tracking-wide block">{p.title}</span>

              </button>
            ))}
          </div>

          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
          >
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl text-[#D4A843]">{phases[activePhase].icon}</span>
                  <div>
                    <h2 className="font-oswald text-white text-3xl uppercase tracking-wide">{phases[activePhase].title}</h2>
                    <p className="font-lato text-[#D4A843]/70 text-sm">{phases[activePhase].subtitle}</p>
                  </div>
                </div>
                <p className="font-lato text-white/60 text-lg leading-relaxed">{phases[activePhase].description}</p>
              </div>
              <div>
                <h3 className="font-oswald text-white text-xl uppercase tracking-wide mb-4">What students learn</h3>
                <ul className="space-y-3">
                  {phases[activePhase].whatYouLearn.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-lato text-white/60 text-base">
                      <Check size={16} className="text-[#D4A843] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-[#D4A843]/20 p-6">
                <h3 className="font-oswald text-[#D4A843] text-lg uppercase tracking-wide mb-2 flex items-center gap-2">
                  <span>♟</span> A note for parents
                </h3>
                <p className="font-lato text-white/50 text-base leading-relaxed italic">
                  "{phases[activePhase].parentNote}"
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#111] border border-[#D4A843]/15 p-8">
                <h3 className="font-oswald text-white text-xl uppercase tracking-wide mb-6">Class Details</h3>
                <div className="space-y-4">
                  {[
                    { icon: Clock, label: 'Session Length', value: phases[activePhase].duration },
                    { icon: Users, label: 'Group Size', value: phases[activePhase].groupSize },
                    { icon: Clock, label: 'Frequency', value: phases[activePhase].frequency },
                    { icon: MapPin, label: 'Format', value: 'In-person only' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 py-3 border-b border-[#D4A843]/8 last:border-0">
                      <Icon size={16} className="text-[#D4A843] flex-shrink-0" />
                      <div>
                        <p className="font-lato text-[#D4A843]/50 text-xs uppercase tracking-wide">{label}</p>
                        <p className="font-lato text-white text-sm font-700 mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/contact"
                  className="w-full mt-8 bg-[#D4A843] text-[#0A0A0A] font-oswald font-700 text-sm tracking-wider py-4 flex items-center justify-center gap-2 hover:bg-[#e8c06a] transition-all"
                >
                  ENQUIRE NOW <ArrowRight size={16} />
                </Link>
              </div>
              <div className="bg-[#0D0D0D] border border-[#D4A843]/20 p-8 text-white">
                <span className="text-3xl text-[#D4A843] block mb-4">♜</span>
                <h4 className="font-oswald text-xl uppercase tracking-wide mb-3">Not sure which level?</h4>
                <p className="font-lato text-white/50 text-sm leading-relaxed mb-6">
                  Book a free 30-minute assessment and we'll recommend the perfect starting point — plus get 50% off your first lesson.
                </p>
                <Link
                  to="/contact"
                  className="block border border-[#D4A843] text-[#D4A843] font-oswald font-700 text-sm tracking-wider py-3 text-center hover:bg-[#D4A843] hover:text-[#0A0A0A] transition-all"
                >
                  FREE ASSESSMENT
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#0D0D0D] py-20 border-t border-[#D4A843]/10">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <div className="gold-line mx-auto mb-5" />
            <h2 className="font-oswald text-white text-3xl uppercase tracking-wide">Common questions</h2>
          </div>
          <div className="space-y-2">
            {[
              { q: 'My child has never played before. Is that okay?', a: 'Absolutely. Our Discovery phase is designed specifically for complete beginners. No prior experience needed — just curiosity and enthusiasm.' },
              { q: 'How do I know which phase is right for my child?', a: "We offer a free 30-minute assessment session where we assess your child's current level and recommend the ideal starting phase." },
              { q: 'What if my child progresses quickly?', a: 'Students are assessed regularly and can move up a phase at any point when they\'re ready. We celebrate and support every progression.' },
              { q: 'Are classes suitable for children with learning differences?', a: 'Yes. Chess is a wonderfully inclusive environment. I have experience teaching children with ADHD, dyslexia, and autism spectrum conditions.' },
            ].map((faq, i) => (
              <details key={i} className="group border border-[#D4A843]/15 overflow-hidden bg-[#0A0A0A] hover:border-[#D4A843]/30 transition-colors">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-oswald text-white uppercase tracking-wide text-lg list-none">
                  {faq.q}
                  <span className="text-[#D4A843] font-inter ml-4 flex-shrink-0 group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
                </summary>
                <div className="px-6 pb-6 font-lato text-white/50 text-base leading-relaxed border-t border-[#D4A843]/10 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}