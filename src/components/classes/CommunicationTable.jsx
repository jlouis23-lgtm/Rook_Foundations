import Reveal from '@/components/ui/Reveal';

// Six communication areas, one row each. Reuses the site's established
// six-colour rotation as a left-accent cue per row (table on desktop, card
// on mobile), matching the accent-strip convention already used elsewhere
// rather than introducing a new visual device.
const rows = [
  {
    area: 'Attention & eye contact',
    accent: '#2d8c62',
    notice: 'Difficulty maintaining shared attention or looking towards others when communicating.',
    help: 'Shared games create a natural focus for interaction.',
  },
  {
    area: 'Turn-taking & listening',
    accent: '#c9860f',
    notice: 'Difficulty waiting, listening or knowing when to contribute.',
    help: 'Turn-based games provide repeated opportunities to practise taking turns.',
  },
  {
    area: 'Social cues',
    accent: '#4a7eb8',
    notice: 'Difficulty interpreting facial expressions, body language or other social cues.',
    help: 'Games provide opportunities to notice and respond to others.',
  },
  {
    area: 'Conversation & communication',
    accent: '#7a48c0',
    notice: 'Difficulty starting, maintaining or developing two-way conversation.',
    help: 'Discussion and storytelling games encourage children to express and develop ideas.',
  },
  {
    area: 'Staying on topic',
    accent: '#c05050',
    notice: 'Difficulty maintaining a shared topic or returning to it after distraction.',
    help: 'Structured games provide a clear shared focus for communication.',
  },
  {
    area: 'Cooperation & shared problem-solving',
    accent: '#2a8c88',
    notice: 'Difficulty sharing ideas, negotiating or working towards a shared goal.',
    help: 'Strategy and cooperative games create opportunities to plan, negotiate and collaborate.',
  },
];

function DesktopTable() {
  return (
    <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#2D2520]/10">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#FAFAF7]">
            <th className="text-left font-nunito text-[#2D2520]/55 text-xs font-800 uppercase tracking-wide py-3 pl-5 pr-4 w-[22%]">
              Communication area
            </th>
            <th className="text-left font-nunito text-[#2D2520]/55 text-xs font-800 uppercase tracking-wide py-3 px-4 w-[39%]">
              What we may notice
            </th>
            <th className="text-left font-nunito text-[#2D2520]/55 text-xs font-800 uppercase tracking-wide py-3 px-4 w-[39%]">
              How games can help
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {rows.map((r, i) => (
            <tr key={r.area} className={i < rows.length - 1 ? 'border-b border-[#2D2520]/8' : ''}>
              <td className="align-top py-4 pl-5 pr-4" style={{ borderLeft: `3px solid ${r.accent}` }}>
                <p className="font-fredoka text-[#2D2520] text-sm leading-snug">{r.area}</p>
              </td>
              <td className="align-top py-4 px-4">
                <p className="font-nunito text-[#2D2520]/70 text-sm leading-snug">{r.notice}</p>
              </td>
              <td className="align-top py-4 px-4">
                <p className="font-nunito text-[#2D2520]/70 text-sm leading-snug">{r.help}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileCards() {
  return (
    <div className="md:hidden space-y-3">
      {rows.map((r) => (
        <div
          key={r.area}
          className="bg-white border border-[#2D2520]/10 rounded-2xl p-5"
          style={{ borderTopWidth: 3, borderTopColor: r.accent }}
        >
          <p className="font-fredoka text-[#2D2520] text-base mb-3 leading-snug">{r.area}</p>
          <p className="font-nunito text-[#2D2520]/45 text-xs font-800 uppercase tracking-wide mb-1">What we may notice</p>
          <p className="font-nunito text-[#2D2520]/70 text-sm leading-relaxed mb-3">{r.notice}</p>
          <p className="font-nunito text-[#2D2520]/45 text-xs font-800 uppercase tracking-wide mb-1">How games can help</p>
          <p className="font-nunito text-[#2D2520]/70 text-sm leading-relaxed">{r.help}</p>
        </div>
      ))}
    </div>
  );
}

export default function CommunicationTable() {
  return (
    <div>
      <h3 className="font-fredoka text-[#2D2520] text-xl mb-6 text-center leading-snug">
        How Games Can Support Participation
      </h3>

      <Reveal>
        <DesktopTable />
        <MobileCards />
      </Reveal>

      <div className="mt-6 bg-[#E8A020]/5 border border-[#E8A020]/15 rounded-2xl px-5 py-4">
        <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
          <strong className="font-700 text-[#2D2520]">Important:</strong> These are possible observations, not assessments or diagnoses. We use them to understand how a child communicates within particular activities and consider whether the activity, environment or communication approach could be adapted.
        </p>
      </div>
    </div>
  );
}
