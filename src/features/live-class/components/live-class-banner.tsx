"use client";

import Link from "next/link";
import { ArrowRight, PauseCircle, Radio } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useCurrentLiveClass } from "../use-current-live-class";

export function LiveClassBanner() {
  const { liveClass } = useCurrentLiveClass();
  const reduceMotion = useReducedMotion();

  if (!liveClass?.active || liveClass.status === "ended") return null;
  const frozen = liveClass.status === "frozen";

  return (
    <motion.aside
      className={frozen ? "live-class-banner is-frozen" : "live-class-banner"}
      initial={reduceMotion ? false : { opacity: 0, y: -10, scale: 0.99 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      aria-label="Canlı ders duyurusu"
    >
      <span className="live-class-banner-icon" aria-hidden="true">{frozen ? <PauseCircle /> : <Radio />}</span>
      <div className="live-class-banner-copy">
        <span><i /> {frozen ? "YAYIN DONDURULDU" : "CANLI DERS"}</span>
        <strong>Hakan Hoca canlı anlatıyor</strong>
        <p>{liveClass.title}{frozen ? " · Birazdan kaldığımız yerden devam edeceğiz." : " · Kod ve browser çıktısını canlı izle."}</p>
      </div>
      <Button asChild size="lg">
        <Link href="/live-class">Canlı derse katıl <ArrowRight /></Link>
      </Button>
    </motion.aside>
  );
}
