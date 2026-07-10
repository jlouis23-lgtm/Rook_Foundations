import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Heart, CheckCircle, Dices, GraduationCap } from 'lucide-react';
import WhyChessResearch from '../components/about/WhyChessResearch';
import ProfessionalTraining from '../components/about/ProfessionalTraining';
import BoardVisionSection from '../components/about/BoardVisionSection';
import GamesGallery from '../components/about/GamesGallery';
import ChessBg from '@/components/ui/ChessBg';
import JourneyTimeline from '../components/about/JourneyTimeline';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';

const credentials = [
  { Icon: Users,       title: 'Working With Children',  desc: 'Background in mentoring, youth support, wellbeing, and residential care. Roles involved supporting children across a range of needs and environments.', accent: '#4a7eb8' },
  { Icon: BookOpen,    title: 'Academic Tutor',          desc: 'Focused on helping children build strong foundations in science, English, and maths through personalised one-to-one support.', accent: '#2d8c62' },
  { Icon: GraduationCap, title: 'Psychology Background', desc: "Academic training from King's College London and The University of Manchester. Core focus on child development, trauma, and behaviour.", accent: '#7a48c0' },
  { Icon: Dices,       title: 'Dedicated Chess Study',   desc: 'Four years of dedicated chess study and competitive play, with a genuine understanding of the learning journey from beginner upwards.', accent: '#b8790a' },
];



export default function About() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-20">

      {/* Page Header */}
      <section className="pt-20 pb-20 relative overflow-hidden">
        <ChessBg variant="aboutheader" />
        <div className="relative z-10">

          {/* Greeting + badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto px-6 lg:px-12 text-center mb-14"
          >
            <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-6">
              <Heart size={14} /> The story behind Rook Foundations
            </span>
            <h1 className="font-fredoka text-[#2D2520] leading-tight mb-0"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}>
              Hello, welcome 👋
            </h1>
          </motion.div>

          {/* Part 1 — Centred introductory statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-2xl mx-auto px-6 lg:px-12 text-center mb-16"
          >
            <p className="font-nunito text-[#2D2520] font-700 leading-relaxed" style={{ fontSize: 'clamp(1.15rem, 2.2vw, 1.4rem)' }}>
              Rook Foundations is an education programme built on years of experience working with children, academic training in psychology, and a genuine belief that games afford opportunities to strengthen the mind.
            </p>
            <div className="mt-6 flex justify-center">
              <div className="h-1 w-12 bg-gradient-to-r from-[#E8A020] to-[#F4C261] rounded-full" />
            </div>
          </motion.div>

          {/* Subsection title */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.22 }}
            className="max-w-2xl mx-auto px-6 lg:px-12 text-center mb-10"
          >
            <h2 className="font-fredoka text-[#2D2520]/70" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)' }}>
              Why Rook Foundations?
            </h2>
          </motion.div>

          {/* Parts 2 & 3 — Story paragraphs, left-aligned prose */}
          <div className="max-w-2xl mx-auto px-6 lg:px-12">

            {/* Part 2 — Chess & sacrifice */}
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
              className="font-nunito text-[#2D2520]/70 text-lg leading-relaxed mb-10"
            >
              Strategy games provide a unique kind of playful mental pressure. I started playing frequently while studying. These breaks provided a healthy distraction from data and research. When I started chess against people in person rather than online, I realised that the game captured something meaningful that most people take for granted these days; things like <strong className="font-800 text-[#2D2520]/90">sacrifice</strong>. It teaches that success is defined by the cooperation of pieces, and that victory is marked by the strength of those connections.
            </motion.p>

            {/* Part 3 — Digital world & conviction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}
              className="mb-14"
            >
              <p className="font-nunito text-[#2D2520]/70 text-lg leading-relaxed mb-8">
                This is particularly important today as our connections as a society are fading. This will affect how the next generation learns. Right now, children are losing interest in learning, and it is not hard to blame them in this new world filled with constant digital distractions. Too often, they're given answers instead of being encouraged to think for themselves. Rook Foundations was born from a simple conviction:
              </p>
              <p className="font-fredoka text-[#2D2520] text-center leading-tight" style={{ fontSize: 'clamp(1.3rem, 2.8vw, 1.9rem)' }}>
                Every child deserves the opportunity to want to think for themselves.
              </p>
            </motion.div>

            {/* Hero quote */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="relative"
            >
              <div
                className="absolute -top-6 -left-2 font-fredoka text-[#E8A020]/12 select-none pointer-events-none leading-none"
                style={{ fontSize: '9rem', lineHeight: 1 }}
                aria-hidden="true"
              >"</div>

              <div className="relative bg-[#2D2520] rounded-3xl px-10 py-10 sm:px-12 sm:py-12 shadow-2xl shadow-[#2D2520]/20 overflow-hidden">
                <div className="absolute right-6 bottom-4 text-white/5 font-fredoka select-none pointer-events-none" style={{ fontSize: '8rem', lineHeight: 1 }} aria-hidden="true">♜</div>
                <p className="relative z-10 font-fredoka text-white leading-tight" style={{ fontSize: 'clamp(1.45rem, 3.2vw, 2.2rem)' }}>
                  "School taught me how to think.
                </p>
                <p className="relative z-10 font-fredoka leading-tight mt-2" style={{ fontSize: 'clamp(1.45rem, 3.2vw, 2.2rem)', color: '#F4C261' }}>
                  But it didn't teach me how to want to think for myself."
                </p>
                <div className="relative z-10 mt-6 flex items-center gap-3">
                  <div className="h-px w-10 bg-[#E8A020]/50 rounded-full" />
                  <span className="font-nunito text-white/40 text-sm tracking-wide">Louis Jenkins, Founder — Rook Foundations</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <GamesGallery />

      {/* Why Chess Research — immediately after intro */}
      <WhyChessResearch />

      {/* Credentials */}
      <section className="py-20 bg-[#F5F3EE]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 font-nunito text-amber-700 text-sm font-800 uppercase tracking-widest mb-4">
              <CheckCircle size={14} /> Qualifications & experience
            </span>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              Why families trust us
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {credentials.map(({ Icon, title, desc, accent }) => (
              <div key={title} className="group">
                <div className="mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"><Icon size={28} style={{ color: accent }} /></div>
                <h3 className="font-fredoka text-lg mb-2" style={{ color: accent }}>{title}</h3>
                <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Training */}
      <ProfessionalTraining />

      <BoardVisionSection />

      {/* Journey Timeline */}
      <JourneyTimeline />

      {/* CTA */}
      <section className="py-20 text-center bg-[#E8A020] relative overflow-hidden">
        <ChessBg variant="cta" color="#ffffff" />
        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <div className="text-4xl mb-4">♜</div>
          <h2 className="font-fredoka text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
            Ready to meet in person?
          </h2>
          <p className="font-nunito text-white/80 text-lg mb-8">
            Get 50% off your first lesson and discover the Rook Foundations difference for yourself.
          </p>
          <MotionLink
            whileTap={ctaTap}
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#E8A020] font-fredoka font-600 text-lg px-8 py-4 rounded-2xl hover:bg-[#fdf6e8] transition-all hover:shadow-xl hover:-translate-y-0.5">
            Claim 50% Off First Lesson <ArrowRight size={20} />
          </MotionLink>
        </div>
      </section>
    </div>
  );
}