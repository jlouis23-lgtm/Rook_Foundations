import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Check, MapPin,
} from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';

const EASE = [0.22, 1, 0.36, 1];

// "What will Rook Foundations Clubs offer?" — describes the intended
// programme, not a currently-running one.
const offerings = [
  { title: 'Strategy Games', body: 'A varied selection of games and puzzles designed to encourage children to explore different ways of thinking.' },
  { title: 'Engaging Activities', body: 'Children will also have opportunities to work in teams, building on ideas together and enjoying themselves in a fun, supportive environment.' },
  { title: 'Progressive Challenges', body: 'Activities can be adapted over time as children become more familiar with different games, challenges and ways of thinking.' },
  { title: 'Thinking & Problem Solving', body: 'Activities that encourage children to plan, predict, make decisions and explain their reasoning.' },
];

// Planned formats — explicitly labelled, not presented as bookable today.
const formats = [
  { title: 'After-School Clubs', body: 'Longer sessions designed to give children time to explore strategy games, challenges and discussion after the school day.' },
  { title: 'Lunchtime Clubs', body: 'Shorter, focused sessions designed to fit naturally into the school day and provide children with an engaging opportunity to play and think.' },
  { title: 'Holiday Workshops', body: 'More flexible sessions providing additional time to explore a wider variety of games and activities.' },
];

// The first two stages are happening now; the last two are the direction
// the programme is heading in, not something already reached — the
// active/muted treatment (rather than a percentage progress bar) is what
// communicates that distinction.
const journeyStages = [
  { num: 1, title: 'Pilot Sessions', body: 'Testing games and teaching resources with children.', accent: '#2d8c62', active: true },
  { num: 2, title: 'Workshops', body: 'Exploring the approach across different ages and settings.', accent: '#4a7eb8', active: true },
  { num: 3, title: 'School Partnerships', body: 'Beginning to work with schools and community organisations.', accent: '#2D2520', active: false },
  { num: 4, title: 'Regular Clubs', body: 'Developing ongoing strategy-game clubs for children.', accent: '#2D2520', active: false },
];

function JourneyNode({ stage, index, vertical = false }) {
  if (vertical) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
        className="flex flex-col gap-0.5"
      >
        <p className="font-nunito text-[0.65rem] font-800 uppercase tracking-widest" style={{ color: stage.active ? stage.accent : `${stage.accent}55` }}>
          Stage {stage.num}
        </p>
        <p className="font-fredoka text-base leading-tight mt-0.5" style={{ color: stage.active ? '#2D2520' : '#2D2520AA' }}>{stage.title}</p>
        <p className="font-nunito text-[#2D2520]/55 text-xs leading-snug mt-1">{stage.body}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
      className="flex flex-col items-center text-center flex-1 px-1"
    >
      <p className="font-nunito text-[0.65rem] font-800 uppercase tracking-widest" style={{ color: stage.active ? stage.accent : `${stage.accent}55` }}>
        Stage {stage.num}
      </p>
      <p className="font-fredoka text-base leading-tight mt-0.5" style={{ color: stage.active ? '#2D2520' : '#2D2520AA' }}>{stage.title}</p>
      <p className="font-nunito text-[#2D2520]/55 text-xs leading-snug mt-1 max-w-[10.5rem]">{stage.body}</p>
    </motion.div>
  );
}

