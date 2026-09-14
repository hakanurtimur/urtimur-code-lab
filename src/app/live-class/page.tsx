import { StudentGate } from "@/features/auth/student-gate";
import { LiveClassViewer } from "@/features/live-class/components/live-class-viewer";

export default function LiveClassPage() {
  return (
    <StudentGate>
      <LiveClassViewer />
    </StudentGate>
  );
}
