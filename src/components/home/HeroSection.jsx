import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star, ShieldCheck, ScanEye, Lightbulb, Sprout, Users } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';

const trustItems = [
  {
    content: (
      <>Proud member of <a href="https://www.wholeschoolsend.org.uk/page/nasen-home-page" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#E8A020] transition-colors">NASEN</a></>
    ),
  },
  { content: 'Connected with English Chess Federation' },
  { content: 'Enhanced DBS Checked' },
  { content: 'Safeguarding Trained' },
];

const features = [
  {
    Icon: ScanEye,
    accent: '#4a7eb8',
    tag: 'Focus & Confidence',
    title: 'Confidence, one move at a time',
    body: 'Fun, in-person strategy games — including chess — help children aged 5–12 build focus and strong decision-making skills.',
  },
  {
    Icon: Lightbulb,
    accent: '#b8790a',
    tag: 'Strategic Thinking',
    title: 'Skills that go beyond the board',
    body: 'Every lesson encourages children to think ahead, weigh up possibilities, and make thoughtful decisions with confidence.',
  },
  {
    Icon: Sprout,
    accent: '#2d8c62',
    tag: 'Supportive Growth',
    title: 'Growth at their own pace',
    body: 'A patient, positive environment where learning is enjoyable and every child is encouraged to grow from both success and mistakes.',
  },
];

export default function HeroSection() {
  return (
    <section className="relative bg-[#FAFAF7] overflow-hidden pt-36 pb-20 lg:pb-24">

      <ChessBg variant="hero" />

      {/* Floating sparkles */}
      <motion.div
        animate={{ y: [-8, 8, -8], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-32 right-1/4 text-[#E8A020]/40 pointer-events-none hidden lg:block"
      ><Sparkles size={36} /></motion.div>
      <motion.div
        animate={{ y: [8, -8, 8], rotate: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-40 right-12 text-purple-300/50 pointer-events-none hidden lg:block"
      ><Sparkles size={22} /></motion.div>
      <motion.div
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-48 left-16 text-green-300/40 pointer-events-none hidden lg:block"
      ><Star size={28} /></motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 w-full">

        {/* Text — centred now that the hero no longer has a companion image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center"
        >

          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-6">
            <Sparkles size={14} /> Chess & strategy games for curious minds
          </span>

          <h1 className="font-fredoka text-[#2D2520] leading-[1.1] mb-3"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', fontWeight: 600 }}>
            More than a game.
          </h1>
          <h2 className="font-fredoka text-[#E8A020] leading-[1.1] mb-7"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', fontWeight: 600 }}>
            Skills for life.
          </h2>

          <p className="font-nunito text-[#2D2520]/65 text-lg leading-relaxed mb-10 max-w-lg mx-auto">
            Helping children discover the joy of thinking through strategy games, meaningful conversation and thoughtful learning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <MotionLink
              whileTap={ctaTap}
              to="/contact"
              onClick={() => window.scrollTo(0, 0)}
              className="group bg-[#E8A020] text-white font-fredoka font-600 text-lg px-8 py-4 rounded-2xl hover:bg-[#d4940e] transition-all duration-300 hover:shadow-xl hover:shadow-[#E8A020]/30 hover:-translate-y-0.5 flex items-center gap-3">
              Claim 50% Off Your First Lesson
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </MotionLink>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-[#2D2520]/50" />
              <span className="font-nunito text-[#2D2520]/70 text-sm font-700">Ages 5–12</span>
            </div>
          </div>

        </motion.div>

        {/* Trust & Connected — a lightweight credibility strip, front and centre right after the CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto mt-12 pt-10 border-t border-[#2D2520]/8 text-center"
        >
          <h3 className="font-fredoka text-[#2D2520]/70 text-base sm:text-lg mb-5">Trusted &amp; Connected</h3>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#E8A020] flex-shrink-0" />
                <span className="font-nunito text-[#2D2520]/70 text-xs sm:text-sm font-600">{item.content}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Feature strip — the three supporting ideas, given real visual weight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-10"
        >
          {features.map(({ Icon, accent, tag, title, body }) => (
            <div key={tag} className="group">
              <Icon size={26} style={{ color: accent }} className="mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
              <span className="block font-nunito text-xs font-800 uppercase tracking-widest mb-2" style={{ color: accent }}>{tag}</span>
              <h3 className="font-fredoka text-[#2D2520] text-lg mb-2 leading-snug">{title}</h3>
              <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
