import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type LearningStickerProps = {
  icon: LucideIcon;
  label: string;
  tone?: "violet" | "sky" | "mint" | "peach" | "pink" | "yellow";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function LearningSticker({
  icon: Icon,
  label,
  tone = "violet",
  size = "md",
  className,
}: LearningStickerProps) {
  return (
    <span
      className={cn("learning-sticker", `learning-sticker-${tone}`, `learning-sticker-${size}`, className)}
      aria-label={label}
      title={label}
    >
      <span className="learning-sticker-shine" aria-hidden="true" />
      <Icon aria-hidden="true" />
    </span>
  );
}