export default function Events() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-32">

      {/* Hero — the club programme's current status, not a live offering */}
      <section className="relative overflow-hidden py-16 lg:py-20">
        <ChessBg variant="hero" />
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-5">
              School & community programme
            </span>
            <h1 className="font-fredoka text-[#2D2520] leading-[1.1] mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Rook Foundations Clubs
            </h1>
            <p className="font-fredoka text-[#E8A020] mb-6" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
              Coming soon to schools and community settings
            </p>
            <p className="font-nunito text-[#2D2520]/65 text-lg leading-relaxed max-w-2xl mx-auto">
              I'm currently developing the Rook Foundations school and community club programme, designed to bring the approach into longer-term group settings. My early workshops and pilot sessions are helping me refine the activities, resources and structure before I begin establishing regular clubs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What will Rook Foundations Clubs offer? */}
      <section className="py-20 bg-white border-y border-[#2D2520]/8 relative overflow-hidden">
        <ChessBg variant="whychess" />
        <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-14">
            <span className="inline-flex items-center font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
              The plan
            </span>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              What will Rook Foundations Clubs offer?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 max-w-2xl mx-auto">
            {offerings.map(({ title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col gap-2"
              >
                <h3 className="font-fredoka text-[#2D2520] text-xl">{title}</h3>
                <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our planned club formats */}
      <section className="py-20 relative overflow-hidden">
        <ChessBg variant="classes" />
        <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
              Formats being developed
            </span>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              Our planned club formats
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {formats.map(({ title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white border border-[#2D2520]/10 rounded-3xl p-6 flex flex-col"
              >
                <span className="inline-flex self-start items-center font-nunito text-[#b8790a] bg-[#E8A020]/10 text-[0.65rem] font-800 uppercase tracking-widest rounded-full px-3 py-1 mb-3">
                  Planned offering
                </span>
                <h3 className="font-fredoka text-[#2D2520] text-xl mb-2">{title}</h3>
                <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety spotlight — carried over from the existing page; the
          practices described already apply to current pilot sessions,
          so this remains accurate rather than a claim about future clubs. */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-green-50 rounded-3xl p-8"
          >
            <h3 className="font-fredoka text-[#2D2520] text-2xl mb-3">Safeguarding and Safety</h3>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mb-4">
              The safety and welfare of every child taking part in my workshops and pilot sessions is my absolute priority, and the same standards will carry through into future Rook Foundations clubs. I follow established safeguarding best practices to help ensure every child has a safe, supportive and positive experience.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                'DBS-checked staff',
                'Safeguarding training completed',
                'Safe, structured, supervised sessions',
                'Children\'s welfare comes first',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 font-nunito text-[#2D2520]/70 text-sm font-600">
                  <Check size={13} className="text-green-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Where we're heading */}
      <section className="py-20 relative overflow-hidden">
        <ChessBg variant="faq" />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
              The road ahead
            </span>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              Where we're heading
            </h2>
          </div>

          {/* Tablet & desktop — horizontal flow */}
          <div className="hidden sm:flex items-start justify-between gap-2 mb-10">
            {journeyStages.map((stage, i) => (
              <JourneyNode key={stage.title} stage={stage} index={i} />
            ))}
          </div>

          {/* Mobile — left-aligned vertical timeline */}
          <div className="sm:hidden flex flex-col gap-5 mb-10">
            {journeyStages.map((stage, i) => (
              <JourneyNode key={stage.title} stage={stage} index={i} vertical />
            ))}
          </div>

          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 bg-[#E8A020]/10 border border-[#E8A020]/20 rounded-full px-5 py-2.5">
              <MapPin size={14} className="text-[#b8790a] flex-shrink-0" />
              <span className="font-nunito text-[#b8790a] font-700 text-sm">Current stage: Pilot Sessions &amp; Workshops</span>
            </span>
          </div>
        </div>
      </section>

      {/* Why the pilot stage matters — personal, not corporate */}
      <section className="py-20 bg-[#E8A020]">
        <div className="max-w-2xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <h2 className="font-fredoka text-white" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
              We're taking the time to get it right.
            </h2>
            <p className="font-nunito text-white/80 text-base leading-relaxed mt-4">
              Before establishing regular clubs, I'm using workshops and pilot sessions to understand how different children respond to different games, challenges and teaching approaches. These experiences are helping me refine the resources and develop a club experience that is engaging, purposeful and adaptable to the children taking part.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
