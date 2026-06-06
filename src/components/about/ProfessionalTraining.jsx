import { motion } from 'framer-motion';
import { Shield, Brain, HandHeart, HeartPulse, Globe, ClipboardCheck } from 'lucide-react';

const trainings = [
{
  icon: Shield,
  title: 'Safeguarding Children & Young People',
  desc: 'Understanding child protection responsibilities, safeguarding procedures, and safe practice when working with children and young people.',
  accent: '#4a7eb8',
  color: 'from-[#ddeaf7] to-[#cce0f5]',
  border: 'border-[#7aa8d4]/30',
},
{
  icon: Brain,
  title: 'Mental Health & Emotional Wellbeing',
  desc: 'Training focused on emotional wellbeing, resilience, and recognising mental health needs in young people.',
  accent: '#7a48c0',
  color: 'from-[#ece0f5] to-[#e2d0f0]',
  border: 'border-[#9a70c8]/30',
},
{
  icon: HandHeart,
  title: 'Behaviour Support',
  desc: 'Experience and training in responding calmly and effectively to behaviours that challenge while maintaining supportive environments.',
  accent: '#2d8c62',
  color: 'from-[#d8f0e6] to-[#c8eada]',
  border: 'border-[#4a8c6e]/30',
},
{
  icon: HeartPulse,
  title: 'First Aid',
  desc: 'Emergency first aid training completed through professional child-support work and safeguarding environments.',
  accent: '#c05050',
  color: 'from-[#f5e0e0] to-[#f0d0d0]',
  border: 'border-[#c08080]/30',
},
{
  icon: Globe,
  title: 'Equality, Diversity & Inclusion',
  desc: 'Creating respectful, inclusive, and supportive learning environments for children from all backgrounds.',
  accent: '#b8902e',
  color: 'from-[#faefd5] to-[#f5e4b8]',
  border: 'border-[#D4A843]/35',
},
{
  icon: ClipboardCheck,
  title: 'Professional Practice & Child Safety',
  desc: 'Additional training in GDPR, record keeping, lone working, safeguarding procedures, and professional boundaries.',
  accent: '#2a8c88',
  color: 'from-[#d8f0ee] to-[#c8eae8]',
  border: 'border-[#3a9c98]/30',
},
];

export default function ProfessionalTraining() {
  return (
    <section className="py-24 border-t border-[#D4A843]/10" style={{ backgroundColor: '#FAFAF7' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="text-center mb-16">
          <div className="gold-line mx-auto mb-5" />
          <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-4">
            Professional Training & Safeguarding
          </span>
          <h2
            className="font-oswald text-[#1C1C1E] uppercase"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', letterSpacing: '0.02em' }}
          >
            Training & child-centred practice
          </h2>
          <p className="font-lato text-[#2D2B26]/55 text-base mt-4 max-w-xl mx-auto leading-relaxed">
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
                className={`relative rounded-2xl border ${t.border} bg-gradient-to-br ${t.color} p-7
                  hover:scale-[1.015] transition-transform duration-300`}
                style={{ boxShadow: `0 4px 24px 0 ${t.accent}0d` }}
              >
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: t.accent }} />
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${t.accent}18`, border: `1px solid ${t.accent}30` }}
                >
                  <Icon size={18} style={{ color: t.accent }} />
                </div>
                <h3 className="font-oswald text-[#1C1C1E] text-base uppercase tracking-wide leading-snug mb-3">
                  {t.title}
                </h3>
                <div className="w-6 h-px mb-3 opacity-35" style={{ backgroundColor: t.accent }} />
                <p className="font-lato text-[#2D2B26]/65 text-sm leading-relaxed">{t.desc}</p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}