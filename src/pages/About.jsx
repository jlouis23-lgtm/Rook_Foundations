import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, Users, Heart } from 'lucide-react';
import WhyChessResearch from '../components/about/WhyChessResearch';
import ProfessionalTraining from '../components/about/ProfessionalTraining';
import BoardVisionSection from '../components/about/BoardVisionSection';
import GamesGallery from '../components/about/GamesGallery';
import ChessBg from '@/components/ui/ChessBg';
import JourneyTimeline from '../components/about/JourneyTimeline';

const credentials = [
  { icon: Users, emoji: '👥', title: 'Working With Children', desc: 'Background in mentoring, youth support, wellbeing, and residential care — supporting children across a range of needs and environments.', color: 'bg-blue-50 border-blue-200', accent: '#4a7eb8' },
  { icon: BookOpen, emoji: '📖', title: 'Academic Tutor', desc: 'Focused on helping children build strong foundations in science, English, and maths through personalised one-to-one support.', color: 'bg-green-50 border-green-200', accent: '#2d8c62' },
  { icon: Award, emoji: '🎓', title: 'Psychology Background', desc: "Academic training from King's College London and The University of Manchester — specialising in behaviour, learning, and child development.", color: 'bg-purple-50 border-purple-200', accent: '#7a48c0' },
  { icon: Heart, emoji: '♜', title: 'Dedicated Chess Study', desc: 'Four years of dedicated chess study and competitive play, with a genuine understanding of the learning journey from beginner upwards.', color: 'bg-amber-50 border-amber-200', accent: '#b8790a' },
];



export default function About() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-20">

      {/* Page Header — merged with My Story */}
      <section className="pt-20 pb-0 relative overflow-hidden">
        <ChessBg variant="aboutheader" />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">

          {/* Greeting */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-[#E8A020]/12 border border-[#E8A020]/25 rounded-full px-4 py-2 mb-6">
              <span className="text-sm">♜</span>
              <span className="font-nunito text-[#b8790a] text-sm font-700">The story behind Rook Foundations</span>
            </div>
            <h1 className="font-fredoka text-[#2D2520] leading-tight mb-8"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}>
              Hello, welcome 👋
            </h1>
          </motion.div>

          {/* Opening paragraph */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
            <p className="font-nunito text-[#2D2520]/80 text-xl leading-relaxed mb-8 max-w-3xl">
              <span className="font-fredoka font-900 text-[#2D2520]">R</span>ook Foundations is an education programme built on years of experience working with children, academic training in psychology, and a genuine belief that every child deserves the opportunity to think for themselves.
            </p>
          </motion.div>

          {/* Story body */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}>
            <div className="font-nunito text-[#2D2520]/65 text-lg leading-relaxed space-y-5 max-w-3xl mb-10">
              <p>
                Chess provides a unique kind of playful mental pressure. I started playing frequently while researching. These breaks provided a healthy distraction from synthesising data and drafting reports. When I started playing against people in person rather than just online, I realised that the game captured something meaningful that most people take for granted these days — things like sacrifice. It teaches that success is defined by the cooperation of pieces, and that victory is marked by the strength of those connections.
              </p>
              <p>
                Yet our connections as a society are fading, and this will affect how the next generation learns. Today, children are disengaged from learning and overwhelmed by constant digital stimulation. Too often, they're given answers instead of being encouraged to think for themselves.
              </p>
              <p className="font-600 text-[#2D2520]/80">
                Rook Foundations was born from a simple conviction: every child deserves the opportunity to <em>want</em> to think for themselves.
              </p>
            </div>
          </motion.div>

          {/* Hero quote — major focal point */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="relative mb-20"
          >
            {/* Large decorative quotation mark */}
            <div
              className="absolute -top-6 -left-4 font-fredoka text-[#E8A020]/15 select-none pointer-events-none leading-none"
              style={{ fontSize: '10rem', lineHeight: 1 }}
              aria-hidden="true"
            >"</div>

            <div className="relative bg-[#2D2520] rounded-3xl px-10 py-10 sm:px-14 sm:py-12 shadow-2xl shadow-[#2D2520]/20 overflow-hidden">
              {/* Subtle chess piece watermark */}
              <div className="absolute right-6 bottom-4 text-white/5 font-fredoka select-none pointer-events-none" style={{ fontSize: '8rem', lineHeight: 1 }} aria-hidden="true">♜</div>

              <p className="relative z-10 font-fredoka text-white leading-tight" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)' }}>
                "School taught me how to think.
              </p>
              <p className="relative z-10 font-fredoka leading-tight mt-2" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', color: '#F4C261' }}>
                But it didn't teach me how to want to think for myself."
              </p>

              {/* Attribution line */}
              <div className="relative z-10 mt-6 flex items-center gap-3">
                <div className="h-px w-10 bg-[#E8A020]/50 rounded-full" />
                <span className="font-nunito text-white/40 text-sm tracking-wide">Louis Jenkins, Founder — Rook Foundations</span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Why Chess Research — immediately after intro */}
      <WhyChessResearch />

      {/* Credentials */}
      <section className="py-20 bg-[#F5F3EE]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-200 rounded-full px-4 py-2 mb-4">
              <span className="text-sm">✅</span>
              <span className="font-nunito text-amber-700 text-sm font-700">Qualifications & experience</span>
            </div>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              Why families trust us
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {credentials.map(({ emoji, title, desc, color, accent }) => (
              <div key={title} className={`play-card ${color} border-2 rounded-3xl p-7`}>
                <div className="text-3xl mb-4">{emoji}</div>
                <h3 className="font-fredoka text-lg mb-2" style={{ color }}>{title}</h3>
                <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Training */}
      <ProfessionalTraining />

      {/* Teaching Philosophy */}
      <section className="bg-[#F5F3EE] py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 rounded-full px-4 py-2 mb-4">
            <span className="text-sm">💡</span>
            <span className="font-nunito text-purple-700 text-sm font-700">How we teach</span>
          </div>
          <h2 className="font-fredoka text-[#2D2520] mb-12" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            Three things we believe in deeply
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { symbol: '♟', emoji: '💛', color: 'bg-amber-50 border-amber-200', accent: '#b8790a', title: 'Confidence First', desc: 'No child should fear making a wrong move. We create a safe, encouraging space where mistakes are celebrated as learning.' },
              { symbol: '♞', emoji: '🎯', color: 'bg-blue-50 border-blue-200', accent: '#4a7eb8', title: 'Process Over Outcome', desc: 'We focus on the quality of thinking, not the result. A well-thought-out loss teaches more than a lucky win.' },
              { symbol: '♛', emoji: '🌱', color: 'bg-green-50 border-green-200', accent: '#2d8c62', title: 'Every Child Progresses', desc: "We identify each child's learning style and provide tailored guidance to help them grow steadily and confidently." },
            ].map((p) => (
              <div key={p.title} className={`play-card ${p.color} border-2 rounded-3xl p-8`}>
                <div className="text-4xl mb-4">{p.emoji}</div>
                <h3 className="font-fredoka text-xl mb-3" style={{ color: p.accent }}>{p.title}</h3>
                <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GamesGallery />

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
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#E8A020] font-fredoka font-600 text-lg px-8 py-4 rounded-2xl hover:bg-[#fdf6e8] transition-all hover:shadow-xl hover:-translate-y-0.5">
            Claim 50% Off First Lesson <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}