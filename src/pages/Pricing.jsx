import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Coins } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import PeopleIcon from '@/components/pricing/PeopleIcon';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';
import Reveal from '@/components/ui/Reveal';

const EASE = [0.22, 1, 0.36, 1];

const DURATIONS = ['30 Minutes', '60 Minutes', '90 Minutes'];

const plans = [
  {
    label: 'Individual',
    people: 1,
    subtitle: '1 student',
    descriptor: 'Personalised Learning',
    descriptorStyle: 'bg-[#7a48c0] text-white',
    cardStyle: 'bg-[#7a48c0]/10 border-[#7a48c0]/30',
    features: ['Fully personalised lesson plan', 'One-to-one instructor attention', 'Deeper conceptual learning'],
  },
  {
    label: 'Pair',
    people: 2,
    subtitle: '2 students',
    descriptor: 'Learning Together',
    descriptorStyle: 'bg-[#b8790a] text-white',
    cardStyle: 'bg-amber-50/60 border-[#E8A020]/30 shadow-lg shadow-[#E8A020]/8',
    features: ['Shared learning dynamic', 'Friendly in-session competition', 'Great for siblings or friends'],
  },
  {
    label: 'Group',
    people: 4,
    subtitle: '3-4 students',
    descriptor: 'Collaborative Learning',
    descriptorStyle: 'bg-[#2d8c62] text-white',
    cardStyle: 'bg-green-50/60 border-green-200',
    features: ['Cooperative problem solving', 'Team challenges & competitions', 'Rotate through different strategy games'],
  },
];

export default function Pricing() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-32">
      {/* Header */}
      <section className="relative overflow-hidden py-20">
        <ChessBg variant="pricing" />
        <Reveal className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-5">
            <Coins size={14} /> Simple, honest pricing
          </span>
          <h1 className="font-fredoka text-[#2D2520] leading-[1.1] mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            What does it cost?
          </h1>
          <p className="font-fredoka text-[#E8A020] mb-6" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
            Pricing is currently being finalised
          </p>
          <p className="font-nunito text-[#2D2520]/65 text-lg leading-relaxed max-w-2xl mx-auto">
            Rook Foundations is currently in its pilot and development stage. As I begin working with children across different ages, group sizes and settings, I'm taking the time to make sure our session structure and pricing are fair and appropriate for families.
          </p>
          <p className="font-nunito text-[#2D2520] text-lg leading-relaxed font-600 mt-4 max-w-2xl mx-auto">
            Final pricing will be confirmed when bookings open.
          </p>
        </Reveal>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 pb-24 relative overflow-hidden">
        <ChessBg variant="page" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-10">
            <p className="font-nunito text-[#2D2520]/50 text-sm font-600">
              Each format below is available across <span className="text-[#E8A020] font-700">three session lengths</span>.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.label}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                className={`play-card relative flex flex-col border rounded-3xl p-7 ${plan.cardStyle}`}
              >
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 ${plan.descriptorStyle} font-nunito text-xs font-700 px-4 py-1.5 rounded-full shadow-md whitespace-nowrap`}>
                  {plan.descriptor}
                </span>

                <div className="flex justify-center mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#E8A020]/10 md:w-auto md:h-auto md:rounded-none md:bg-transparent flex items-center justify-center">
                    <PeopleIcon count={plan.people} size={40} style={{ color: '#E8A020' }} />
                  </div>
                </div>
                <div className="mb-5">
                  <h2 className="font-fredoka text-[#2D2520] text-2xl">{plan.label}</h2>
                  <p className="font-nunito text-[#E8A020] text-sm font-600 mt-0.5">{plan.subtitle}</p>
                </div>

                {/* Session lengths */}
                <div className="grid grid-cols-3 gap-2 mb-7 pb-7 border-b border-[#2D2520]/10">
                  {DURATIONS.map((duration) => (
                    <div
                      key={duration}
                      className="bg-[#2D2520]/5 rounded-2xl py-3.5 px-1 text-center"
                    >
                      <span className="font-nunito text-[#2D2520]/75 text-xs sm:text-sm font-700">
                        {duration}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <ul className="space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
                      <span className="w-5 h-5 bg-[#E8A020] rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                        <Check size={11} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why is pricing being finalised? */}
      <section className="py-16 bg-white border-y border-[#2D2520]/8">
        <div className="max-w-2xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
              Why is pricing being finalised?
            </h2>
            <p className="font-nunito text-[#2D2520]/60 text-base leading-relaxed mt-4">
              I'm currently using pilot sessions and workshops to understand how different session lengths, group sizes and learning environments work best for children. This will help me develop a pricing structure that is fair for families while allowing Rook Foundations to provide the quality and personalised support at the heart of the programme.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What happens next? */}
      <section className="bg-[#F5F3EE] py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-xl mx-auto px-6 lg:px-12 text-center"
        >
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>
            What happens next?
          </h2>
          <p className="font-nunito text-[#2D2520]/60 text-base leading-relaxed mt-4">
            Rook Foundations is currently preparing for launch. As the pilot sessions and workshops develop, I'll continue refining the session structure and pricing before bookings open.
          </p>
          <p className="font-nunito text-[#2D2520]/60 text-base leading-relaxed mt-4 mb-8">
            If you'd like to hear when sessions become available, I'd love to hear from you.
          </p>
          <MotionLink
            whileTap={ctaTap}
            to="/contact"
            className="group inline-flex items-center gap-2 bg-[#E8A020] text-white font-fredoka font-600 text-sm px-6 py-3.5 rounded-2xl hover:bg-[#d4940e] transition-all hover:shadow-lg hover:shadow-[#E8A020]/20"
          >
            Get in Touch
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </MotionLink>
        </motion.div>
      </section>

      {/* Offer CTA */}
      <section className="bg-[#E8A020] py-20 relative overflow-hidden">
        <ChessBg variant="pricingcta" color="#ffffff" />
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className="mb-6 text-center">
            <span className="text-white leading-none" style={{ fontSize: '2.5rem' }}>♜</span>
          </div>
          <h2 className="font-fredoka text-white text-3xl mb-4">Not sure where to start?</h2>
          <p className="font-nunito text-white/80 text-base leading-relaxed mb-8 max-w-xl mx-auto">
            We'll assess your child's approach to learning and recommend the most suitable format and session length.
          </p>
          <MotionLink
            whileTap={ctaTap}
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#E8A020] font-fredoka font-600 text-lg px-10 py-4 rounded-2xl hover:bg-[#fdf6e8] transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Book a £5 Trial Session <ArrowRight size={18} />
          </MotionLink>
        </div>
      </section>
    </div>
  );
}
