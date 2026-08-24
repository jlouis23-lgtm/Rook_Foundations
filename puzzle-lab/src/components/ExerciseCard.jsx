import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function ExerciseCard({ exercise, index }) {
  const { path, title, skill, Icon, color, blurb } = exercise;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <Link
        to={path}
        className="group block h-full bg-white border border-ink/8 rounded-3xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon size={26} style={{ color }} />
        </div>
        <span
          className="font-nunito text-[11px] font-800 uppercase tracking-widest"
          style={{ color }}
        >
          {skill}
        </span>
        <h3 className="font-fredoka text-ink text-2xl mt-1.5 mb-2">{title}</h3>
        <p className="font-nunito text-ink/60 text-sm leading-relaxed mb-5">{blurb}</p>
        <span
          className="inline-flex items-center gap-1.5 font-nunito font-700 text-sm group-hover:gap-2.5 transition-all"
          style={{ color }}
        >
          Play now <ArrowRight size={15} />
        </span>
      </Link>
    </motion.div>
  );
}
