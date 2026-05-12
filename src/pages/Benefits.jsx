import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Target, Lightbulb, Heart, Shield, TrendingUp, Eye, Zap } from 'lucide-react';

const benefits = [
{ icon: Brain, title: 'Memory & Retention', desc: 'Chess requires memorising openings, patterns, and positional concepts. Regular practice measurably improves working memory and information retention.', stat: '15%', statLabel: 'improvement in memory tasks', research: 'University of Memphis study, 2017' },
{ icon: Target, title: 'Concentration & Focus', desc: "Chess can lead to significant imprr", stat: '2×', statLabel: 'longer sustained attention', research: 'Belgian study on chess in schools' },
{ icon: Lightbulb, title: 'Problem Solving', desc: 'Every position is a novel problem. Chess trains children to analyse, identify options, evaluate outcomes, and make decisions.', stat: '32%', statLabel: 'increase in problem-solving scores', research: 'PA State University, 2004' },
{ icon: TrendingUp, title: 'Mathematical Thinking', desc: 'Chess strengthens spatial reasoning, pattern recognition, and logical inference — all foundational skills for mathematics and science.', stat: '+17%', statLabel: 'maths test improvement', research: 'New Brunswick study, 1995' },
{ icon: Heart, title: 'Emotional Resilience', desc: 'Learning to lose gracefully, recover from mistakes, and stay composed under pressure builds the emotional intelligence that defines lifelong success.', stat: '100%', statLabel: 'students show improved patience', research: 'RookFoundations internal data' },
{ icon: Shield, title: 'Discipline & Self-Control', desc: 'Chess rewards careful, deliberate thinking and punishes impulsive moves. Children internalise the value of thinking before acting.', stat: '3×', statLabel: 'more deliberate decision-making', research: 'Observed in classroom settings' },
{ icon: Eye, title: 'Spatial Reasoning', desc: 'Visualising piece movements, thinking ahead in 3D space, and mapping positional relationships develops outstanding spatial intelligence.', stat: 'Top 10%', statLabel: 'in spatial reasoning tests', research: 'Chess players vs. non-players' },
{ icon: Zap, title: 'Confidence & Self-Belief', desc: 'Nothing builds confidence like mastering something genuinely difficult. Every puzzle solved, every game won, every comeback is a victory for self-belief.', stat: '92%', statLabel: 'of students report higher confidence', research: 'RookFoundations parent survey' }];


const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Benefits() {
  return (
    <div style={{ backgroundColor: '#0A0A0A' }} className="pt-32">
      <section className="relative overflow-hidden py-20 border-b border-[#D4A843]/15">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[#D4A843]/3 font-oswald select-none pointer-events-none text-[30rem] leading-none" style={{ transform: 'translateY(-50%) translateX(20%)' }}>♝</div>
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className="gold-line mx-auto mb-5" />
          <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-4">The Cognitive Edge</span>
          <h1 className="font-oswald text-white uppercase mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.02em' }}>
            Why chess changes children.
          </h1>
          <p className="font-lato text-white/50 text-xl leading-relaxed max-w-2xl mx-auto">
            The evidence is extraordinary. Chess isn't just enrichment — it's one of the most potent cognitive development tools available.
          </p>
        </div>
      </section>

      <section className="py-16 border-b border-[#D4A843]/10">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <p className="font-oswald text-white/20 text-sm tracking-widest uppercase mb-4">Blaise Pascal</p>
          <p className="font-oswald text-white text-3xl uppercase tracking-wide leading-relaxed">
            "Chess is the <span className="text-[#D4A843]">gymnasium of the mind.</span>"
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div variants={container} initial="hidden" animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#D4A843]/10">
            {benefits.map((b) =>
            <motion.div key={b.title} variants={item}
            className="group bg-[#0A0A0A] p-8 hover:bg-[#0D0D0D] border border-transparent hover:border-[#D4A843]/20 transition-all duration-300">
                <div className="w-12 h-12 border border-[#D4A843]/30 flex items-center justify-center mb-5 group-hover:border-[#D4A843] transition-colors">
                  <b.icon size={20} className="text-[#D4A843]/60 group-hover:text-[#D4A843] transition-colors" />
                </div>
                <h3 className="font-oswald text-white text-lg uppercase tracking-wide mb-3 group-hover:text-[#D4A843] transition-colors">{b.title}</h3>
                <p className="font-lato text-white/50 text-sm leading-relaxed mb-6">{b.desc}</p>
                <div className="pt-5 border-t border-[#D4A843]/10">
                  <div className="font-oswald text-[#D4A843] text-3xl font-700">{b.stat}</div>
                  <div className="font-lato text-white/40 text-xs mt-1">{b.statLabel}</div>
                  <div className="font-lato text-white/20 text-xs mt-1 italic">{b.research}</div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="bg-[#0D0D0D] py-24 border-t border-[#D4A843]/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="gold-line mb-5" />
              <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-4">Academic Impact</span>
              <h2 className="font-oswald text-white uppercase mb-8" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', letterSpacing: '0.02em' }}>
                Chess players consistently<br /><span className="text-[#D4A843]">outperform their peers.</span>
              </h2>
              <div className="space-y-5 font-lato text-white/60 text-lg leading-relaxed">
                <p>A landmark study across 30 schools found that students who received chess instruction for just one year showed significantly greater improvements in standardised maths and reading tests.</p>
                <p>The skills practised on a chessboard — sequential thinking, hypothesis testing, pattern recognition — are the same skills that drive academic achievement across every subject.</p>
              </div>
              <Link to="/contact" className="inline-flex items-center gap-2 mt-10 bg-[#D4A843] text-[#0A0A0A] font-oswald font-700 tracking-wider px-8 py-4 hover:bg-[#e8c06a] transition-all">
                START YOUR CHILD'S JOURNEY <ArrowRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
              { num: '62%', desc: 'of schools with chess programmes report improved student focus in class' },
              { num: '3rd', desc: 'most effective out-of-school activity for academic improvement' },
              { num: '94%', desc: 'of children who play chess regularly say it helps them at school' },
              { num: '40+', desc: 'peer-reviewed studies show cognitive benefits of chess for children' }].
              map((s, i) =>
              <div key={i} className="border border-[#D4A843]/20 p-6 hover:border-[#D4A843]/50 transition-colors">
                  <div className="font-oswald text-[#D4A843] text-4xl font-700 mb-2">{s.num}</div>
                  <p className="font-lato text-white/50 text-sm leading-relaxed">{s.desc}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 text-center border-t border-[#D4A843]/15" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="max-w-2xl mx-auto px-6">
          <div className="gold-line mx-auto mb-6" />
          <h2 className="font-oswald text-white uppercase mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', letterSpacing: '0.02em' }}>
            Give your child the cognitive advantage.
          </h2>
          <p className="font-lato text-white/50 text-lg mb-8">Book a free trial class — the best investment you can make in a young mind.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-[#D4A843] text-[#0A0A0A] font-oswald font-700 tracking-wider px-8 py-4 hover:bg-[#e8c06a] transition-all">
            BOOK A FREE TRIAL <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>);

}