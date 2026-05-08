import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Target, Lightbulb, Heart, Shield, TrendingUp, Eye, Zap } from 'lucide-react';

const benefits = [
  {
    icon: Brain,
    title: 'Memory & Retention',
    desc: 'Chess requires memorising openings, patterns, and positional concepts. Regular practice measurably improves working memory and information retention.',
    stat: '15%',
    statLabel: 'improvement in memory tasks',
    research: 'University of Memphis study, 2017',
  },
  {
    icon: Target,
    title: 'Concentration & Focus',
    desc: 'A single chess game demands sustained, unbroken attention for 30–90 minutes. Children who learn chess develop an exceptional ability to concentrate in school.',
    stat: '2×',
    statLabel: 'longer sustained attention',
    research: 'Belgian study on chess in schools',
  },
  {
    icon: Lightbulb,
    title: 'Problem Solving',
    desc: 'Every position is a novel problem. Chess trains children to analyse, identify options, evaluate outcomes, and make decisions — the core of critical thinking.',
    stat: '32%',
    statLabel: 'increase in problem-solving scores',
    research: 'PA State University, 2004',
  },
  {
    icon: TrendingUp,
    title: 'Mathematical Thinking',
    desc: 'Chess strengthens spatial reasoning, pattern recognition, and logical inference — all foundational skills for mathematics and science performance.',
    stat: '+17%',
    statLabel: 'maths test improvement',
    research: 'New Brunswick study, 1995',
  },
  {
    icon: Heart,
    title: 'Emotional Resilience',
    desc: 'Learning to lose gracefully, recover from mistakes, and stay composed under pressure builds the emotional intelligence that defines lifelong success.',
    stat: '100%',
    statLabel: 'students show improved patience',
    research: 'RookFoundations internal data',
  },
  {
    icon: Shield,
    title: 'Discipline & Self-Control',
    desc: 'Chess rewards careful, deliberate thinking and punishes impulsive moves. Children internalise the value of thinking before acting.',
    stat: '3×',
    statLabel: 'more deliberate decision-making',
    research: 'Observed in classroom settings',
  },
  {
    icon: Eye,
    title: 'Spatial Reasoning',
    desc: 'Visualising piece movements across the board, thinking ahead in 3D space, and mapping positional relationships develops outstanding spatial intelligence.',
    stat: 'Top 10%',
    statLabel: 'in spatial reasoning tests',
    research: 'Chess players vs. non-players',
  },
  {
    icon: Zap,
    title: 'Confidence & Self-Belief',
    desc: 'Nothing builds a child\'s confidence like mastering something genuinely difficult. Every puzzle solved, every game won, every comeback is a victory for self-belief.',
    stat: '92%',
    statLabel: 'of students report higher confidence',
    research: 'RookFoundations parent survey',
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Benefits() {
  return (
    <div className="bg-ivory pt-32">
      {/* Hero */}
      <section className="bg-midnight relative overflow-hidden py-24">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(250,249,246,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(250,249,246,0.15) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white/[0.03] font-playfair select-none"
          style={{ fontSize: '30rem', lineHeight: 1, transform: 'translateY(-50%) translateX(20%)' }}>
          ♝
        </div>
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <span className="font-inter text-coral text-xs tracking-widest uppercase font-500 block mb-4">The Cognitive Edge</span>
          <h1 className="font-playfair text-ivory mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700 }}>
            Why chess changes children.
          </h1>
          <p className="font-inter text-ivory/60 text-xl leading-relaxed max-w-2xl mx-auto">
            The evidence is extraordinary. Chess isn't just enrichment — it's one of the most potent 
            cognitive development tools available to a child.
          </p>
        </div>
      </section>

      {/* Intro quote */}
      <section className="bg-ivory py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <blockquote>
            <p className="font-playfair text-midnight text-3xl italic leading-relaxed mb-6">
              "Chess is the gymnasium of the mind."
            </p>
            <footer className="font-inter text-slate text-base">— Blaise Pascal</footer>
          </blockquote>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefits.map((b) => (
              <motion.div
                key={b.title}
                variants={item}
                className="group bg-white rounded-2xl p-8 border border-slate/8 hover:border-coral/25 hover:shadow-xl hover:shadow-coral/5 transition-all duration-400"
              >
                <div className="w-12 h-12 bg-slate/5 group-hover:bg-coral/10 rounded-xl flex items-center justify-center mb-5 transition-colors">
                  <b.icon size={20} className="text-slate group-hover:text-coral transition-colors" />
                </div>
                <h3 className="font-playfair text-midnight text-xl font-600 mb-3">{b.title}</h3>
                <p className="font-inter text-slate/80 text-sm leading-relaxed mb-6">{b.desc}</p>
                <div className="pt-5 border-t border-slate/10">
                  <div className="font-playfair text-coral text-3xl font-700">{b.stat}</div>
                  <div className="font-inter text-slate text-xs mt-1">{b.statLabel}</div>
                  <div className="font-inter text-slate/40 text-xs mt-2 italic">{b.research}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Academic performance section */}
      <section className="bg-slate py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-inter text-coral text-xs tracking-widest uppercase font-500 block mb-4">Academic Impact</span>
              <h2 className="font-playfair text-ivory mb-8" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 600 }}>
                Chess players consistently outperform their peers.
              </h2>
              <div className="space-y-5 font-inter text-ivory/70 text-lg leading-relaxed">
                <p>
                  A landmark study across 30 schools found that students who received chess instruction for just 
                  one year showed significantly greater improvements in standardised maths and reading tests compared 
                  to control groups.
                </p>
                <p>
                  The skills practised on a chessboard — sequential thinking, hypothesis testing, pattern recognition — 
                  are the same skills that drive academic achievement across every subject.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 mt-10 bg-coral text-ivory font-inter font-600 px-8 py-4 rounded-full hover:bg-coral-dark transition-all"
              >
                Start your child's journey <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { num: '62%', desc: 'of schools with chess programmes report improved student focus in class' },
                { num: '3rd', desc: 'most effective out-of-school activity for academic improvement' },
                { num: '94%', desc: 'of children who play chess regularly say it helps them at school' },
                { num: '40+', desc: 'peer-reviewed studies show cognitive benefits of chess for children' },
              ].map((s, i) => (
                <div key={i} className="bg-midnight/40 rounded-2xl p-6 border border-white/10">
                  <div className="font-playfair text-coral text-4xl font-700 mb-2">{s.num}</div>
                  <p className="font-inter text-ivory/60 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-coral py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-playfair text-ivory mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 600 }}>
            Give your child the cognitive advantage.
          </h2>
          <p className="font-inter text-ivory/80 text-lg mb-8">
            Book a free trial class — the best investment you can make in a young mind.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-midnight text-ivory font-inter font-600 px-8 py-4 rounded-full hover:bg-slate transition-all"
          >
            Book a Free Trial <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}