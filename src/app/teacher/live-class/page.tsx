import { TeacherGate } from "@/features/auth/teacher-gate";
import { LiveClassStudio } from "@/features/live-class/components/live-class-studio";

export default function TeacherLiveClassPage() {
  return (
    <TeacherGate>
      <LiveClassStudio />
    </TeacherGate>
  );
}
