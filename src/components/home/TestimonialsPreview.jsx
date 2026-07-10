import { motion } from 'framer-motion';
import { Heart, Brain, Sprout, Target, Handshake } from 'lucide-react';

const values = [
  {
    Icon: Brain,
    accent: '#4a7eb8',
    heading: 'They Learn to Think',
    body: 'Every move on the chess board teaches children to slow down, consider their options, and act with intention. These kind of learning extends far beyond the game.',
  },
  {
    Icon: Sprout,
    accent: '#2d8c62',
    heading: 'Confidence Blooms Naturally',
    body: 'Children discover that making mistakes is a part of learning, thinking outside of the box is encouraged, and that confidence emerges when taking worthy risks.',
  },
  {
    Icon: Target,
    accent: '#7a48c0',
    heading: 'Focus Grows with Every Game',
    body: 'Chess and similar games provide opportunities to develop stronger focus and patience.',
  },
  {
    Icon: Handshake,
    accent: '#b8790a',
    heading: 'A Place They Feel Supported',
    body: 'Small groups, personalised attention, and a warm teaching style mean every child feels seen, heard, and valued from their very first session.',
  },
];

import ChessBg from '@/components/ui/ChessBg';

export default function TestimonialsPreview() {
  return (
    <section className="bg-[#FAFAF7] py-24 relative overflow-hidden">
      <ChessBg variant="testimonials" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 font-nunito text-green-700 text-sm font-800 uppercase tracking-widest mb-4">
            <Heart size={14} /> What families can look forward to
          </span>
          <h2 className="font-fredoka text-[#2D2520] leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            More than chess lessons.
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base max-w-xl mx-auto leading-relaxed">
            Parents tell us the biggest changes happen away from the chess board — in school, at home, and in how their child sees the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group flex items-start gap-4 cursor-default"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                style={{ backgroundColor: `${v.accent}14` }}>
                <v.Icon size={24} style={{ color: v.accent }} />
              </div>
              <div>
                <h3 className="font-fredoka text-xl mb-2" style={{ color: v.accent }}>
                  {v.heading}
                </h3>
                <p className="font-nunito text-[#2D2520]/70 text-sm leading-relaxed">{v.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
