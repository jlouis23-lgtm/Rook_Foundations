// Research highlights for the Later Life Enrichment page (/later-life-enrichment).
//
// Every claim below is limited to what the cited abstract or guideline text
// states, checked against the original records (publisher DOI, Europe PMC
// abstract, or the NICE guideline page). The wording is deliberately
// cautious: where a study shows an association rather than a cause, or a
// review finds the evidence insufficient, the card says so.
//
// Each highlight has:
//   level       key into `evidenceLabels` (src/data/research.js), shown in
//               words beside every card so the strength of the evidence never
//               relies on colour alone
//   title       a plain-English heading
//   summary     what the research found
//   limit       what it does not show (the honest "but")
//   source      the citation as displayed, with `label` as the link text
//   href        the DOI (or authoritative page) for the original source

export const laterLifeHighlights = [
  {
    id: 'board-games',
    level: 'game',
    title: 'Traditional board games and thinking skills',
    summary:
      'A 2023 systematic review and meta-analysis looked at traditional board games, including Go, mahjong and chess, played by older people at risk of or living with cognitive impairment. It found improvements on some measures of overall mental function and of quality of life. Different games affected different skills, and some measures showed no consistent effect.',
    limit:
      'The studies varied in design and the effects differed from game to game. The review does not show that any game prevents dementia or slows its progress, so we treat it as a reason to offer enjoyable, mentally engaging games, not as a promise.',
    source: 'Pozzi, Appollonio, Ferrarese & Tremolizzo (2023). Journal of Alzheimer’s Disease, 95(3), 829–845.',
    href: 'https://doi.org/10.3233/JAD-230473',
  },
  {
    id: 'leisure-association',
    level: 'related',
    title: 'Mentally active leisure and dementia risk: an association, not proof',
    summary:
      'A well-known US study followed 469 people over 75 who were living in the community and did not have dementia at the start. Over a median of about five years, people who read, played board games, played musical instruments or danced were less likely to go on to develop dementia.',
    limit:
      'This kind of study can show a link but not a cause. The authors noted that it was unclear whether the activities lowered the risk or whether people simply took part less as dementia began, and they called for controlled trials.',
    source: 'Verghese et al. (2003). New England Journal of Medicine, 348(25), 2508–2516.',
    href: 'https://doi.org/10.1056/NEJMoa022252',
  },
  {
    id: 'transfer',
    level: 'guidance',
    title: 'Practice helps most with the thing you practise',
    summary:
      'A major review of brain-training research found extensive evidence that people improve at the tasks they practise. It found little evidence that this carries over to distantly related tasks or to everyday thinking.',
    limit:
      'The review looked at brain-training programmes, not board games, but it is an important reminder. This is why we describe our sessions as enjoyable, engaging activity and do not claim they improve everyday memory or independence.',
    source: 'Simons et al. (2016). Psychological Science in the Public Interest, 17(3), 103–186.',
    href: 'https://doi.org/10.1177/1529100616661983',
  },
  {
    id: 'cognitive-stimulation',
    level: 'related',
    title: 'Enjoyable group activities for people living with dementia',
    summary:
      'Cognitive stimulation is a programme of enjoyable activities and discussion, usually in a small group, for people with dementia. A Cochrane review of 37 trials found small, short-term benefits to thinking skills for people with mild to moderate dementia. It also found clinically relevant improvements in staff ratings of communication and social interaction.',
    limit:
      'Our sessions are not cognitive stimulation therapy and we do not claim the same results. The review supports the value of offering enjoyable, social, mentally engaging activity, and it found that results varied a good deal between studies.',
    source: 'Woods et al. (2023). Cochrane Database of Systematic Reviews, CD005562.pub3.',
    href: 'https://doi.org/10.1002/14651858.CD005562.pub3',
  },
  {
    id: 'loneliness',
    level: 'guidance',
    title: 'Group activity and loneliness',
    summary:
      'A 2024 systematic review of ways to reduce loneliness among older people living in the community found moderate-certainty evidence that group-based programmes were linked to modest reductions in loneliness.',
    limit:
      'The same review found the evidence insufficient to draw conclusions about group activities as a category, and it did not look at care homes. We therefore describe our sessions as creating opportunities for conversation and shared enjoyment, and we do not claim they reduce loneliness.',
    source: 'Shekelle et al. (2024). Journal of General Internal Medicine, 39(6), 1015–1028.',
    href: 'https://doi.org/10.1007/s11606-023-08517-5',
  },
];

// National guidance cited in the person-centred approach section.
export const niceGuidance = {
  text: 'NICE guideline NG97, recommendation 1.4.1',
  href: 'https://www.nice.org.uk/guidance/ng97/chapter/Recommendations',
};
