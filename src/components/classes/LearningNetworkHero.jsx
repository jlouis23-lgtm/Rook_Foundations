const SIZES = '(max-width: 640px) 92vw, (max-width: 1024px) 680px, 820px';

export default function LearningNetworkHero() {
  return (
    <div className="flex justify-center py-6 sm:py-10">
      <picture>
        <source
          type="image/webp"
          srcSet="/images/learning/learning-network-700w.webp 700w, /images/learning/learning-network.webp 2200w"
          sizes={SIZES}
        />
        <img
          src="/images/learning/learning-network.jpg"
          srcSet="/images/learning/learning-network-700w.jpg 700w, /images/learning/learning-network.jpg 2200w"
          sizes={SIZES}
          width={2200}
          height={1555}
          loading="eager"
          fetchpriority="high"
          alt="A brain at the centre of a network connecting the strategy game publishers and platforms Rook Foundations draws from — Smart Games, Ravensburger, Blue Orange, Chess.com, Sensory Education, HABA, Arcane Wonders, Peaceable Kingdom, Gigamic, Thinkfun and Junior Learning."
          className="w-full max-w-[500px] sm:max-w-[620px] lg:max-w-[820px] h-auto rounded-3xl shadow-sm"
        />
      </picture>
    </div>
  );
}
