import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandProps = {
  href?: string;
  className?: string;
  compact?: boolean;
};

export function Brand({ href = "/", className, compact = false }: BrandProps) {
  return (
    <Link
      href={href}
      aria-label="Hakan Urtimur Code Lab"
      className={cn("brand-lockup", compact && "brand-lockup-compact", className)}
    >
      <span className="brand-mark-wrap" aria-hidden="true">
        <img
          data-testid="brand-mark"
          src="/brand/mark-dark.svg"
          alt=""
          className="brand-mark-image"
        />
      </span>
      <span className="brand-wordmark">
        <span className="brand-owner">Hakan Urtimur</span>
        <span className="brand-product">Code Lab</span>
      </span>
    </Link>
  );
}
