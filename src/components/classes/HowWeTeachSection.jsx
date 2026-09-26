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
import CommunicationTable from '@/components/classes/CommunicationTable';
import BehaviourFramework from '@/components/classes/BehaviourFramework';
import TeachingPrinciples from '@/components/classes/TeachingPrinciples';

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
          className="text-center"
        >
          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
            <Compass size={14} /> Our approach
          </span>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            How We Teach
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-3 max-w-2xl mx-auto leading-relaxed">
            Games of strategy provide joyful opportunities to process new information, adapt to different rules and evaluate the choices of others. They are the vehicle. What shapes how a child develops is a six-stage learning journey, continually refined through each session.
          </p>

          <ChessCurriculumButton className="mt-8" />
        </motion.div>
      </div>

      {/* Three teaching principles — visual bridge between the "How We
          Teach" intro above and the six-stage pyramid below. Wider breakout
          (max-w-5xl) than the max-w-3xl intro text column, matching how
          other multi-column content on this page (CommunicationTable) also
          breaks out wider. */}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10 mt-14 mb-14">
        <TeachingPrinciples />
      </div>

      {/* Learning journey diagram — full-width breakout for the circular layout */}
      <div id="learning-journey" className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10 mb-16 scroll-mt-24">
        <LearningJourney />
      </div>

      {/* Discussion and Communication — a shorter standalone section between
          the pyramid and Regulation Before Participation. */}
      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
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
            Language, Communication and Discussion
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-4 max-w-2xl mx-auto leading-relaxed text-left">
            Children are growing up in an increasingly digital environment, with social media, video games and online content competing with time traditionally spent reading and communicating. This changing environment makes opportunities to develop language and communication skills particularly important. Language helps children understand rules, communicate their needs and ideas, consider the consequences of their actions and interact positively with others. Some children have speech, language, and communication needs (SLCN). These children can struggle to express themselves verbally which cause them to get frustrated.
          </p>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-4 max-w-2xl mx-auto leading-relaxed text-left">
            At Rook Foundations, we use games and playful activities to create enjoyable opportunities to develop vocabulary, communication, creativity and thoughtful discussion. Activities include{' '}
            <strong className="font-700 text-[#2D2520]">comprehension games, friendly debates, story starters, dice storytelling, communication cards and word-building games</strong>
            , helping children develop ideas, create stories with a beginning, middle and end, and respectfully explore different perspectives. Through games, children can express ideas, explore language, listen to others and build confidence in communication while learning in an engaging and supportive environment.
          </p>
        </motion.div>
      </div>

      {/* How Games Can Support Participation — table subsection sitting
          directly beneath the Language, Communication & Discussion intro.
          Wider breakout (max-w-4xl vs. the max-w-3xl text column above)
          since a three-column table needs more room to stay scannable. */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10 mt-10 mb-16">
        <CommunicationTable />
      </div>

      {/* Coping with Challenge and Uncertainty — closing subsection of
          Language, Communication and Discussion, sitting in the same
          max-w-3xl text column as that section's own intro so it reads as
          part of the same content, while its own h3 keeps it clearly
          distinguished as a new subsection. */}
      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="font-fredoka text-[#2D2520] text-xl mb-5 leading-snug">
            Coping with Challenge and Uncertainty
          </h3>
          <p className="font-nunito text-[#2D2520] text-lg font-700 leading-snug mb-4">
            Difficulty is not necessarily something to avoid.
          </p>
          <p className="font-nunito text-[#2D2520]/55 text-base max-w-2xl mx-auto leading-relaxed">
            Through games and structured challenges, children learn to tolerate uncertainty, regulate their response to difficulty, consider their options and decide how to respond. We encourage children to reflect on mistakes, try different approaches and learn from their experiences, while understanding that asking for help is a positive part of learning.
          </p>
        </motion.div>
      </div>

      {/* Responding to Challenging Behaviour — sits directly before
          Regulation Before Participation, and links forward into it (the
          RESPOND stage's own inline link, and the larger connector block at
          the end of this component) via the #regulation-before-participation
          anchor on that section below. Wider breakout (max-w-6xl) so the
          five-stage chevron diagram has room. */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10 mb-16">
        <BehaviourFramework />
      </div>

      {/* Regulation Before Participation — sits directly beneath the pyramid,
          before "What Makes Us Different" begins. Anchor id is the scroll
          target for the links inside Responding to Challenging Behaviour
          above. */}
      <div id="regulation-before-participation" className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10 mb-16 scroll-mt-24">
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
