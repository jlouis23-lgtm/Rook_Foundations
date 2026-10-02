import { evidenceLabels } from '@/data/research';

// The studies behind one research strand. Each entry leads with what the
// study found (the part a visitor wants), then gives the full citation and
// a link to the source. The evidence label is always written out in words
// rather than conveyed by colour alone.
export default function ReferenceList({ refs, deep }) {
  return (
    <ul className="divide-y divide-[#2D2520]/10">
      {refs.map((ref) => (
        <li key={ref.citation} className="py-5 first:pt-1">
          <p className="font-nunito text-[0.7rem] font-800 uppercase tracking-widest" style={{ color: deep }}>
            {evidenceLabels[ref.level]}
          </p>
          <p className="font-nunito text-[0.95rem] leading-relaxed text-[#2D2520]/85 mt-1.5">{ref.detail}</p>
          <p className="font-nunito text-[0.82rem] leading-snug text-[#2D2520]/70 mt-2.5">{ref.citation}</p>
          {ref.url && (
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 font-nunito text-[0.82rem] font-700 underline underline-offset-2 hover:no-underline"
              style={{ color: deep }}
            >
              Read the source
              <span className="sr-only"> (opens in a new tab)</span>
              <span aria-hidden="true"> →</span>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
