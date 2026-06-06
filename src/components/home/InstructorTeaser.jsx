import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';

const INSTRUCTOR_IMG = 'https://media.base44.com/images/public/69fe1341895fe99f147fce64/3b7300d3f_51E37187-F312-43E1-8058-02E71B191F4B.png';

export default function InstructorTeaser() {
  return (
    <section className="bg-[#FAFAF7] py-24 relative overflow-hidden">
      <ChessBg variant="instructor" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative max-w-sm w-full">
              <div className="absolute inset-0 bg-[#E8A020]/15 blob-shape blur-2xl scale-110" />
              <img
                src={INSTRUCTOR_IMG}
                alt="RookFoundations Instructor"
                className="relative z-10 w-full rounded-full border-4 border-white shadow-2xl shadow-[#E8A020]/15"
              />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-200 rounded-full px-4 py-2 mb-5">
              <span className="text-sm">👋</span>
              <span className="font-nunito text-amber-700 text-sm font-700">Meet your instructor</span>
            </div>
            <h2 className="font-fredoka text-[#2D2520] leading-tight mb-6"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              Taught with passion,<br />
              <span className="text-[#E8A020]">not just knowledge.</span>
            </h2>
            <p className="font-nunito text-[#2D2520]/65 text-base leading-relaxed mb-5">
              With a background in psychology, child development, and youth mentorship, I bring far more than chess knowledge to every session — I bring genuine care for each child's growth.
            </p>
            <p className="font-nunito text-[#2D2520]/65 text-base leading-relaxed mb-8">
              Small groups and personalised attention ensure every child feels supported, celebrated, and challenged in just the right way.
            </p>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-8">
              <p className="font-fredoka text-[#2D2520] text-xl leading-relaxed">
                "Chess gave me the ability to think under pressure.
                <span className="text-[#E8A020]"> I want to give every child that same gift."</span>
              </p>
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 font-nunito text-[#E8A020] font-700 text-sm hover:gap-4 transition-all"
            >
              Read my full story <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}