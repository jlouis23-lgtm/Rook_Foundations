import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, Users, Clock, MapPin, Calendar, Star, Shield } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80';

const benefits = [
  { icon: '🌟', label: 'Builds Confidence', desc: 'Children practise decision-making in a relaxed, encouraging environment.', color: 'bg-amber-50 border-amber-200' },
  { icon: '🤝', label: 'Social Interaction', desc: 'Meet and play with other children who share a love of strategy games.', color: 'bg-blue-50 border-blue-200' },
  { icon: '🧠', label: 'Problem-Solving', desc: 'Games naturally develop logical thinking, planning, and critical reasoning.', color: 'bg-purple-50 border-purple-200' },
  { icon: '🎲', label: 'Learning Through Play', desc: 'A fun, low-pressure setting where children explore new games each week.', color: 'bg-green-50 border-green-200' },
];

const keyInfo = [
  { icon: <Calendar size={16} />, label: 'Session Type', value: 'Weekend Club' },
  { icon: <Users size={16} />, label: 'Max Capacity', value: '15 children' },
  { icon: <MapPin size={16} />, label: 'Location', value: 'TBC — local venue' },
  { icon: <Clock size={16} />, label: 'Duration', value: 'TBC' },
  { icon: <Star size={16} />, label: 'Age Range', value: '6–10 years' },
  { icon: <Calendar size={16} />, label: 'Upcoming Dates', value: 'Coming soon' },
  { icon: <span className="text-sm font-700">£</span>, label: 'Pricing', value: 'Coming soon' },
];

