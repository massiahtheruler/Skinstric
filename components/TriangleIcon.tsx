type TriangleIconProps = {
  className?: string;
  direction?: "left" | "right";
};

export default function TriangleIcon({
  className = "",
  direction = "left",
}: TriangleIconProps) {
  return (
    <span
      className={`triangle-icon triangle-icon--${direction} ${className}`}
      aria-hidden="true"
    >
      <span className="triangle-icon__outline" />
      <span className="triangle-icon__triangle" />
    </span>
  );
}
