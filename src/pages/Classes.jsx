import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Users, MapPin, Check } from 'lucide-react';

const phases = [
  {
    phase: '01',
    title: 'Discovery',
    subtitle: 'The First Move',
    ages: 'Ages 5–7',
    icon: '♟',
    duration: '45 min',
    groupSize: 'Up to 6 students',
    frequency: 'Once weekly',
    color: '#E8705A',
    description: 'An introduction to the wonderful world of chess, designed for young learners who are completely new to the game. We use storytelling, colourful pieces, and tactile learning to make chess feel magical.',
    whatYouLearn: [
      'Names and movements of all 6 piece types',
      'How to set up the board correctly',
      'Basic check and checkmate concepts',
      'Sportsmanship and turn-taking',
      'Simple 1-move tactical puzzles',
    ],
    parentNote: 'Children at this age learn through play. Expect lots of laughter, stories about the "castle" and the "horse," and genuine excitement about each new move they discover.',
  },
  {
    phase: '02',
    title: 'Strategy',
    subtitle: 'The Middle Game',
    ages: 'Ages 8–11',
    icon: '♞',
    duration: '60 min',
    groupSize: 'Up to 8 students',
    frequency: 'Once or twice weekly',
    color: '#3D4F5C',
    description: 'For students with a basic understanding of the rules, this phase introduces the art of planning. Students begin to see patterns, set traps, and think 2–3 moves ahead.',
    whatYouLearn: [
      'Opening principles (control the centre)',
      'Tactical motifs: forks, pins, discovered attacks',
      'Basic endgame technique',
      'Reading and writing chess notation',
      'Friendly in-class tournament play',
    ],
    parentNote: 'You\'ll start to notice your child thinking more carefully before acting — in chess and in everyday life. This is where the real cognitive transfer begins.',
  },
  {
    phase: '03',
    title: 'Mastery',
    subtitle: 'The Endgame',
    ages: 'Ages 12–15',
    icon: '♛',
    duration: '75 min',
    groupSize: 'Up to 8 students',
    frequency: 'Twice weekly',
    color: '#1A242B',
    description: 'For serious students ready to elevate their game. Deep positional understanding, psychological preparation, and external tournament play define this phase.',
    whatYouLearn: [
      'Advanced opening theory and preparation',
      'Positional judgement and long-term planning',
      'Complex endgame technique',
      'Tournament psychology and time management',
      'Game analysis using databases',
    ],
    parentNote: 'Mastery students often start competing in regional youth championships. The skills they develop — focus, composure, analytical thinking — are directly applicable to academic study.',
  },
];