const faqs = [
  { q: 'What games are available?', a: 'Sessions feature a wide variety of strategy and tabletop games including chess, draughts, Connect 4, Blokus, and more. The selection grows over time as children bring favourites from home.' },
  { q: 'Can my child bring their own games?', a: 'Absolutely! We actively encourage children to bring strategy games from home to share with others. Staff will assess suitability where necessary to ensure games are age-appropriate and safe for all participants.' },
  { q: 'Are staff DBS checked?', a: 'Yes. All staff present at club sessions are fully DBS-checked and have completed safeguarding training. Children\'s welfare and safety are our highest priority.' },
  { q: 'How many children attend each session?', a: 'Each session can accommodate up to 15 children, allowing for a safe, supervised, and genuinely enjoyable experience for everyone.' },
  { q: 'How do I book a place?', a: 'Booking details are coming soon. In the meantime, please register your interest via the contact page and we\'ll get in touch as soon as sessions are available to book.' },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-2 border-[#E8A020]/15 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-amber-50/50 transition-colors"
      >
        <span className="font-fredoka text-[#2D2520] text-lg pr-4">{q}</span>
        <ChevronDown size={18} className={`text-[#E8A020] flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed px-6 pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Events() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-32">

      {/* Hero */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <ChessBg variant="hero" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Text */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 bg-[#E8A020]/12 border border-[#E8A020]/25 rounded-full px-4 py-2 mb-5">
                <span className="text-sm">🎲</span>
                <span className="font-nunito text-[#b8790a] text-sm font-700">Weekend sessions for children</span>
              </div>
              <h1 className="font-fredoka text-[#2D2520] leading-[1.1] mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                Weekend Strategy<br />
                <span className="text-[#E8A020]">Games Club</span>
              </h1>
              <p className="font-nunito text-[#2D2520]/65 text-lg leading-relaxed mb-8 max-w-lg">
                A fun, supervised weekend activity where children explore strategy games, sharpen their thinking, make new friends, and enjoy every moment. Designed for curious minds aged 6–10.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {['Ages 6–10', 'Up to 15 children', 'DBS-checked staff', 'Weekends'].map((tag) => (
                  <div key={tag} className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2">
                    <Check size={13} className="text-[#E8A020]" />
                    <span className="font-nunito text-[#b8790a] text-sm font-700">{tag}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  onClick={() => window.scrollTo(0, 0)}
                  className="group bg-[#E8A020] text-white font-fredoka font-600 text-lg px-8 py-4 rounded-2xl hover:bg-[#d4940e] transition-all hover:shadow-xl hover:shadow-[#E8A020]/30 hover:-translate-y-0.5 flex items-center gap-3"
                >
                  Register Interest
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#key-info"
                  className="bg-white border-2 border-[#E8A020]/25 text-[#2D2520] font-fredoka font-600 text-lg px-8 py-4 rounded-2xl hover:border-[#E8A020]/60 transition-all flex items-center justify-center gap-2"
                >
                  Learn More
                </a>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <div className="relative">
                <div className="absolute inset-0 bg-[#E8A020]/18 blob-shape blur-3xl scale-110" />
                <img
                  src={PLACEHOLDER_IMG}
                  alt="Children playing strategy games at Rook Foundations weekend club"
                  className="relative z-10 w-full rounded-3xl border-4 border-white shadow-2xl shadow-[#E8A020]/15 object-cover aspect-[4/3]"
                />
                <div className="absolute -bottom-4 -left-4 bg-white border-2 border-[#E8A020]/20 rounded-2xl px-5 py-3 shadow-lg z-20">
                  <span className="font-fredoka text-[#2D2520] text-lg">Up to </span>
                  <span className="font-fredoka text-[#E8A020] text-lg">15 children</span>
                  <span className="font-nunito text-[#2D2520]/50 text-xs block">per session</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Info Panel */}
      <section id="key-info" className="py-16 bg-white border-y-2 border-[#E8A020]/10">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-10">
            <h2 className="font-fredoka text-[#2D2520] text-3xl mb-2">Session at a Glance</h2>
            <p className="font-nunito text-[#2D2520]/50 text-sm font-600">Everything you need to know before booking.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {keyInfo.map(({ icon, label, value }) => (
              <div key={label} className="bg-[#FAFAF7] border-2 border-[#E8A020]/12 rounded-2xl p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[#E8A020]">{icon}</div>
                <span className="font-nunito text-[#2D2520]/45 text-xs font-700 uppercase tracking-wider">{label}</span>
                <span className="font-fredoka text-[#2D2520] text-base">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Happens */}
      <section className="py-20 relative overflow-hidden">
        <ChessBg variant="classes" />
        <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-[#E8A020]/12 border border-[#E8A020]/25 rounded-full px-4 py-2 mb-4">
                <span className="text-sm">🎯</span>
                <span className="font-nunito text-[#b8790a] text-sm font-700">What to expect</span>
              </div>
              <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
                What Happens at Club?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  emoji: '♟',
                  title: 'Games & Activities',
                  items: [
                    'Play a wide variety of strategy and tabletop games',
                    'Explore games beyond weekly lesson content',
                    'Develop critical thinking, planning, and teamwork',
                    'Meet other children who share similar interests',
                  ],
                  color: 'border-amber-200 bg-amber-50',
                },
                {
                  emoji: '🎒',
                  title: 'Bring Your Own Games',
                  items: [
                    'Children are welcome to bring games from home',
                    'Share favourites with the group',
                    'Staff will assess suitability where needed',
                    'Encourages ownership, variety, and social interaction',
                  ],
                  color: 'border-blue-200 bg-blue-50',
                },
                {
                  emoji: '🛡',
                  title: 'Safety & Supervision',
                  items: [
                    'Additional staff present throughout each session',
                    'All staff are fully DBS-checked',
                    'All staff have completed safeguarding training',
                    'Children\'s welfare is our highest priority',
                  ],
                  color: 'border-green-200 bg-green-50',
                },
                {
                  emoji: '👦',
                  title: 'Who Can Attend?',
                  items: [
                    'Open to children aged 6–10',
                    'No prior chess or gaming experience needed',
                    'Suitable for beginners and experienced players alike',
                    'A welcoming, inclusive environment for all',
                  ],
                  color: 'border-purple-200 bg-purple-50',
                },
              ].map(({ emoji, title, items, color }) => (
                <div key={title} className={`border-2 ${color} rounded-3xl p-7`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{emoji}</span>
                    <h3 className="font-fredoka text-[#2D2520] text-xl">{title}</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-3 font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
                        <span className="w-5 h-5 bg-[#E8A020] rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                          <Check size={10} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white border-y-2 border-[#E8A020]/10 relative overflow-hidden">
        <ChessBg variant="whychess" />
        <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#E8A020]/12 border border-[#E8A020]/25 rounded-full px-4 py-2 mb-4">
              <span className="text-sm">✨</span>
              <span className="font-nunito text-[#b8790a] text-sm font-700">Why it matters</span>
            </div>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              What Children Gain
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map(({ icon, label, desc, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`play-card border-2 ${color} rounded-3xl p-6 flex flex-col gap-3`}
              >
                <span className="text-4xl">{icon}</span>
                <h3 className="font-fredoka text-[#2D2520] text-xl">{label}</h3>
                <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety spotlight */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-green-50 border-2 border-green-200 rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-start"
          >
            <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Shield size={26} className="text-white" />
            </div>
            <div>
              <h3 className="font-fredoka text-[#2D2520] text-2xl mb-3">Safeguarding & Safety</h3>
              <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mb-4">
                The safety and welfare of every child attending our club sessions is our absolute priority. We operate in full compliance with safeguarding best practices.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Additional staff present at all sessions',
                  'All staff are fully DBS-checked',
                  'Safeguarding training completed by all staff',
                  'Safe, structured, and supervised environment',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 font-nunito text-[#2D2520]/70 text-sm font-600">
                    <Check size={13} className="text-green-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 relative overflow-hidden">
        <ChessBg variant="faq" />
        <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#E8A020]/12 border border-[#E8A020]/25 rounded-full px-4 py-2 mb-4">
              <span className="text-sm">❓</span>
              <span className="font-nunito text-[#b8790a] text-sm font-700">Common questions</span>
            </div>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => <FAQItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#E8A020] py-20 relative overflow-hidden">
        <ChessBg variant="cta" />
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className="text-4xl mb-5">🎲</div>
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-5 py-2 mb-6">
            <span className="font-nunito text-white font-700 text-sm">📅 Sessions launching soon</span>
          </div>
          <h2 className="font-fredoka text-white text-3xl mb-4">Ready to join the club?</h2>
          <p className="font-nunito text-white/80 text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Register your interest today and be the first to know when weekend sessions open for booking. No commitment required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#E8A020] font-fredoka font-600 text-lg px-10 py-4 rounded-2xl hover:bg-[#fdf6e8] transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Register Interest <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center justify-center gap-2 bg-white/15 border-2 border-white/40 text-white font-fredoka font-600 text-lg px-10 py-4 rounded-2xl hover:bg-white/25 transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}