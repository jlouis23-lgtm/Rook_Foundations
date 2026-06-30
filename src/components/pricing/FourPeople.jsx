/**
 * FourPeople — custom icon matching lucide's line style (stroke, rounded caps).
 * Used for the Small Group pricing tier to clearly show four students.
 */
export default function FourPeople({ size = 24, className = '', style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {[4.5, 9.5, 14.5, 19.5].map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy="8" r="2" />
          <path d={`M${cx - 3} 19 a3 3 0 0 1 6 0`} />
        </g>
      ))}
    </svg>
  );
}