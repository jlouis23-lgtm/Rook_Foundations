// Three teaching principles, presented as an editorial three-column spread
// (thin dividers) rather than the white-card-with-coloured-top-border
// treatment used everywhere else on the site (RegulationStrategies,
// ValuesFan, BehaviourFramework's StagePanel, etc.) — deliberately, per the
// brief's explicit steer away from another variation of that component.
const principles = [
  {
    title: 'Purposeful Activities',
    accent: '#2d8c62',
    body: "Activities are not selected simply because they are enjoyable. Each is chosen for what it can help a child practise or develop, with activities adapted or created where a particular skill needs to be targeted.",
  },
  {
    title: 'Building Transfer',
    accent: '#4a7eb8',
    body: "We do not assume that skills automatically transfer between activities. Instead, relationship, challenge and reflection create opportunities to practise and apply skills across different contexts.",
  },
  {
    title: 'Supporting Independence',
    accent: '#7a48c0',
    body: "When children encounter difficulty, we provide support without unnecessarily taking over the problem. Questions, prompts, clues, modelling and guidance can help children move forward while developing greater independence in their thinking and problem solving.",
  },
];

export default function TeachingPrinciples() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2D2520]/10">
      {principles.map((p) => (
        <div key={p.title} className="py-8 md:py-0 md:px-8 md:first:pl-0 md:last:pr-0">
          <h3 className="font-fredoka text-lg sm:text-xl mb-2.5 leading-snug" style={{ color: p.accent }}>
            {p.title}
          </h3>
          <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">{p.body}</p>
        </div>
      ))}
    </div>
  );
}
