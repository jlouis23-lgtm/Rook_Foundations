import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

const steps = [
  {
    num: 1,
    accent: '#2d8c62',
    title: 'Choose Your Session',
    body: "Select the session that best suits your child's learning needs.",
  },
  {
    num: 2,
    accent: '#4a7eb8',
    title: 'Complete Your Booking',
    body: 'Choose a convenient time and complete the booking form with a few details about your child.',
  },
  {
    num: 3,
    accent: '#7a48c0',
    title: 'Receive Your Confirmation',
    body: "You'll receive a confirmation email containing your booking details and everything you need before the session.",
  },
  {
    num: 4,
    accent: '#c05050',
    title: 'Begin Your Learning Journey',
    body: "We'll prepare a personalised session and begin getting to know your child through carefully selected strategy games.",
  },
];

function Step({ step, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: EASE }}
      className="flex flex-col items-center text-center flex-1"
    >
      <span
        className="w-12 h-12 rounded-full flex items-center justify-center font-fredoka text-white text-lg flex-shrink-0 shadow-md"
        style={{ backgroundColor: step.accent, boxShadow: `0 6px 16px ${step.accent}40` }}
      >
        {step.num}
      </span>
      <h3 className="font-fredoka text-[#2D2520] text-lg mt-4 mb-2">{step.title}</h3>
      <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed max-w-[15rem]">{step.body}</p>
    </motion.div>
  );
}

function Connector({ index }) {
  return (
    <div className="flex items-center justify-center flex-shrink-0" aria-hidden="true">
      <motion.span
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: EASE, delay: index * 0.15 }}
        className="hidden lg:block text-[#E8A020]/70 mt-6"
      >
        <ArrowRight size={26} strokeWidth={2.5} />
      </motion.span>
      <motion.span
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: EASE, delay: index * 0.15 }}
        className="lg:hidden text-[#E8A020]/70"
      >
        <ArrowDown size={26} strokeWidth={2.5} />
      </motion.span>
    </div>
  );
}

export default function WhatHappensNextSection() {
  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        className="text-center mb-12"
      >
        <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
          What Happens Next?
        </h2>
        <p className="font-nunito text-[#2D2520]/55 text-base mt-3 max-w-xl mx-auto leading-relaxed">
          Booking is simple, and every lesson is personalised from the very first session.
        </p>
      </motion.div>

      {/* Mobile — vertical stack with connecting arrows */}
      <div className="flex md:hidden flex-col items-center gap-2 max-w-xs sm:max-w-sm mx-auto">
        {steps.map((step, i) => (
          <div key={step.num} className="flex flex-col items-center w-full">
            <Step step={step} index={i} />
            {i < steps.length - 1 && <Connector index={i} />}
          </div>
        ))}
      </div>

      {/* Tablet — balanced 2x2 grid; the numbers alone carry the sequence
          here rather than forcing an awkward snaking connector between rows */}
      <div className="hidden md:grid lg:hidden grid-cols-2 gap-x-10 gap-y-12 max-w-xl mx-auto">
        {steps.map((step, i) => (
          <Step key={step.num} step={step} index={i} />
        ))}
      </div>

      {/* Desktop — horizontal row with connecting arrows */}
      <div className="hidden lg:flex items-start">
        {steps.map((step, i) => (
          <div key={step.num} className="flex items-start flex-1">
            <Step step={step} index={i} />
            {i < steps.length - 1 && <Connector index={i} />}
          </div>
        ))}
      </div>
    </div>
  );
}
