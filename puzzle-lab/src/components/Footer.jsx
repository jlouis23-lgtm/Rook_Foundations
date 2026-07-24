export default function Footer() {
  return (
    <footer className="border-t border-gold/15 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gold rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm leading-none">♜</span>
          </div>
          <span className="font-nunito text-ink/50 text-sm">
            Puzzle Lab is an independent thinking-skills app by{' '}
            <span className="font-700 text-ink/70">Rook Foundations</span>
          </span>
        </div>
        <p className="font-nunito text-ink/35 text-xs">No accounts, no saved data — just puzzles, played fresh every time.</p>
      </div>
    </footer>
  );
}
