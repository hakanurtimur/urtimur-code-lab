import { notFound } from "next/navigation";
import { StudentGate } from "@/features/auth/student-gate";
import { GamePlayer } from "@/features/games/components/game-player";
import { getGameById } from "@/features/games/data/basic-html-games";

type Props = { params: Promise<{ gameId: string }> };

export default async function GamePage({ params }: Props) {
  const { gameId } = await params;
  const game = getGameById(gameId);
  if (!game) notFound();
  return <StudentGate><GamePlayer game={game} /></StudentGate>;
}
