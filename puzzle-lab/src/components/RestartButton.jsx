import { RotateCcw } from 'lucide-react';

export default function RestartButton({ onClick, color, label = 'Start over' }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 font-nunito font-700 text-sm px-5 py-2.5 rounded-2xl border-2 hover:-translate-y-0.5 transition-all"
      style={{ borderColor: color, color }}
    >
      <RotateCcw size={15} /> {label}
    </button>
  );
}
