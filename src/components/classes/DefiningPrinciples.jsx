import Reveal from '@/components/ui/Reveal';

// Three defining principles of the Building Independence Through Challenge
// approach. Reuses the exact editorial three-column pattern already
// established on this page by TeachingPrinciples (thin divide-x/divide-y
// dividers, no card/border/shadow) rather than a new visual device, per the
// brief's steer towards an integrated, minimal treatment — kept monochrome
// (no per-item accent colour) since these three read as one unified set of
// founding principles rather than a sequence of distinct daily practices.
const principles = [
  'Difficulty is not necessarily something to avoid',
  'If everything is made easy for a child, they may have fewer opportunities to experience the sense of competence that can come from working through something difficult.',
  "A child develops independence not because the adult removes every obstacle, but because the adult creates safe boundaries within which the child can make decisions.",
];

export default function DefiningPrinciples() {
  return (
    <Reveal>
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2D2520]/10">
        {principles.map((text, i) => (
          <div key={i} className="py-5 md:py-0 md:px-8 md:first:pl-0 md:last:pr-0 text-center md:text-left">
            <p className="font-nunito text-[#2D2520] text-base sm:text-lg font-700 leading-snug">{text}</p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
