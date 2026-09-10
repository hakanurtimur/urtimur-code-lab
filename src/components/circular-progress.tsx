import { cn } from "@/lib/utils";

type CircularProgressProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  tone?: "violet" | "sky" | "mint" | "peach" | "ink";
  className?: string;
  children?: React.ReactNode;
};

export function CircularProgress({
  value,
  size = 72,
  strokeWidth = 7,
  label,
  tone = "violet",
  className,
  children,
}: CircularProgressProps) {
  const normalized = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (normalized / 100) * circumference;
  const accessibleLabel = label ?? `%${Math.round(normalized)} tamamlandı`;

  return (
    <span
      className={cn("circular-progress", `circular-progress-${tone}`, className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={accessibleLabel}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          className="circular-progress-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />
        <circle
          className="circular-progress-value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="circular-progress-content">
        {children ?? <strong>{Math.round(normalized)}%</strong>}
      </span>
    </span>
  );
}
