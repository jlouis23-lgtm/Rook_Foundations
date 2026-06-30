/**
 * PeopleIcon — unified icon for all pricing tiers.
 * Same visual style (filled head + stroked shoulder arc) across all counts.
 * count=1  Individual
 * count=2  Pair
 * count=4  Small Group
 * count=7  Group (rendered as 2 rows: 4 top + 3 bottom to avoid cramping)
 */
const person = (cx, cy, r, sR, sBaseline, key) => (
  <g key={key}>
    <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />
    <path
      d={`M${cx - sR} ${sBaseline} a${sR} ${sR} 0 0 1 ${sR * 2} 0`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </g>
);

export default function PeopleIcon({ count = 1, size = 44, className = '', style }) {
  let children;

  if (count === 1) {
    children = person(12, 8.5, 4, 7, 22, 0);
  } else if (count === 2) {
    children = [
      person(8,  8, 3, 5, 21, 0),
      person(16, 8, 3, 5, 21, 1),
    ];
  } else if (count === 4) {
    children = [4.5, 9.5, 14.5, 19.5].map((cx, i) => person(cx, 8, 2, 3, 19, i));
  } else {
    // 7 people: 4 on top row + 3 on bottom row — avoids density
    const row1 = [5, 10.5, 15, 20].map((cx, i) => person(cx, 6,  2, 2.5, 12.5, `r1-${i}`));
    const row2 = [7.5, 12, 16.5]  .map((cx, i) => person(cx, 16, 2, 2.5, 22,   `r2-${i}`));
    children = [...row1, ...row2];
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}