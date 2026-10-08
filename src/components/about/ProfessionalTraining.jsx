import { motion } from 'framer-motion';
import ChessBg from '@/components/ui/ChessBg';

const trainings = [
  {
    title: 'Safeguarding Children & Young People',
    desc: 'Understanding child protection responsibilities, safeguarding procedures, and safe practice when working with children and young people.',
    accent: '#4a7eb8',
  },
  {
    title: 'Mental Health & Emotional Wellbeing',
    desc: 'Training focused on emotional wellbeing, resilience, and recognising mental health needs in young people.',
    accent: '#7a48c0',
  },
  {
    title: 'Behaviour Support',
    desc: 'Experience and training in responding calmly and effectively to behaviours that challenge while maintaining supportive environments.',
    accent: '#2d8c62',
  },
  {
    title: 'First Aid',
    desc: 'Emergency first aid training completed through professional child-support work and safeguarding environments.',
    accent: '#c05050',
  },
  {
    title: 'Equality, Diversity & Inclusion',
    desc: 'Creating respectful, inclusive, and supportive learning environments for children from all backgrounds.',
    accent: '#b8790a',
  },
  {
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
            Professional training & safeguarding
          </span>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            Your child is in safe hands
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Training completed through professional work in residential care settings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
          {trainings.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <h3 className="font-fredoka text-lg mb-2 leading-snug" style={{ color: t.accent }}>
                {t.title}
              </h3>
              <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
