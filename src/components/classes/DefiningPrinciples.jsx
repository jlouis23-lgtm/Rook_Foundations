import Reveal from '@/components/ui/Reveal';

// Three defining principles of the Building Independence Through Challenge
// approach. Stacked as a vertical sequence rather than a three-column row,
// with typography matching the body paragraph directly beneath (same
// family, size, weight) so these read as integrated statements rather than
// bold marketing lines. Distinction comes from layout instead: a small gold
// numeral (echoing the eyebrow-label colour used sitewide) plus a fine rule
// between each row, not from boldening the text itself.
const principles = [
  'Difficulty is not necessarily something to avoid',
  'If everything is made easy for a child, they may have fewer opportunities to experience the sense of competence that can come from working through something difficult.',
  "A child develops independence not because the adult removes every obstacle, but because the adult creates safe boundaries within which the child can make decisions.",
];

export default function DefiningPrinciples() {
  return (
    <Reveal>
      <div className="max-w-2xl mx-auto divide-y divide-[#2D2520]/10">
        {principles.map((text, i) => (
          <div key={i} className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
            <span className="font-nunito text-[#b8790a] text-xs font-700 tracking-wide pt-0.5 flex-shrink-0" aria-hidden="true">
              0{i + 1}
            </span>
            <p className="font-nunito text-[#2D2520]/80 text-base leading-relaxed text-left">{text}</p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
