import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-gold/15">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-gold rounded-2xl flex items-center justify-center group-hover:bg-gold-dark transition-colors duration-300 shadow-md shadow-gold/30 flex-shrink-0">
            <span className="text-white text-2xl leading-none">♜</span>
          </div>
          <div className="leading-none">
            <span className="font-fredoka text-ink text-lg font-600 block">Puzzle Lab</span>
            <span className="font-nunito text-gold-deep text-[11px] font-700 uppercase tracking-widest block mt-0.5">by Rook Foundations</span>
          </div>
        </Link>

        {!isHome && (
          <Link
            to="/"
            className="flex items-center gap-1.5 font-nunito font-700 text-sm text-ink/60 hover:text-gold transition-colors"
          >
            <ArrowLeft size={16} /> All puzzles
          </Link>
        )}
      </div>
    </header>
  );
}
