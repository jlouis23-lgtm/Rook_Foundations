import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, Users, Heart } from 'lucide-react';
import WhyChessResearch from '../components/about/WhyChessResearch';


const credentials = [
{ icon: BookOpen, title: 'Academic Tutor', desc: 'A focus on helping children build strong foundations in science, English, and maths.' },
{ icon: Award, title: 'Psychology & Human Development Background', desc: "Academic training from King's College London and The University of Manchester with a focus on behaviour, learning, decision-making, and child development." },
{ icon: Users, title: 'Experience Working With Children', desc: 'Background in mentoring, youth support, wellbeing, and residential care with experience supporting children across different needs and environments.' },
{ icon: Heart, title: 'Consistent Chess Experience', desc: 'Four years of dedicated chess study and competitive play, with a strong understanding of the learning process from beginner to intermediate level.' }];


const timeline = [
{ year: '2018', event: 'Began privately tutoring GCSE students in Maths, Science, and English — discovering how confidence and personalised support can transform a child\'s relationship with learning.' },
{ year: '2019', event: 'Worked as a Youth Officer at a children\'s camp, designing age-specific activities that deepened an understanding of child engagement, teamwork, and structured play.' },
{ year: '2021', event: 'Started a BSc in Psychology at the University of Manchester, focusing on developmental psychology, cognitive development, and how children build resilience through supportive environments.' },
{ year: '2022', event: 'Volunteered with Midlands charity ReachOut as a Peer Mentor, helping children from disadvantaged backgrounds build academic confidence, communication skills, and self-belief.' },
{ year: '2023', event: 'Conducted research with parents experiencing mental illness, exploring how stigma affects parenting and children\'s emotional wellbeing.' },
{ year: '2024', event: 'Began an MSc in War and Psychology at King\'s College London, studying trauma therapy, CBT, resilience, and emotional recovery in young people affected by conflict.' },
{ year: '2025', event: 'Conducted an independent study exploring whether AI and machine learning could be used to predict PTSD risk in veterans following combat.' },
{ year: '2026', event: 'Began working as a Children\'s Residential Support Worker, supporting young people from complex backgrounds with structure, safety, and stability during key stages of development.' },
{ year: 'Today', event: 'Rook Foundations created from the belief that chess builds confidence, patience, critical thinking, and resilience — drawing from years across education, psychology, mentorship, and child support.' }];


export default function About() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ backgroundColor: '#0A0A0A' }} className="pt-20">

      {/* Story */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}>

            <div className="gold-line mb-6" />
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-oswald text-[#D4A843] text-lg tracking-widest uppercase">About</span>
              <span className="text-[#D4A843]/30 text-lg">·</span>
              <span className="font-oswald text-white/40 text-base tracking-widest uppercase">My Story</span>
            </div>
            <h2 className="font-oswald text-white uppercase leading-tight mb-12"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', letterSpacing: '0.02em' }}>
              WHY CHESS? WHY THE ROOK?
            </h2>

            <div className="font-lato text-white/60 text-lg leading-relaxed max-w-3xl space-y-6">
              <p>Four years ago, chess came to me at a time where I was overloaded with assignments and bombarded with upcoming deadlines. I used to take breaks from study just to have a few games and it really helped me become more patient over time. For me, chess provided a unique kind of playful mental pressure. This helped me focus when completing the most monotonous aspects of research. When I started playing more with an actual person sitting across me, I realised that such a simple game beautifully captures some of the most meaningful concepts that are waning today. These concepts include the importance of sacrifice, the art of offence and defence, and that victory comes from connection. Having spent six years now working with children across different ages and different settings, I have come to realise that, today, they are disengaged from learning and overly consumed by constant media and digital stimulation. Too often, they are given answers instead of being encouraged to think for themselves.</p>
              <p>
                RookFoundations was born from a simple conviction:<br />
                <span className="text-white/80 italic">Every child deserves the opportunity to want to think for themselves.</span>
              </p>
            </div>

            <blockquote className="mt-12 border-l-4 border-[#D4A843] pl-8 max-w-3xl">
              <p className="font-oswald text-white uppercase tracking-wide leading-relaxed"
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)' }}>
                "SCHOOL TAUGHT ME HOW TO THINK.<br />
                <span className="text-[#D4A843]">BUT IT DIDN'T TEACH ME HOW TO WANT TO THINK FOR MYSELF."</span>
              </p>
            </blockquote>
          </motion.div>
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

      <WhyChessResearch />

      {/* Timeline */}
      <section className="bg-[#0D0D0D] py-24 border-t border-[#D4A843]/10">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div className="gold-line mx-auto mb-5" />
            <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-4">Journey</span>
            <h2 className="font-oswald text-white uppercase"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', letterSpacing: '0.02em' }}>
              The Journey Behind Rook Foundations
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
            Get 50% off your first lesson and see the RookFoundations difference for yourself.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-[#D4A843] text-[#0A0A0A] font-oswald font-700 tracking-wider px-8 py-4 hover:bg-[#e8c06a] transition-all">
            CLAIM 50% OFF FIRST LESSON <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}