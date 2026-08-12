import { useEffect, useId, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowDown, ArrowUpRight } from 'lucide-react';

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

// Mobile-only diagonal "staircase" — each step nudged further right than
// the last so the row order alone reads as an ascending climb even though
// the page itself only ever scrolls vertically. Box width (62%) and offsets
// (0/13/26/38%) are chosen so the last step's right edge lands exactly at
// the container's right edge, never forcing horizontal scroll.
const STAIR_OFFSETS = [0, 10, 20, 30];
const STAIR_BOX_WIDTH = '70%';

function MobileStaircase() {
  const [activeIndex, setActiveIndex] = useState(null);
  const wrapperRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (activeIndex === null) return;
    function handleOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setActiveIndex(null);
    }
    function handleKey(e) {
      if (e.key === 'Escape') setActiveIndex(null);
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [activeIndex]);

  const toggle = (i) => setActiveIndex((cur) => (cur === i ? null : i));

  return (
    <div ref={wrapperRef} className="md:hidden max-w-sm mx-auto">
      {steps.map((step, i) => {
        const isOpen = activeIndex === i;
        const isLast = i === steps.length - 1;
        return (
          <div key={step.num}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
              style={{ marginLeft: `${STAIR_OFFSETS[i]}%` }}
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                aria-controls={`${panelId}-${i}`}
                style={{ width: STAIR_BOX_WIDTH, backgroundColor: step.accent }}
                className="relative flex items-center gap-3 rounded-2xl py-3.5 px-4 shadow-md text-left transition-transform duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F3EE]"
              >
                <span className="font-fredoka text-white/70 text-xl flex-shrink-0">
                  {String(step.num).padStart(2, '0')}
                </span>
                <span className="font-fredoka text-white text-sm leading-snug flex-1 pr-1">{step.title}</span>
                {isLast && (
                  <span className="absolute top-2.5 right-3 text-white/70 text-sm leading-none" aria-hidden="true">♜</span>
                )}
              </button>
            </motion.div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  id={`${panelId}-${i}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 mb-1 bg-white border border-[#2D2520]/8 rounded-2xl px-4 py-3.5 shadow-sm">
                    <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">{step.body}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isLast && (
              <div
                className="flex py-2"
                style={{ marginLeft: `${(STAIR_OFFSETS[i] + STAIR_OFFSETS[i + 1]) / 2}%` }}
                aria-hidden="true"
              >
                <ArrowUpRight size={18} strokeWidth={2.5} className="text-[#E8A020]/60" />
              </div>
            )}
          </div>
        );
      })}
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
          The booking process will be simple and every lesson will be personalised from the very first session.
        </p>
      </motion.div>

      {/* Mobile — diagonal ascending staircase, tap a stage to reveal its description */}
      <MobileStaircase />

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
