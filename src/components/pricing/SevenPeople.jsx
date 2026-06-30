/**
 * SevenPeople — custom icon matching lucide's line style (stroke, rounded caps).
 * Same head + shoulder design as FourPeople, showing up to seven students.
 */
export default function SevenPeople({ size = 24, className = '', style }) {
  const people = [1.9, 5.25, 8.6, 12, 15.4, 18.75, 22.1];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {people.map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy="9" r="1.5" />
          <path d={`M${cx - 2.2} 18 a2.2 2.2 0 0 1 4.4 0`} />
        </g>
      ))}
    </svg>
  );
}