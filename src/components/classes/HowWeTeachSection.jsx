import { motion } from 'framer-motion';
import { Compass, Sparkles, Users } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import LearningJourney from '@/components/about/LearningJourney';
import InteractiveRookPillars from '@/components/about/InteractiveRookPillars';
import IndividualGroupSessions from '@/components/about/IndividualGroupSessions';
import ProgressTrackingSection from '@/components/classes/ProgressTrackingSection';
import LearningNetworkHero from '@/components/classes/LearningNetworkHero';

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
          <p className="font-nunito text-[#2D2520]/55 text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Chess and strategy games are simply the vehicle. What actually shapes how your child grows with us is a consistent six-stage journey that repeats and deepens with every session. We don't claim these skills transfer automatically, but nurtured through relationship, challenge and reflection like this, they very often do.
          </p>
        </motion.div>
      </div>

      {/* Learning journey diagram — full-width breakout for the circular layout */}
      <div id="learning-journey" className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10 mb-16 scroll-mt-24">
        <LearningJourney />
      </div>

      {/* What Makes Us Different — standalone heading for the three-pillar rook */}
      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
            <Sparkles size={14} /> What sets us apart
          </span>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            What Makes Us Different?
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-3 max-w-xl mx-auto leading-relaxed">
            These three principles guide everything we teach, and they're what set Rook Foundations apart from traditional chess coaching and many other educational programmes.
          </p>
        </motion.div>

        {/* Core principles — interactive rook illustration */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="mb-14"
        >
          <InteractiveRookPillars />
        </motion.div>
      </div>

      {/* How We Track Your Child's Progress */}
      <ProgressTrackingSection />

      {/* Connected-games network — introduces the wider learning ecosystem */}
      <div className="mb-16">
        <LearningNetworkHero />
      </div>

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
