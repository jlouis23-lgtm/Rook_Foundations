import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, Users, Heart } from 'lucide-react';

const INSTRUCTOR_IMG = 'https://media.base44.com/images/public/69fe1341895fe99f147fce64/3b7300d3f_51E37187-F312-43E1-8058-02E71B191F4B.png';

const credentials = [
{ icon: Award, title: 'FIDE Rated Player', desc: 'Active tournament competitor with a deep understanding of the game at every level.' },
{ icon: BookOpen, title: 'B.A. in Education', desc: 'Formal training in child development, learning theory, and pedagogical practice.' },
{ icon: Users, title: '8+ Years Teaching', desc: 'Hundreds of children guided from complete beginners to confident, competitive players.' },
{ icon: Heart, title: 'Child-First Approach', desc: 'Every session is designed to build confidence and joy before technique.' }];


const timeline = [
{ year: '2016', event: 'Began tutoring local children after competing in regional tournaments.' },
{ year: '2018', event: 'Completed formal education degree, specialising in child cognitive development.' },
{ year: '2020', event: 'Launched RookFoundations as a structured after-school programme.' },
{ year: '2022', event: 'First cohort of students entered regional youth chess championships.' },
{ year: '2024', event: 'Expanded to three age-group phases with a full curriculum framework.' },
{ year: '2026', event: 'Over 150 young thinkers taught, with a waiting list each term.' }];


export default function About() {
  return (
    <div style={{ backgroundColor: '#0A0A0A' }} className="pt-32">
      {/* Page Header */}
      <section className="relative overflow-hidden py-20 border-b border-[#D4A843]/15">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(212,168,67,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,67,0.2) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className="gold-line mx-auto mb-5" />
          <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-4">About</span>
          <h1 className="font-oswald text-white uppercase mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.02em' }}>
            More than a chess teacher.
          </h1>
          <p className="font-lato text-white/50 text-lg leading-relaxed">
            A belief that the board is one of the most powerful learning tools a child can encounter.
          </p>
        </div>
      </section>

      {/* Story — Photo left, text right */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative flex items-center justify-center">
              
              <div className="relative max-w-sm w-full mx-auto">
                {/* Gold glow */}
                <div className="absolute inset-0 rounded-full bg-[#D4A843]/10 blur-3xl scale-110" />
                <img
                  src={INSTRUCTOR_IMG}
                  alt="RookFoundations Instructor"
                  className="relative z-10 w-full rounded-full border-2 border-[#D4A843]/50 shadow-2xl shadow-[#D4A843]/15" />
                
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}>
              
              <div className="gold-line mb-5" />
              <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-4">My Story</span>
              <h2 className="font-oswald text-white uppercase leading-tight mb-8"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', letterSpacing: '0.02em' }}>
                From player to<br />
                <span className="text-[#D4A843]">passionate educator.</span>
              </h2>

              <div className="space-y-5 font-lato text-white/60 text-lg leading-relaxed">
                <p>My chess journey  began during my second year of university. At a time when I struggled with overthinking and anxiety, chess became more than just a game . It taught me self-awareness, patience, strategy, and how to think clearly under pressure.


                </p>
                <p>Although I’m only 23, I’ve spent the last six years working with children across different settings. Through that experience, I realised many young people today are disengaged from learning and overly consumed by constant media and digital stimulation. Too often, they are given answers instead of being encouraged to think for themselves.


                </p>
                <p>RookFoundations was born from a simple conviction: every child deserves the opportunity to want to think for themselves.


                </p>
              </div>

              <blockquote className="mt-10 border-l-4 border-[#D4A843] pl-6">
                <p className="font-oswald text-white text-xl uppercase tracking-wide leading-relaxed">
                  "I don't just teach chess.<br />
                  <span className="text-[#D4A843]">I teach children how to think."</span>
                </p>
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-[#0D0D0D] py-24 border-t border-[#D4A843]/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 text-center">
          <div className="gold-line mx-auto mb-5" />
          <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-4">Teaching Philosophy</span>
          <h2 className="font-oswald text-white uppercase mb-12"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', letterSpacing: '0.02em' }}>
            The three pillars of RookFoundations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#D4A843]/10">
            {[
            { symbol: '♟', title: 'Confidence First', desc: 'No child should fear making a wrong move. We create a safe, encouraging space where mistakes are celebrated as learning.' },
            { symbol: '♞', title: 'Process Over Outcome', desc: 'We focus on the quality of thinking, not the result. A well-thought-out loss teaches more than a lucky win.' },
            { symbol: '♛', title: 'Every Child Progresses', desc: 'Our curriculum adapts to the individual. Some become tournament players; all become better thinkers.' }].
            map((p) =>
            <div key={p.title} className="bg-[#0D0D0D] p-10 hover:bg-[#111] transition-colors border border-transparent hover:border-[#D4A843]/20">
                <span className="text-4xl text-[#D4A843] block mb-4">{p.symbol}</span>
                <h3 className="font-oswald text-white text-xl uppercase tracking-wide mb-3">{p.title}</h3>
                <p className="font-lato text-white/50 text-base leading-relaxed">{p.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-24" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div className="gold-line mx-auto mb-5" />
            <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-4">Qualifications</span>
            <h2 className="font-oswald text-white uppercase"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', letterSpacing: '0.02em' }}>
              Credentials you can trust
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#D4A843]/10">
            {credentials.map(({ icon: Icon, title, desc }) =>
            <div key={title} className="bg-[#0A0A0A] p-8 hover:bg-[#111] transition-colors border border-transparent hover:border-[#D4A843]/20">
                <div className="w-12 h-12 border border-[#D4A843]/40 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-[#D4A843]" />
                </div>
                <h3 className="font-oswald text-white text-lg uppercase tracking-wide mb-2">{title}</h3>
                <p className="font-lato text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-[#0D0D0D] py-24 border-t border-[#D4A843]/10">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div className="gold-line mx-auto mb-5" />
            <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-4">Journey</span>
            <h2 className="font-oswald text-white uppercase"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', letterSpacing: '0.02em' }}>
              Building RookFoundations
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-24 top-0 bottom-0 w-px bg-[#D4A843]/15" />
            <div className="space-y-10">
              {timeline.map((t, i) =>
              <motion.div
                key={t.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-8">
                
                  <div className="w-16 flex-shrink-0 text-right">
                    <span className="font-oswald text-[#D4A843] font-700 tracking-wide">{t.year}</span>
                  </div>
                  <div className="relative flex-shrink-0 mt-2">
                    <div className="w-3 h-3 bg-[#D4A843]" />
                  </div>
                  <p className="font-lato text-white/60 text-base leading-relaxed">{t.event}</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center border-t border-[#D4A843]/15" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="max-w-2xl mx-auto px-6">
          <div className="gold-line mx-auto mb-6" />
          <h2 className="font-oswald text-white uppercase mb-4"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', letterSpacing: '0.02em' }}>
            Ready to meet in person?
          </h2>
          <p className="font-lato text-white/50 text-lg mb-8">
            Book a free trial class and see the RookFoundations difference for yourself.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-[#D4A843] text-[#0A0A0A] font-oswald font-700 tracking-wider px-8 py-4 hover:bg-[#e8c06a] transition-all">
            
            BOOK A FREE TRIAL <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>);

}