import { motion } from 'framer-motion';
import { Shield, Brain, HandHeart, HeartPulse, Globe, ClipboardCheck } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';

const trainings = [
  {
    icon: Shield, emoji: '🛡️',
    title: 'Safeguarding Children & Young People',
    desc: 'Understanding child protection responsibilities, safeguarding procedures, and safe practice when working with children and young people.',
    color: 'bg-blue-50 border-blue-200', accent: '#4a7eb8',
  },
  {
    icon: Brain, emoji: '🧠',
    title: 'Mental Health & Emotional Wellbeing',
    desc: 'Training focused on emotional wellbeing, resilience, and recognising mental health needs in young people.',
    color: 'bg-purple-50 border-purple-200', accent: '#7a48c0',
  },
  {
    icon: HandHeart, emoji: '🤲',
    title: 'Behaviour Support',
    desc: 'Experience and training in responding calmly and effectively to behaviours that challenge while maintaining supportive environments.',
    color: 'bg-green-50 border-green-200', accent: '#2d8c62',
  },
  {
    icon: HeartPulse, emoji: '🚑',
    title: 'First Aid',
    desc: 'Emergency first aid training completed through professional child-support work and safeguarding environments.',
    color: 'bg-red-50 border-red-200', accent: '#c05050',
  },
  {
    icon: Globe, emoji: '🌍',
    title: 'Equality, Diversity & Inclusion',
    desc: 'Creating respectful, inclusive, and supportive learning environments for children from all backgrounds.',
    color: 'bg-amber-50 border-amber-200', accent: '#b8790a',
  },
  {
    icon: ClipboardCheck, emoji: '📋',
    title: 'Professional Practice & Child Safety',
    desc: 'Additional training in GDPR, record keeping, lone working, safeguarding procedures, and professional boundaries.',
    color: 'bg-teal-50 border-teal-200', accent: '#2a8c88',
  },
];

export default function ProfessionalTraining() {
  return (
    <section className="py-20 bg-[#FAFAF7] relative overflow-hidden">
      <ChessBg variant="training" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-2 mb-4">
            <span className="text-sm">🎓</span>
            <span className="font-nunito text-blue-700 text-sm font-700">Professional training & safeguarding</span>
          </div>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            Your child is in safe hands
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Training completed through professional work in residential care settings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trainings.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`play-card ${t.color} border-2 rounded-3xl p-7`}
              >
                <div className="text-3xl mb-4">{t.emoji}</div>
                <h3 className="font-fredoka text-lg mb-2 leading-snug" style={{ color: t.accent }}>
                  {t.title}
                </h3>
                <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">{t.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}