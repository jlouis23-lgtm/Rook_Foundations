import { motion } from 'framer-motion';
import { Compass, Users } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import LearningJourney from '@/components/about/LearningJourney';
import IndividualGroupSessions from '@/components/about/IndividualGroupSessions';
import ProgressTrackingSection from '@/components/classes/ProgressTrackingSection';
import ChessCurriculumButton from '@/components/classes/ChessCurriculumButton';
import SessionIncludesGrid from '@/components/classes/SessionIncludesGrid';
import PersonalisedApproach from '@/components/classes/PersonalisedApproach';
import RegulationStrategies from '@/components/classes/RegulationStrategies';

export default function HowWeTeachSection() {
  return (
    <section className="py-20 bg-[#FAFAF7] relative overflow-hidden">
      <ChessBg variant="whychess" />

      {/* How We Teach — standalone section heading */}
      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
            <Compass size={14} /> Our approach
          </span>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            How We Teach
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-3 max-w-2xl mx-auto leading-relaxed">
            Games of strategy provide joyful opportunities to process new information, adapt to different rules and evaluate the choices of others. They are the vehicle. What shapes how your child develops is a six-stage learning journey that I'm continuing to refine through each session. I don't claim these skills transfer automatically. Instead, I use relationship, challenge and reflection to create opportunities for children to practise them. I bring the games, structure and encouragement that can help children approach challenges they might otherwise find difficult or be reluctant to tackle on their own.
          </p>

          <ChessCurriculumButton className="mt-8" />
        </motion.div>
      </div>

      {/* Learning journey diagram — full-width breakout for the circular layout */}
      <div id="learning-journey" className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10 mb-16 scroll-mt-24">
        <LearningJourney />
      </div>

      {/* Discussion and Communication — a shorter standalone section between
          the pyramid and Regulation Before Participation. */}
      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
            Communication through play
          </span>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            Language, Communication &amp; Discussion
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Children are growing up in an increasingly digital environment, with social media, video games and online content competing with time traditionally spent reading and communicating. This changing environment makes opportunities to develop language and communication skills particularly important. Language helps children understand rules, communicate their needs and ideas, consider the consequences of their actions and interact positively with others; difficulties expressing themselves can sometimes contribute to frustration or behaviours that challenge.
          </p>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            At Rook Foundations, we use games and playful activities to create enjoyable opportunities to develop vocabulary, communication, creativity and thoughtful discussion. Activities include{' '}
            <strong className="font-700 text-[#2D2520]">comprehension games, friendly debates, story starters, dice storytelling, communication cards and word-building games</strong>
            , helping children develop ideas, create stories with a beginning, middle and end, and respectfully explore different perspectives.
          </p>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Through games, children can express ideas, explore language, listen to others and build confidence in communication while learning in an engaging and supportive environment.
          </p>
        </motion.div>
      </div>

      {/* Regulation Before Participation — sits directly beneath the pyramid,
          before "What Makes Us Different" begins. */}
      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10 mb-16">
        <RegulationStrategies />
      </div>

      {/* What Makes Us Different — heading for the merged philosophy +
          progress-tracking narrative that follows (ProgressTrackingSection
          below has no major heading of its own, by design). The
          SessionIncludesGrid list right after continues this same
          narrative beat rather than starting a new section: it establishes
          what's consistent about every session before ProgressTrackingSection
          shows how that consistency is tracked and built on over time. */}
      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
            What Sets Rook Foundations Apart
          </span>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            A Different Way to Understand Learning
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-3 max-w-xl mx-auto leading-relaxed">
            What sets Rook Foundations apart is the emphasis I place on understanding how your child learns. Below is an overview of what is being done to achieve this goal.
          </p>
        </motion.div>
      </div>

      {/* Every session, regardless of length, consistently includes these six
          elements — continues directly from the intro above with no heading
          of its own */}
      <SessionIncludesGrid />

      {/* How We Track Your Child's Progress */}
      <ProgressTrackingSection />

      {/* How the approach adapts to the individual child — bridges from
          "what's consistent + how it's tracked" above into the individual
          vs. group format question below. */}
      <PersonalisedApproach />

      {/* Individual & Group Learning — standalone heading */}
      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
            <Users size={14} /> Two ways to learn
          </span>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            Which Learning Environment Is Right for Your Child?
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-3 max-w-xl mx-auto leading-relaxed">
            We don't believe one format is inherently better than the other. We take the time to understand how each child learns best.
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
        <IndividualGroupSessions />
      </div>
    </section>
  );
}
