import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight, Clock, Users, MapPin, BookOpen, Heart, HelpCircle } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';
import HowWeTeachSection from '@/components/classes/HowWeTeachSection';
import LearningNetworkHero from '@/components/classes/LearningNetworkHero';
import CulturalSymbolAccents from '@/components/classes/CulturalSymbolAccents';

export default function Classes() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [hash]);

  return (
    <div className="bg-[#FAFAF7] pt-32">
      {/* Header */}
      <section className="relative overflow-hidden py-20">
        <ChessBg variant="page" />
        <CulturalSymbolAccents />

        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-5">
            <BookOpen size={14} /> Learning at every level
          </span>
          <h1 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Strategy games for every curious mind
          </h1>

          <LearningNetworkHero />
        </div>
      </section>

      <HowWeTeachSection />

      {/* What every session looks like */}
      <section className="py-20 relative overflow-hidden">
        <ChessBg variant="classes" />
        <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="bg-white border border-[#E8A020]/15 rounded-3xl p-7 shadow-sm">
              <h3 className="font-fredoka text-[#2D2520] text-xl mb-5">What every session looks like</h3>
              <div className="space-y-4">
                {[
                  { icon: Clock, label: 'Session Length', value: '1 or 2 hours' },
                  { icon: Users, label: 'Group Size', value: 'Up to 4 students' },
                  { icon: Clock, label: 'Frequency', value: 'Once weekly' },
                  { icon: MapPin, label: 'Format', value: 'In-person only' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 py-3 border-b border-[#E8A020]/8 last:border-0">
                    <div className="w-8 h-8 bg-[#E8A020]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-[#E8A020]" />
                    </div>
                    <div>
                      <p className="font-nunito text-[#E8A020]/70 text-xs font-700 uppercase tracking-wide">{label}</p>
                      <p className="font-nunito text-[#2D2520] text-sm font-700 mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <MotionLink
                whileTap={ctaTap}
                to="/contact"
                className="w-full mt-6 bg-[#E8A020] text-white font-fredoka font-600 text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#d4940e] transition-all hover:shadow-lg hover:shadow-[#E8A020]/20"
              >
                Enquire Now <ArrowRight size={16} />
              </MotionLink>
            </div>

            <div className="bg-white border border-[#E8A020]/15 rounded-3xl p-7 shadow-sm flex flex-col justify-center">
              <HelpCircle size={28} className="text-[#E8A020] block mb-3" />
              <h4 className="font-fredoka text-[#2D2520] text-xl mb-2">Not sure which game or level?</h4>
              <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed mb-5">
                With over 30 games to choose from, I adapt each session to your child's interests, focus and confidence. From independent challenges to games played together, I'll explore the right level to engage, support and stretch them.
              </p>
              <MotionLink
                whileTap={ctaTap}
                to="/contact"
                className="inline-block bg-[#E8A020] text-white font-fredoka font-600 text-sm py-3 px-6 rounded-2xl text-center hover:bg-[#d4940e] transition-all hover:shadow-md self-start"
              >
                Free Assessment Session
              </MotionLink>
              <p className="font-nunito text-[#2D2520]/45 text-xs mt-4 flex items-center gap-1.5">
                <Heart size={13} className="text-[#E8A020]/70" /> Every lesson adapts to how your child learns best.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
