import Image from "next/image";
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
        <Image
          data-testid="brand-mark"
          src="/brand/mark-dark.svg"
          alt=""
          width={27}
          height={24}
          unoptimized
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
