import { motion } from 'framer-motion';
import { Shield, Brain, HandHeart, HeartPulse, Globe, ClipboardCheck, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';

const trainings = [
  {
    icon: Shield, emoji: '🛡️',
    title: 'Safeguarding Children & Young People',
    desc: 'Understanding child protection responsibilities, safeguarding procedures, and safe practice when working with children and young people.',
    accent: '#4a7eb8',
  },
  {
    icon: Brain, emoji: '🧠',
    title: 'Mental Health & Emotional Wellbeing',
    desc: 'Training focused on emotional wellbeing, resilience, and recognising mental health needs in young people.',
    accent: '#7a48c0',
  },
  {
    icon: HandHeart, emoji: '🤲',
    title: 'Behaviour Support',
    desc: 'Experience and training in responding calmly and effectively to behaviours that challenge while maintaining supportive environments.',
    accent: '#2d8c62',
  },
  {
    icon: HeartPulse, emoji: '🚑',
    title: 'First Aid',
    desc: 'Emergency first aid training completed through professional child-support work and safeguarding environments.',
    accent: '#c05050',
  },
  {
    icon: Globe, emoji: '🌍',
    title: 'Equality, Diversity & Inclusion',
    desc: 'Creating respectful, inclusive, and supportive learning environments for children from all backgrounds.',
    accent: '#b8790a',
  },
  {
    icon: ClipboardCheck, emoji: '📋',
    title: 'Professional Practice & Child Safety',
    desc: 'Additional training in GDPR, record keeping, lone working, safeguarding procedures, and professional boundaries.',
    accent: '#2a8c88',
  },
];

export default function ProfessionalTraining() {
  return (
    <section className="py-20 bg-[#FAFAF7] relative overflow-hidden">
      <ChessBg variant="training" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 font-nunito text-blue-700 text-sm font-800 uppercase tracking-widest mb-4">
            <GraduationCap size={14} /> Professional training & safeguarding
          </span>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            Your child is in safe hands
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Training completed through professional work in residential care settings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {trainings.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group"
              >
                <div className="mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"><Icon size={28} style={{ color: t.accent }} /></div>
                <h3 className="font-fredoka text-lg mb-2 leading-snug" style={{ color: t.accent }}>
                  {t.title}
                </h3>
                <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">{t.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 pt-14 border-t border-[#2D2520]/10 text-center max-w-xl mx-auto"
        >
          <p className="font-nunito text-[#2D2520]/65 text-base leading-relaxed mb-6">
            Every session is guided by a written risk assessment covering safeguarding, health and safety, and emergency procedures. Parents and schools are welcome to read it in full.
          </p>
          <MotionLink
            whileTap={ctaTap}
            to="/risk-assessment"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 bg-[#E8A020] text-white font-fredoka font-600 text-base px-8 py-3.5 rounded-2xl hover:bg-[#d4940e] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#E8A020]/25"
          >
            <ShieldCheck size={18} />
            View our Risk Assessment
            <ArrowRight size={16} />
          </MotionLink>
        </motion.div>
      </div>
    </section>
  );
}
