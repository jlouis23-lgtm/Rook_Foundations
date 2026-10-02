import Reveal from '@/components/ui/Reveal';

// Seven activities. Colour rotation and sequence matches the site's other
// seven-item model (IndependenceModel) exactly — the same six established
// stage accents, cycling back to green for the seventh — rather than a new
// palette, per the brief's explicit steer to reuse the existing Behaviour/
// Independence models' visual language.
const activities = [
  { name: 'Comprehension games', develops: 'understanding and processing language', accent: '#2d8c62' },
  { name: 'Friendly debates', develops: 'expressing and defending ideas', accent: '#c9860f' },
  { name: 'Story starters', develops: 'generating and organising ideas', accent: '#4a7eb8' },
  { name: 'Dice storytelling', develops: 'narrative development and creativity', accent: '#7a48c0' },
  { name: 'Communication cards', develops: 'vocabulary and supported communication', accent: '#c05050' },
  { name: 'Word building games', develops: 'vocabulary, spelling and language structure', accent: '#2a8c88' },
  { name: 'Role play', develops: 'shared imagination, perspective taking, communication, negotiation and responding to others', accent: '#2d8c62' },
];

export default function ActivityTable() {
  return (
    <Reveal>
      <div role="table" aria-label="Activities and what children practise">
        <div role="row" className="hidden sm:grid grid-cols-[180px_1fr] gap-x-6 pb-2 mb-1 border-b border-[#2D2520]/10">
          <span role="columnheader" className="font-nunito text-[#2D2520]/45 text-xs font-800 uppercase tracking-wide">
            Activity
          </span>
          <span role="columnheader" className="font-nunito text-[#2D2520]/45 text-xs font-800 uppercase tracking-wide">
            What children practise
          </span>
        </div>

        {activities.map((a, i) => (
          <div
            key={a.name}
            role="row"
            className={`grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-x-6 gap-y-1 py-3.5 ${i < activities.length - 1 ? 'border-b border-[#2D2520]/8' : ''}`}
          >
            <p role="cell" className="font-fredoka text-base leading-snug flex items-center gap-2.5" style={{ color: a.accent }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: a.accent }} aria-hidden="true" />
              {a.name}
            </p>
            <p role="cell" className="font-nunito text-[#2D2520]/55 text-sm leading-relaxed sm:pl-0 pl-4">
              {a.develops}
            </p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
