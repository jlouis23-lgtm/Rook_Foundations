import { motion } from 'framer-motion';
import { DIFFICULTIES } from '@/lib/difficulty';

export default function DifficultyPicker({ value, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      {DIFFICULTIES.map((d) => {
        const active = value === d.id;
        return (
          <motion.button
            key={d.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange(d.id)}
            className="relative overflow-hidden flex-1 sm:flex-none sm:w-44 px-5 py-3.5 rounded-2xl border-2 font-nunito text-left transition-colors"
            style={{
              borderColor: active ? d.color : '#e5e0d3',
              backgroundColor: active ? `${d.color}12` : '#fff',
            }}
          >
            <span className="block font-fredoka text-base font-600" style={{ color: active ? d.color : '#2D2520' }}>
              {d.label}
            </span>
            <span className="block text-xs text-ink/50 font-700 mt-0.5">{d.ages}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
