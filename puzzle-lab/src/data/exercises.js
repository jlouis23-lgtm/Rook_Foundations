import { Grid3x3, Sparkles, ScanEye, Repeat } from 'lucide-react';

export const EXERCISES = [
  {
    id: 'memory-match',
    path: '/memory-match',
    title: 'Memory Match',
    skill: 'Memory',
    Icon: Grid3x3,
    color: '#2d8c62',
    blurb: 'Flip the cards and find every matching pair. A classic warm-up for concentration and recall.',
  },
  {
    id: 'pattern-detective',
    path: '/pattern-detective',
    title: 'Pattern Detective',
    skill: 'Logic & Patterns',
    Icon: Sparkles,
    color: '#4a7eb8',
    blurb: 'Study the sequence and spot what comes next. Great for logical thinking and prediction.',
  },
  {
    id: 'odd-one-out',
    path: '/odd-one-out',
    title: 'Odd One Out',
    skill: 'Focus & Attention',
    Icon: ScanEye,
    color: '#b8790a',
    blurb: 'One shape in the group is different. Train sharp eyes and fast visual thinking.',
  },
  {
    id: 'sequence-recall',
    path: '/sequence-recall',
    title: 'Sequence Recall',
    skill: 'Working Memory',
    Icon: Repeat,
    color: '#7a48c0',
    blurb: 'Watch the pattern light up, then repeat it back. Each round adds one more step.',
  },
];
