import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ChevronRight } from 'lucide-react';

const lessonPlanData = {
  Discovery: {
    accent: '#2d8c62',
    tag: 'bg-green-100 text-green-700',
    border: 'border-green-200',
    emoji: '🌱',
    oneHour: [
      { time: '0:00 to 0:10', stage: 'Welcome and Warm-Up', activity: 'Greeting, board setup, and a short recap of the previous session (or an introduction to chess for first-timers).', icon: '👋' },
      { time: '0:10 to 0:25', stage: 'Piece Introduction', activity: 'Hands-on exploration of how each piece moves. Stories and visuals are used to make each piece memorable.', icon: '♟' },
      { time: '0:25 to 0:40', stage: 'Guided Play', activity: 'A structured mini-game focusing on one or two piece types, with light coaching throughout.', icon: '🎯' },
      { time: '0:40 to 0:55', stage: 'Puzzle Time', activity: 'Simple one-move puzzles chosen to match the child\'s current level, building pattern recognition in a fun, low-pressure way.', icon: '🧩' },
      { time: '0:55 to 1:00', stage: 'Reflection and Close', activity: 'What did we learn today? One positive takeaway and a preview of next session.', icon: '⭐' },
    ],
    twoHour: [
      { time: '0:00 to 0:10', stage: 'Welcome and Warm-Up', activity: 'Greeting, board setup, and a recap of what we covered last time. New learners get a friendly introduction to the chess world.', icon: '👋' },
      { time: '0:10 to 0:30', stage: 'Piece Introduction', activity: 'Step-by-step exploration of all piece movements using storytelling and visual aids. Each piece gets its own moment.', icon: '♟' },
      { time: '0:30 to 0:50', stage: 'Guided Play Part 1', activity: 'Structured game with coaching support. Focus on applying what was just learned in a relaxed, playful environment.', icon: '🎯' },
      { time: '0:50 to 1:00', stage: 'Break', activity: 'A short, relaxed pause. A chance to reset, ask questions, and recharge before the second half.', icon: '☕' },
      { time: '1:00 to 1:20', stage: 'Puzzle and Pattern Work', activity: 'A set of carefully chosen one to two move puzzles that introduce basic tactical patterns. Emphasis on thinking out loud.', icon: '🧩' },
      { time: '1:20 to 1:40', stage: 'Guided Play Part 2', activity: 'A longer, more complete game with continued coaching. Children are encouraged to narrate their thinking.', icon: '🏆' },
      { time: '1:40 to 2:00', stage: 'Reflection and Goal Setting', activity: 'Review of the session highlights, celebration of progress, and a simple goal to focus on before the next lesson.', icon: '⭐' },
    ],
  },
  Development: {
    accent: '#4a7eb8',
    tag: 'bg-blue-100 text-blue-700',
    border: 'border-blue-200',
    emoji: '🧩',
    oneHour: [
      { time: '0:00 to 0:10', stage: 'Warm-Up and Recap', activity: 'Quick review of the previous session. A short position or puzzle to get the mind active.', icon: '🔁' },
      { time: '0:10 to 0:25', stage: 'Opening Principles', activity: 'Introduction to a key opening concept such as centre control, piece development, or king safety, with practical examples.', icon: '📖' },
      { time: '0:25 to 0:45', stage: 'Tactical Training', activity: 'Focused work on a specific tactical motif such as forks, pins, or discovered attacks. Puzzles selected to match the student\'s level.', icon: '⚔️' },
      { time: '0:45 to 0:55', stage: 'Guided Game', activity: 'A short game with ongoing coaching. The student is encouraged to apply the tactic or principle covered earlier.', icon: '🎯' },
      { time: '0:55 to 1:00', stage: 'Review and Takeaway', activity: 'Identify one key moment from the session and set a focus point for independent practice.', icon: '⭐' },
    ],
    twoHour: [
      { time: '0:00 to 0:10', stage: 'Warm-Up and Recap', activity: 'Review of the last session. A warm-up position to activate pattern recognition and get focused.', icon: '🔁' },
      { time: '0:10 to 0:30', stage: 'Opening Principles', activity: 'In-depth exploration of an opening concept. Multiple examples shown, with guided board practice to reinforce the idea.', icon: '📖' },
      { time: '0:30 to 0:55', stage: 'Tactical Training', activity: 'A structured puzzle set covering a specific tactical theme. Students are coached to slow down and consider multiple candidate moves.', icon: '⚔️' },
      { time: '0:55 to 1:05', stage: 'Break', activity: 'A relaxed pause. A natural moment to reflect on what\'s been covered.', icon: '☕' },
      { time: '1:05 to 1:35', stage: 'Full Game with Coaching', activity: 'A complete, longer game played at a comfortable pace. The coach observes, questions, and intervenes with hints rather than answers.', icon: '🎯' },
      { time: '1:35 to 1:50', stage: 'Game Analysis', activity: 'Reviewing two or three critical moments from the game. What went well? What could have been stronger? Students lead the discussion.', icon: '🔍' },
      { time: '1:50 to 2:00', stage: 'Review and Goal Setting', activity: 'Session summary, positive reinforcement, and a clear focus point for the week ahead.', icon: '⭐' },
    ],
  },
  Strategy: {
    accent: '#7a48c0',
    tag: 'bg-purple-100 text-purple-700',
    border: 'border-purple-200',
    emoji: '🏆',
    oneHour: [
      { time: '0:00 to 0:10', stage: 'Warm-Up and Position', activity: 'A challenging opening position to evaluate and discuss. What is the best plan for each side?', icon: '🔍' },
      { time: '0:10 to 0:25', stage: 'Strategic Concept', activity: 'Deep dive into one positional idea such as pawn structure, piece activity, or long-term planning.', icon: '📐' },
      { time: '0:25 to 0:45', stage: 'Puzzle Thinking', activity: 'Multi-move puzzles requiring calculation and judgement. Students are guided through a structured thinking process.', icon: '🧩' },
      { time: '0:45 to 0:55', stage: 'Timed Challenge', activity: 'A short game or endgame exercise played under light time pressure to build decision-making confidence.', icon: '⏱️' },
      { time: '0:55 to 1:00', stage: 'Review and Takeaway', activity: 'Identify the key moment or idea from today\'s session to carry forward.', icon: '⭐' },
    ],
    twoHour: [
      { time: '0:00 to 0:10', stage: 'Warm-Up and Position Review', activity: 'Evaluate a complex position together. Students are asked to identify threats, imbalances, and the best plan.', icon: '🔍' },
      { time: '0:10 to 0:35', stage: 'Strategic Concept', activity: 'A detailed exploration of a positional theme with multiple examples. Students discuss and apply ideas on the board.', icon: '📐' },
      { time: '0:35 to 1:00', stage: 'Advanced Puzzle Thinking', activity: 'A challenging puzzle set with multi-move calculations. Focus on structured thinking: forcing moves, candidate selection, and evaluation.', icon: '🧩' },
      { time: '1:00 to 1:10', stage: 'Break', activity: 'A short rest before the game phase begins.', icon: '☕' },
      { time: '1:10 to 1:40', stage: 'Full Competitive Game', activity: 'A complete game at a measured pace. Students are encouraged to think independently, with minimal coaching during play.', icon: '🎯' },
      { time: '1:40 to 1:55', stage: 'Deep Game Analysis', activity: 'Thorough review of the game, focusing on plans, missed tactics, and critical decision points. Student-led discussion.', icon: '📊' },
      { time: '1:55 to 2:00', stage: 'Review and Goal Setting', activity: 'Celebrate progress, acknowledge areas to develop, and set a meaningful focus for the coming week.', icon: '⭐' },
    ],
  },
};

