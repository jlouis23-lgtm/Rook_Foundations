import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, Users, Heart } from 'lucide-react';
import WhyChessResearch from '../components/about/WhyChessResearch';
import ProfessionalTraining from '../components/about/ProfessionalTraining';

const credentials = [
  { icon: Users, emoji: '👥', title: 'Working With Children', desc: 'Background in mentoring, youth support, wellbeing, and residential care — supporting children across a range of needs and environments.', color: 'bg-blue-50 border-blue-200', accent: '#4a7eb8' },
  { icon: BookOpen, emoji: '📖', title: 'Academic Tutor', desc: 'Focused on helping children build strong foundations in science, English, and maths through personalised one-to-one support.', color: 'bg-green-50 border-green-200', accent: '#2d8c62' },
  { icon: Award, emoji: '🎓', title: 'Psychology Background', desc: "Academic training from King's College London and The University of Manchester — specialising in behaviour, learning, and child development.", color: 'bg-purple-50 border-purple-200', accent: '#7a48c0' },
  { icon: Heart, emoji: '♜', title: 'Dedicated Chess Study', desc: 'Four years of dedicated chess study and competitive play, with a genuine understanding of the learning journey from beginner upwards.', color: 'bg-amber-50 border-amber-200', accent: '#b8790a' },
];

const timeline = [
  { year: '2018', emoji: '📚', event: "Began privately tutoring GCSE students in Maths, Science, and English — discovering how confidence and personalised support can transform a child's relationship with learning." },
  { year: '2019', emoji: '⛺', event: "Worked as a Youth Officer at a children's camp, designing age-specific activities that deepened an understanding of child engagement, teamwork, and structured play." },
  { year: '2021', emoji: '🧠', event: 'Started a BSc in Psychology at the University of Manchester, focusing on developmental psychology, cognitive development, and how children build resilience through supportive environments.' },
  { year: '2022', emoji: '🤝', event: "Volunteered with Midlands charity ReachOut as a Peer Mentor, helping children from disadvantaged backgrounds build academic confidence, communication skills, and self-belief." },
  { year: '2023', emoji: '🔍', event: "Conducted research with parents experiencing mental illness, exploring how stigma affects parenting and children's emotional wellbeing." },
  { year: '2024', emoji: '🏛️', event: "Began an MSc in War and Psychology at King's College London, studying trauma therapy, CBT, resilience, and emotional recovery in young people." },
  { year: '2025', emoji: '💻', event: 'Conducted an independent study exploring whether AI and machine learning could be used to predict PTSD risk in veterans following combat.' },
  { year: '2026', emoji: '🏠', event: "Began working as a Children's Residential Support Worker, supporting young people from complex backgrounds with structure, safety, and stability." },
  { year: 'Today', emoji: '♜', event: 'Rook Foundations — born from a belief that chess builds confidence, patience, critical thinking, and resilience in every child who picks up a piece.' },
];

export default function About() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-20">

      {/* Page Header */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E8A020]/8 blob-shape pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-[#E8A020]/12 border border-[#E8A020]/25 rounded-full px-4 py-2 mb-6">
              <span className="text-sm">♜</span>
              <span className="font-nunito text-[#b8790a] text-sm font-700">The story behind Rook Foundations</span>
            </div>
            <h1 className="font-fredoka text-[#2D2520] leading-tight mb-6"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}>
              Hello, welcome 👋
            </h1>
            <p className="font-nunito text-[#2D2520]/60 text-lg leading-relaxed max-w-2xl">
              Rook Foundations is an education programme built on years of experience working with children, academic training in psychology, and a genuine belief that every child deserves the opportunity to think for themselves.
            </p>
          </motion.div>
        </div>
      </section>

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

      {/* Why Chess Research */}
      <WhyChessResearch />

      {/* My Story */}
      <section className="py-20 bg-[#FAFAF7] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/25 blob-shape pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-[#E8A020]/12 border border-[#E8A020]/25 rounded-full px-4 py-2 mb-6">
              <span className="text-sm">📖</span>
              <span className="font-nunito text-[#b8790a] text-sm font-700">My story</span>
            </div>
            <h2 className="font-fredoka text-[#2D2520] leading-tight mb-10"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Why chess? Why the Rook?
            </h2>
            <div className="font-nunito text-[#2D2520]/65 text-lg leading-relaxed space-y-5">
              <p>Four years ago, chess came to me at a time where I was overloaded with assignments and bombarded with deadlines. I used to take breaks just to play a few games — and it genuinely helped me become more patient. For me, chess provided a unique kind of playful mental pressure that helped me focus on the most monotonous parts of research.</p>
              <p>When I started playing against an actual person, I realised that such a simple game beautifully captures some of the most meaningful concepts waning in today's world — sacrifice, offence and defence, and the understanding that victory comes from connection. Having worked with children across six years and different settings, I've come to see that children today are disengaged from learning and overwhelmed by constant digital stimulation. Too often, they're given answers instead of being encouraged to think for themselves.</p>
              <p className="text-[#2D2520]/80 font-600 italic">
                Rook Foundations was born from a simple conviction: every child deserves the opportunity to want to think for themselves.
              </p>
            </div>
            <div className="mt-10 bg-amber-50 border-2 border-amber-200 rounded-2xl p-7">
              <p className="font-fredoka text-[#2D2520] text-xl leading-relaxed">
                "School taught me how to think.
                <span className="text-[#E8A020]"> But it didn't teach me how to want to think for myself."</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="bg-[#F5F3EE] py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-2 mb-4">
              <span className="text-sm">🗺️</span>
              <span className="font-nunito text-blue-700 text-sm font-700">The journey here</span>
            </div>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              Years of experience with children
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-[#E8A020]/20 rounded-full" />
            <div className="space-y-8">
              {timeline.map((t, i) => (
                <motion.div
                  key={t.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-6 pl-2">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-16 h-8 flex items-center justify-center">
                      <span className="font-fredoka text-[#E8A020] text-sm font-600">{t.year}</span>
                    </div>
                    <div className="w-6 h-6 bg-[#E8A020] rounded-full flex items-center justify-center text-xs mt-1 shadow-md shadow-[#E8A020]/20">
                      <span>{t.emoji}</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-[#E8A020]/12 p-4 flex-1 mt-1">
                    <p className="font-nunito text-[#2D2520]/70 text-sm leading-relaxed">{t.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-[#E8A020] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/8 blob-shape pointer-events-none" />
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