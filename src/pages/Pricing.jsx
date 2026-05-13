import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

const plans = [
  {
    label: 'Individual',
    subtitle: '1 student',
    tag: null,
    prices: { '1 Hour': { total: 15, note: 'total' }, '2 Hours': { total: 28, note: 'total' } },

    features: [
      'Fully personalised lesson plan',
      'One-to-one instructor attention',
      'Flexible scheduling',
      'Progress report after every session',
    ],
  },
  {
    label: 'Pair',
    subtitle: '2 students',
    tag: 'Recommended',
    prices: { '1 Hour': { total: 30, note: '£15 per student' }, '2 Hours': { total: 56, note: '£28 per student' } },
    features: [
      'Shared learning dynamic',
      'Friendly in-session competition',
      'Same rate as individual per student',
      'Progress report after every session',
    ],
  },
  {
    label: 'Small Group',
    subtitle: '3 students',
    tag: null,
    prices: { '1 Hour': { total: 45, note: '£15 per student' }, '2 Hours': { total: 84, note: '£28 per student' } },
    features: [
      'Group problem solving',
      'Ideal dynamic for three friends',
      'Great for siblings',
      'Progress report after every session',
    ],
  },
  {
    label: 'Group',
    subtitle: '4 students',
    tag: 'Best Value',
    prices: { '1 Hour': { total: 50, note: '£12.50 per student (4)' }, '2 Hours': { total: 100, note: '£25 per student (4)' } },
    features: [
      'Classroom-style experience',
      'Team challenges & competitions',
      'Mini tournaments within sessions',
      'Progress report after every session',
    ],
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Pricing() {
  return (
    <div style={{ backgroundColor: '#0A0A0A' }} className="pt-32">
      {/* Header */}
      <section className="relative overflow-hidden py-20 border-b border-[#D4A843]/15">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <div className="gold-line mx-auto mb-5" />
          <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-4">Pricing</span>
          <h1 className="font-oswald text-white uppercase mb-4"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.02em' }}>
            Transparent, flexible pricing
          </h1>
          <p className="font-lato text-white/50 text-lg leading-relaxed max-w-2xl mx-auto">
            Choose the format that works best for your child. All sessions are in-person, with a qualified instructor. The more students, the better the value.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Duration tabs explainer */}
          <div className="text-center mb-14">
            <p className="font-lato text-white/40 text-sm tracking-wide">
              Prices shown are <span className="text-[#D4A843]">total cost per session</span>. Two session lengths available.
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#D4A843]/10"
          >
            {plans.map((plan, i) => (
              <motion.div
                key={plan.label}
                variants={item}
                className={`relative flex flex-col bg-[#0A0A0A] p-8 hover:bg-[#111] transition-colors duration-300 ${
                  plan.tag === 'Recommended' ? 'border-t-2 border-[#D4A843]' : ''
                } ${
                  plan.tag === 'Best Value' ? 'border-t-2 border-[#C0C0C0]' : ''
                }`}
              >
                {plan.tag === 'Recommended' && (
                  <span className="absolute top-0 right-6 -translate-y-1/2 bg-[#D4A843] text-[#0A0A0A] font-oswald text-xs tracking-widest uppercase px-3 py-1">
                    {plan.tag}
                  </span>
                )}
                {plan.tag === 'Best Value' && (
                  <span className="absolute top-0 right-6 -translate-y-1/2 bg-[#C0C0C0] text-[#0A0A0A] font-oswald text-xs tracking-widest uppercase px-3 py-1">
                    {plan.tag}
                  </span>
                )}

                <div className="mb-6">
                  <h2 className="font-oswald text-white text-2xl uppercase tracking-wide">{plan.label}</h2>
                  <p className="font-lato text-[#D4A843]/60 text-sm mt-1">{plan.subtitle}</p>
                </div>

                {/* Prices */}
                <div className="space-y-4 mb-8 pb-8 border-b border-[#D4A843]/15">
                  {['1 Hour', '2 Hours'].map((duration) => (
                    <div key={duration} className="flex items-end justify-between">
                      <span className="font-lato text-white/40 text-sm">{duration}</span>
                      <div className="text-right">
                        <span className="font-oswald text-[#D4A843] text-2xl">£{plan.prices[duration].total}</span>
                        <span className="font-lato text-white/30 text-xs block">{plan.prices[duration].note}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 font-lato text-white/55 text-sm leading-relaxed">
                      <Check size={14} className="text-[#D4A843] flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className="w-full border border-[#D4A843]/40 text-[#D4A843] font-oswald text-sm tracking-wider py-3 flex items-center justify-center gap-2 hover:bg-[#D4A843] hover:text-[#0A0A0A] transition-all duration-300"
                >
                  BOOK NOW <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Offer CTA */}
      <section className="bg-[#0D0D0D] py-20 border-t border-[#D4A843]/10">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <span className="text-4xl text-[#D4A843] block mb-6">♜</span>
          <div className="gold-line mx-auto mb-6" />
          <div className="inline-block bg-[#D4A843]/10 border border-[#D4A843]/40 px-6 py-2 mb-6">
            <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase">🎉 Limited Offer — 50% Off Your First Lesson</span>
          </div>
          <h2 className="font-oswald text-white text-3xl uppercase tracking-wide mb-4">Not sure where to start?</h2>
          <p className="font-lato text-white/50 text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Book now at half price — no commitment required. We'll assess your child's level and recommend the best format and session length.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-[#D4A843] text-[#0A0A0A] font-oswald font-700 text-sm tracking-wider px-10 py-4 hover:bg-[#e8c06a] transition-all duration-300"
          >
            CLAIM 50% OFF FIRST LESSON <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}