function LessonPlanModal({ phase, duration, data, accent, tag, border, emoji, onClose }) {
  const stages = duration === '1 Hour' ? data.oneHour : data.twoHour;
  const label = `${phase} — ${duration} Session`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8"
      style={{ backgroundColor: 'rgba(45,37,32,0.82)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#FAFAF7] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#E8A020]/20">

          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b-2 border-[#E8A020]/12 bg-white">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{emoji}</span>
              <div>
                <span className={`inline-block ${tag} rounded-full px-3 py-0.5 text-xs font-nunito font-700 mb-0.5`}>{phase} Level</span>
                <h3 className="font-fredoka text-[#2D2520] text-xl leading-tight">{duration} Session Plan</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 bg-[#F5F3EE] hover:bg-[#E8A020]/15 rounded-xl flex items-center justify-center text-[#2D2520]/40 hover:text-[#2D2520] transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Session overview bar */}
          <div className="px-8 py-4 bg-white border-b-2 border-[#E8A020]/8 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#E8A020]" />
              <span className="font-nunito text-[#2D2520]/60 text-sm font-600">Duration: <strong className="text-[#2D2520]">{duration}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">📍</span>
              <span className="font-nunito text-[#2D2520]/60 text-sm font-600">Format: <strong className="text-[#2D2520]">In-person</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">👥</span>
              <span className="font-nunito text-[#2D2520]/60 text-sm font-600">Group size: <strong className="text-[#2D2520]">Up to 4 students</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">📅</span>
              <span className="font-nunito text-[#2D2520]/60 text-sm font-600">Frequency: <strong className="text-[#2D2520]">Once weekly</strong></span>
            </div>
          </div>

          {/* Stages grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stages.map((stage, i) => (
                <div
                  key={i}
                  className="bg-white border-2 border-[#E8A020]/12 rounded-2xl p-5 hover:border-[#E8A020]/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{stage.icon}</span>
                    <span
                      className="font-nunito text-xs font-700 px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: `${accent}18`, color: accent }}
                    >
                      {stage.time}
                    </span>
                  </div>
                  <h4 className="font-fredoka text-[#2D2520] text-base mb-2" style={{ color: accent }}>
                    {stage.stage}
                  </h4>
                  <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">
                    {stage.activity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t-2 border-[#E8A020]/10 bg-amber-50 flex items-center justify-between">
            <span className="font-nunito text-[#2D2520]/40 text-xs font-600">Click outside to close</span>
            <span className="text-[#E8A020] text-lg">♜</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LessonPlans({ activePhaseTitle }) {
  const [openPlan, setOpenPlan] = useState(null); // '1 Hour' | '2 Hours' | null

  const data = lessonPlanData[activePhaseTitle];
  if (!data) return null;

  return (
    <>
      <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6">
        <h3 className="font-fredoka text-[#b8790a] text-lg mb-1 flex items-center gap-2">
          📋 What do sessions tend to look like?
        </h3>
        <p className="font-nunito text-[#2D2520]/50 text-xs mb-5 font-600">
          Tap a plan to explore the full session structure and learning goals.
        </p>
        <div className="flex gap-3 flex-wrap">
          {['1 Hour', '2 Hours'].map((duration) => (
            <button
              key={duration}
              onClick={() => setOpenPlan(duration)}
              className="group flex items-center gap-2 bg-white border-2 border-amber-200 rounded-2xl px-5 py-3 hover:border-[#E8A020] hover:bg-amber-50 transition-all font-nunito font-700 text-sm text-[#2D2520]/70 hover:text-[#b8790a]"
            >
              <Clock size={14} className="text-[#E8A020]" />
              {duration} Plan
              <ChevronRight size={13} className="text-[#E8A020]/50 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openPlan && (
          <LessonPlanModal
            phase={activePhaseTitle}
            duration={openPlan}
            data={data}
            accent={data.accent}
            tag={data.tag}
            border={data.border}
            emoji={data.emoji}
            onClose={() => setOpenPlan(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}