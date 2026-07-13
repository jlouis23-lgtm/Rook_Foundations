import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star, Shield, ScanEye, Lightbulb, Sprout, Users } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';

const socialLinks = [
  {
    href: 'https://www.instagram.com/rookfoundations/',
    label: 'Instagram',
    color: '#c2255c',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
  },
  {
    href: 'https://www.tiktok.com/@rookfoundations',
    label: 'TikTok',
    color: '#2D2520',
    dark: true,
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>,
  },
  {
    href: 'https://www.facebook.com/profile.php?id=61561285444390',
    label: 'Facebook',
    color: '#4a7eb8',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  },
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

          {/* Social links */}
          <div className="flex flex-col items-center gap-3 mt-10">
            <span className="font-nunito text-[#2D2520]/70 text-xs font-700 uppercase tracking-wide">Follow on:</span>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, label, svg, color, dark }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={dark
                    ? { backgroundColor: color, border: `1.5px solid ${color}`, color: '#fff' }
                    : { backgroundColor: `${color}18`, border: `1.5px solid ${color}40`, color }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

        </motion.div>

        {/* Feature strip — the three supporting ideas, given real visual weight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-20 lg:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-10"
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

        {/* Affiliations */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-x-8 gap-y-1.5 mt-10">
          <div className="flex items-center gap-1.5">
            <Shield size={16} className="text-[#E8A020]/40" />
            <span className="font-nunito text-[#2D2520]/40 text-sm font-600">Proud member of <a href="https://www.wholeschoolsend.org.uk/page/nasen-home-page" target="_blank" rel="noopener noreferrer" className="hover:text-[#E8A020]/70 transition-colors underline underline-offset-2">NASEN</a> (National Association for Special Educational Needs).</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield size={16} className="text-[#E8A020]/40" />
            <span className="font-nunito text-[#2D2520]/40 text-sm font-600">Connected with English Chess Federation</span>
          </div>
        </div>
      </div>
    </section>
  );
}
