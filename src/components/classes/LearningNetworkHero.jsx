const SIZES = '(max-width: 640px) 88vw, (max-width: 1024px) 460px, 520px';

export default function LearningNetworkHero() {
  return (
    <div className="flex justify-center py-6 sm:py-10">
      <picture>
        <source
          type="image/webp"
          srcSet="/images/learning/learning-network-700w.webp 700w, /images/learning/learning-network.webp 962w"
          sizes={SIZES}
        />
        <img
          src="/images/learning/learning-network.jpg"
          srcSet="/images/learning/learning-network-700w.jpg 700w, /images/learning/learning-network.jpg 962w"
          sizes={SIZES}
          width={962}
          height={1118}
          loading="eager"
          fetchpriority="high"
          alt="A brain at the centre of a network connecting the strategy games Rook Foundations teaches — Chess, Go, Mastermind, Quoridor, Tower of Hanoi, Xiangqi, Reversi/Othello, Janggi and Marble Solitaire — each developing a different thinking skill."
          className="w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[460px] h-auto rounded-3xl shadow-sm"
        />
      </picture>
    </div>
  );
}
