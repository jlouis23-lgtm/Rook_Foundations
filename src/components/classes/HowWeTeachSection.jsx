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
import IndependenceModel from '@/components/classes/IndependenceModel';
import ActivityTable from '@/components/classes/ActivityTable';

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
            Games of strategy provide joyful opportunities to process new information, adapt to different rules and evaluate the choices of others. They are the vehicle. What shapes how a child develops is a six-stage learning journey, continually refined through each session. Our approach is child-centred and informed by established ideas about how children learn, communicate and participate, including the{' '}
            <a
              href="https://www.qub.ac.uk/research-centres/centre-for-childrens-rights/childrens-rights-research/lundy-model/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[#2D2520]/25 hover:decoration-[#2D2520]/60 hover:text-[#2D2520]/75 transition-colors"
            >
              Lundy Model of Child Participation
            </a>
            .
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
            Children are growing up in an increasingly digital environment, making opportunities to develop language and communication particularly important. Language helps children understand rules, express needs and ideas, consider consequences and interact positively with others. For children with speech, language and communication needs (SLCN), expressing themselves verbally can be difficult and frustrating. At Rook Foundations, games and playful activities create enjoyable opportunities to develop vocabulary, communication, creativity and thoughtful discussion, helping children express ideas, explore language, listen to others and build confidence.
          </p>
        </motion.div>
      </div>

      {/* Activity table — sits directly beneath the (now single) Language,
          Communication and Discussion paragraph, before the existing "How
          Games Can Support Communication" table. Compact max-w-2xl (matching
          the intro paragraph's own width) rather than a wide breakout, per
          the brief's explicit "don't stretch across the full page width". */}
      <div className="max-w-2xl mx-auto px-6 lg:px-12 relative z-10 mt-10">
        <ActivityTable />
      </div>

      {/* How Games Can Support Participation — table subsection sitting
          directly beneath the Language, Communication & Discussion intro.
          Wider breakout (max-w-4xl vs. the max-w-3xl text column above)
          since a three-column table needs more room to stay scannable. */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10 mt-10 mb-16">
        <CommunicationTable />
      </div>

      {/* Puzzle & Exploration Kit — a full top-level section (own eyebrow +
          h2, matching the page's other main sections exactly) sitting
          between Language, Communication and Discussion and Regulation
          Before Participation, per the page's defined section order. */}
      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
            Hands-on exploration
          </span>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            Puzzle &amp; Exploration Kit
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-3 max-w-2xl mx-auto leading-relaxed">
            The Puzzle &amp; Exploration Kit provides children with a range of hands-on objects to explore, touch and experiment with. It includes puzzles, shapes with different geometries such as cubes, and objects with a variety of tactile qualities that children can manipulate and investigate at their own pace. The kit creates opportunities for curiosity, problem solving, spatial exploration and persistence through hands-on discovery. For some children, particularly those who find conventional activities difficult, tactile and sensory exploration can provide another route into meaningful participation.
          </p>
        </motion.div>
      </div>

      {/* Regulation Before Participation — sits directly after "Language,
          Communication and Discussion" and before "Building Independence
          Through Challenge", per the page's defined section order. Anchor id
          is the scroll target for the RESPOND-stage link inside "Responding
          to Challenging Behaviour" further down the page. */}
      <div id="regulation-before-participation" className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10 mb-16 scroll-mt-24">
        <RegulationStrategies />
      </div>

      {/* Building Independence Through Challenge — a full top-level section
          (own eyebrow + h2, matching Regulation Before Participation and the
          page's other main sections exactly) sitting between Regulation
          Before Participation and Responding to Challenging Behaviour, per
          the page's defined section order. The EEF framework reference below
          matches the styling of the equivalent reference in Responding to
          Challenging Behaviour exactly (italic, text-sm, /55 opacity). */}
      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
            Supporting independence
          </span>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            Building Independence Through Challenge
          </h2>
          <p className="font-nunito text-[#2D2520] text-lg font-700 leading-snug mt-5 mb-4">
            Difficulty is not necessarily something to avoid
          </p>
          <p className="font-nunito text-[#2D2520]/55 text-base max-w-2xl mx-auto leading-relaxed">
            Through games and structured challenges, children have opportunities to tolerate uncertainty, respond to difficulty, consider their options and decide how to respond. We encourage children to reflect on mistakes, try different approaches and learn from their experiences, while understanding that asking for help is a positive part of learning.
          </p>
          <p className="font-nunito text-[#2D2520]/55 text-base max-w-2xl mx-auto leading-relaxed mt-4">
            When a child gets stuck, we aim to support them without immediately solving the problem for them. We may give them time to think, ask a question, offer a clue, model an approach or provide more direct guidance when needed. When a child is learning a new strategy, we may initially provide a full example or model of how to approach a task. As their understanding develops, we gradually remove elements of this support, giving them more responsibility for completing the task themselves. The aim is to help children move from supported practice towards independent application, while preserving opportunities for independent thinking and problem solving.
          </p>
        </motion.div>
      </div>

      {/* The Rook Foundations model for building independence through
          challenge — an original seven-stage diagram (structure only
          inspired by a reference image; colours/branding are the site's own).
          Wider breakout (max-w-6xl) than the max-w-3xl text column either
          side of it, since seven stages need more room than the surrounding
          paragraphs. */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10 mt-10">
        <IndependenceModel />
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="font-nunito text-[#2D2520]/55 text-sm leading-relaxed italic mt-6 max-w-2xl mx-auto">
            Our approach to developing independence is informed by the{' '}
            <a
              href="https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/metacognition"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[#2D2520]/25 hover:decoration-[#2D2520]/60 hover:text-[#2D2520]/75 transition-colors not-italic"
            >
              Education Endowment Foundation's Seven Step Model for teaching metacognitive strategies
            </a>
            , which describes a progression from activating prior knowledge and explicit instruction through modelling and guided practice to independent practice and structured reflection. Rook Foundations has adapted these principles for its own educational enrichment context.
          </p>
        </motion.div>
      </div>

      {/* Responding to Challenging Behaviour — sits directly before "What
          Makes Us Different" begins, and links back up into Regulation
          Before Participation above (the RESPOND stage's own inline link)
          via the #regulation-before-participation anchor. Wider breakout
          (max-w-6xl) so the five-stage chevron diagram has room. */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10 mb-16">
        <BehaviourFramework />
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
