import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const INSTRUCTOR_IMG = 'https://media.base44.com/images/public/69fe1341895fe99f147fce64/3b7300d3f_51E37187-F312-43E1-8058-02E71B191F4B.png';

export default function InstructorTeaser() {
  return (
    <section className="bg-[#EEEAE0] py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative max-w-sm w-full">
              <div className="absolute inset-0 rounded-full bg-[#D4A843]/8 blur-2xl scale-110" />
              <img
                src={INSTRUCTOR_IMG}
                alt="RookFoundations Instructor"
                className="relative z-10 w-full rounded-full border-2 border-[#D4A843]/40 shadow-2xl shadow-[#D4A843]/10"
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
            <div className="gold-line mb-5" />
            <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-3">Your Instructor</span>
            <h2 className="font-oswald text-[#1C1C1E] uppercase leading-tight mb-8"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', letterSpacing: '0.02em' }}>
              Taught by a passionate educator,<br />
              <span className="text-[#D4A843]">not just a chess player.</span>
            </h2>
            <p className="font-lato text-[#2D2B26]/65 text-lg leading-relaxed mb-5">
              With over 8 years of experience teaching chess to children, I combine a background in 
              child development with a deep love of the game. My philosophy: build confidence first, technique second.
            </p>
            <p className="font-lato text-[#2D2B26]/65 text-lg leading-relaxed mb-10">
              Every child learns differently. My small-group sessions ensure every student receives 
              personalised attention and progresses at their own pace.
            </p>

            <blockquote className="border-l-4 border-[#D4A843] pl-6 mb-10">
              <p className="font-oswald text-[#1C1C1E] text-xl leading-relaxed uppercase tracking-wide">
                "Chess gave me the ability to think under pressure.<br />
                <span className="text-[#D4A843]">I want to give every child that same gift."</span>
              </p>
            </blockquote>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 font-oswald text-[#D4A843] text-sm tracking-widest uppercase hover:gap-4 transition-all"
            >
              Read my full story <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}