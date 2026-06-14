type RectangleProps = {
  className?: string;
  color?: string;
  dashed?: boolean;
  dashPattern?: string;
  strokeWidth?: number;
};

export default function Rectangle({
  className = "",
  color = "rgba(160, 164, 171, 1)",
  dashed = false,
  dashPattern = "0.1 8",
  strokeWidth = 2,
}: RectangleProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 602 602"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x={strokeWidth / 2}
        y={strokeWidth / 2}
        width={602 - strokeWidth}
        height={602 - strokeWidth}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? dashPattern : undefined}
        strokeLinecap="round"
      />
    </svg>
  );
}
