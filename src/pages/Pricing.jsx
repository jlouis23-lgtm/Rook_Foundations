import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';

const plans = [
  {
    label: 'Individual',
    emoji: '🧒',
    subtitle: '1 student',
    tag: null,
    tagStyle: '',
    cardStyle: 'bg-white border-[#E8A020]/20',
    prices: { '1 Hour': { total: 15, note: 'total' }, '2 Hours': { total: 25, note: 'total' } },
    features: ['Fully personalised lesson plan', 'One-to-one instructor attention', 'Deeper conceptual learning', 'Progress report every session'],
  },
  {
    label: 'Pair',
    emoji: '👫',
    subtitle: '2 students',
    tag: 'Most Popular',
    tagStyle: 'bg-[#E8A020] text-white',
    cardStyle: 'bg-amber-50 border-[#E8A020]/40 shadow-xl shadow-[#E8A020]/10',
    prices: { '1 Hour': { total: 20, note: '£10 per student' }, '2 Hours': { total: 30, note: '£15 per student' } },
    features: ['Shared learning dynamic', 'Friendly in-session competition', 'Great for siblings or friends', 'Progress report every session'],
  },
  {
    label: 'Small Group',
    emoji: '👨‍👩‍👧',
    subtitle: '3-4 students',
    tag: null,
    tagStyle: '',
    cardStyle: 'bg-white border-[#E8A020]/20',
    prices: { '1 Hour': { total: 25, note: '£6.25 per student' }, '2 Hours': { total: 30, note: '£7.50 per student' } },
    features: ['Group problem solving', 'Collaborative & individual learning', 'Ideal for three friends', 'Progress report every session'],
  },
  {
    label: 'Group',
    emoji: '🎉',
    subtitle: '5-7 students',
    tag: 'Best Value',
    tagStyle: 'bg-green-500 text-white',
    cardStyle: 'bg-green-50 border-green-200',
    prices: { '1 Hour': { total: 30, note: '£4.29 per student' }, '2 Hours': { total: 35, note: '£5.00 per student' } },
    features: ['Cooperative problem solving', 'Team challenges & competitions', 'Mini tournaments within sessions', 'Progress report every session'],
  },
];

export default function Pricing() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-32">
      {/* Header */}
      <section className="relative overflow-hidden py-20">
        <ChessBg variant="pricing" />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#E8A020]/12 border border-[#E8A020]/25 rounded-full px-4 py-2 mb-5">
            <span className="text-sm">💰</span>
            <span className="font-nunito text-[#b8790a] text-sm font-700">Simple, honest pricing</span>
          </div>
          <h1 className="font-fredoka text-[#2D2520] mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            What does it cost?
          </h1>
          <p className="font-nunito text-[#2D2520]/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Choose the format that works best for your family. All sessions are in-person, with a patient and child-friendly instructor. Our approach is working in small groups, tailoring learning and maximising growth.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 pb-24 relative overflow-hidden">
        <ChessBg variant="page" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-10">
            <p className="font-nunito text-[#2D2520]/50 text-sm font-600">
              Prices shown are <span className="text-[#E8A020] font-700">total cost per session</span>. Two session lengths available.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.label}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                className={`play-card relative flex flex-col border-2 rounded-3xl p-7 ${plan.cardStyle}`}
              >
                {plan.tag && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 ${plan.tagStyle} font-nunito text-xs font-700 px-4 py-1.5 rounded-full shadow-md`}>
                    {plan.tag}
                  </span>
                )}

                <div className="text-4xl mb-3">{plan.emoji}</div>
                <div className="mb-5">
                  <h2 className="font-fredoka text-[#2D2520] text-2xl">{plan.label}</h2>
                  <p className="font-nunito text-[#E8A020] text-sm font-600 mt-0.5">{plan.subtitle}</p>
                </div>

                {/* Prices */}
                <div className="space-y-3 mb-7 pb-7 border-b-2 border-[#E8A020]/12">
                  {['1 Hour', '2 Hours'].map((duration) => (
                    <div key={duration} className="flex items-end justify-between">
                      <span className="font-nunito text-[#2D2520]/50 text-sm font-600">{duration}</span>
                      <div className="text-right">
                        <span className="font-fredoka text-[#E8A020] text-2xl">£{plan.prices[duration].total}</span>
                        <span className="font-nunito text-[#2D2520]/40 text-xs block">{plan.prices[duration].note}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <ul className="space-y-3 flex-1 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
                      <span className="w-5 h-5 bg-[#E8A020] rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                        <Check size={11} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className="w-full bg-[#E8A020] text-white font-fredoka font-600 text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#d4940e] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#E8A020]/20"
                >
                  Book Now <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Offer CTA */}
      <section className="bg-[#E8A020] py-20 relative overflow-hidden">
        <ChessBg variant="pricingcta" color="#ffffff" />
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className="text-4xl mb-5">♜</div>
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-5 py-2 mb-6">
            <span className="font-nunito text-white font-700 text-sm">🎉 Limited Time — 50% Off Your First Lesson</span>
          </div>
          <h2 className="font-fredoka text-white text-3xl mb-4">Not sure where to start?</h2>
          <p className="font-nunito text-white/80 text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Book at half price — no long-term commitment. We'll assess your child's level and recommend the perfect format and session length.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#E8A020] font-fredoka font-600 text-lg px-10 py-4 rounded-2xl hover:bg-[#fdf6e8] transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Claim 50% Off First Lesson <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}