export default function Classes() {
  const [activePhase, setActivePhase] = useState(0);

  return (
    <div className="bg-ivory pt-32">
      {/* Header */}
      <section className="bg-midnight relative overflow-hidden py-20">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(250,249,246,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(250,249,246,0.15) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <span className="font-inter text-coral text-xs tracking-widest uppercase font-500 block mb-4">Classes</span>
          <h1 className="font-playfair text-ivory mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700 }}>
            Structured learning for every level
          </h1>
          <p className="font-inter text-ivory/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Three carefully designed phases that take a child from their very first chess move to confident, 
            independent strategic thinking.
          </p>
        </div>
      </section>

      {/* Phase selector */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Phase tabs */}
          <div className="flex flex-col md:flex-row gap-4 mb-16">
            {phases.map((p, i) => (
              <button
                key={i}
                onClick={() => setActivePhase(i)}
                className={`flex-1 text-left px-8 py-6 rounded-2xl border-2 transition-all duration-300 ${
                  activePhase === i
                    ? 'bg-slate text-ivory border-slate shadow-xl shadow-slate/20'
                    : 'bg-white text-slate border-slate/15 hover:border-coral/30 hover:shadow-md'
                }`}
              >
                <span className={`font-mono text-xs block mb-2 ${activePhase === i ? 'text-coral' : 'text-coral/60'}`}>
                  Phase {p.phase}
                </span>
                <span className={`font-playfair text-2xl font-600 block ${activePhase === i ? 'text-ivory' : 'text-midnight'}`}>
                  {p.title}
                </span>
                <span className={`font-inter text-sm mt-1 block ${activePhase === i ? 'text-ivory/60' : 'text-slate'}`}>
                  {p.ages}
                </span>
              </button>
            ))}
          </div>

          {/* Phase detail */}
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
          >
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl text-coral">{phases[activePhase].icon}</span>
                  <div>
                    <h2 className="font-playfair text-midnight text-3xl font-600">{phases[activePhase].title}</h2>
                    <p className="font-inter text-slate">{phases[activePhase].subtitle} · {phases[activePhase].ages}</p>
                  </div>
                </div>
                <p className="font-inter text-slate text-lg leading-relaxed">{phases[activePhase].description}</p>
              </div>

              <div>
                <h3 className="font-playfair text-midnight text-xl font-600 mb-4">What students learn</h3>
                <ul className="space-y-3">
                  {phases[activePhase].whatYouLearn.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-inter text-slate text-base">
                      <Check size={16} className="text-coral flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-coral/5 border border-coral/15 rounded-2xl p-6">
                <h3 className="font-playfair text-midnight text-lg font-600 mb-2 flex items-center gap-2">
                  <span className="text-coral">♟</span> A note for parents
                </h3>
                <p className="font-inter text-slate text-base leading-relaxed italic">
                  "{phases[activePhase].parentNote}"
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Class details card */}
              <div className="bg-white rounded-2xl border border-slate/10 p-8 shadow-sm">
                <h3 className="font-playfair text-midnight text-xl font-600 mb-6">Class Details</h3>
                <div className="space-y-4">
                  {[
                    { icon: Clock, label: 'Session Length', value: phases[activePhase].duration },
                    { icon: Users, label: 'Group Size', value: phases[activePhase].groupSize },
                    { icon: Clock, label: 'Frequency', value: phases[activePhase].frequency },
                    { icon: MapPin, label: 'Format', value: 'In-person only' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 py-3 border-b border-slate/8 last:border-0">
                      <Icon size={16} className="text-coral flex-shrink-0" />
                      <div>
                        <p className="font-inter text-slate text-xs uppercase tracking-wide">{label}</p>
                        <p className="font-inter text-midnight text-sm font-500 mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/contact"
                  className="w-full mt-8 bg-coral text-ivory font-inter font-600 text-sm py-4 rounded-full flex items-center justify-center gap-2 hover:bg-coral-dark transition-all hover:shadow-lg hover:shadow-coral/20"
                >
                  Enquire for {phases[activePhase].ages} <ArrowRight size={16} />
                </Link>
              </div>

              {/* Free trial card */}
              <div className="bg-midnight rounded-2xl p-8 text-ivory">
                <span className="text-3xl block mb-4">♜</span>
                <h4 className="font-playfair text-xl font-600 mb-3">Not sure which level?</h4>
                <p className="font-inter text-ivory/60 text-sm leading-relaxed mb-6">
                  Book a free 30-minute assessment and we'll recommend the perfect starting point.
                </p>
                <Link
                  to="/contact"
                  className="block bg-coral text-ivory font-inter font-600 text-sm py-3 rounded-full text-center hover:bg-coral-dark transition-all"
                >
                  Free Assessment
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate/5 py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-midnight text-3xl font-600">Common questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'My child has never played chess before. Is that okay?', a: 'Absolutely. Our Discovery phase is designed specifically for complete beginners. No prior experience is needed — just curiosity and enthusiasm.' },
              { q: 'How do I know which phase is right for my child?', a: 'We offer a free 30-minute assessment session where we assess your child\'s current level and recommend the ideal starting phase.' },
              { q: 'What if my child progresses quickly?', a: 'Students are assessed regularly and can move up a phase at any point in the year when they\'re ready. We celebrate and support every progression.' },
              { q: 'Are the classes suitable for children with learning differences?', a: 'Yes. Chess is a wonderfully inclusive learning environment. I have experience teaching children with ADHD, dyslexia, and autism spectrum conditions.' },
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-slate/10 overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-playfair text-midnight font-600 text-lg list-none">
                  {faq.q}
                  <span className="text-coral font-inter ml-4 flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-6 font-inter text-slate text-base leading-relaxed border-t border-slate/8 pt-4">
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