import { motion } from 'framer-motion';
import { Compass, Users } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import LearningJourney from '@/components/about/LearningJourney';
import IndividualGroupSessions from '@/components/about/IndividualGroupSessions';
import ProgressTrackingSection from '@/components/classes/ProgressTrackingSection';
import ChessCurriculumButton from '@/components/classes/ChessCurriculumButton';

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
            Games of strategy provide joyful opportunities when processing new information, adapting to different rules, and evaluating the choices of others. They are the vehicle. What shapes how your child grows with us is a consistent six-stage journey that repeats and deepens with every session. We don't claim these skills transfer automatically. But rest assured, our sessions are nurtured through relationship, challenge, and reflection. We bring the engagement and provide the encouragement for children to approach challenges that they might otherwise find difficult or unwilling to approach on their own.
          </p>

          <ChessCurriculumButton className="mt-8" />
        </motion.div>
      </div>

      {/* Learning journey diagram — full-width breakout for the circular layout */}
      <div id="learning-journey" className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10 mb-16 scroll-mt-24">
        <LearningJourney />
      </div>

      {/* What Makes Us Different — heading for the merged philosophy +
          progress-tracking narrative that follows (ProgressTrackingSection
          below has no major heading of its own, by design) */}
      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
            What sets us apart
          </span>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            What Makes Us Different?
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-3 max-w-xl mx-auto leading-relaxed">
            What truly sets us apart is how closely we track your child's progress. Every session builds on personalised learning targets shaped by careful observation, not guesswork — here's exactly how that works.
          </p>
        </motion.div>
      </div>

      {/* How We Track Your Child's Progress */}
      <ProgressTrackingSection />

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
