export default function PuzzleHeader({ Icon, color, title, description }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-10">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon size={30} style={{ color }} />
      </div>
      <h1 className="font-fredoka text-ink text-3xl sm:text-4xl mb-3">{title}</h1>
      <p className="font-nunito text-ink/60 text-base leading-relaxed">{description}</p>
    </div>
  );
}
