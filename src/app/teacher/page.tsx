import { TeacherGate } from "@/features/auth/teacher-gate";
import { TeacherDashboard } from "@/features/teacher/teacher-dashboard";

export default function TeacherPage() {
  return (
    <TeacherGate>
      <TeacherDashboard />
    </TeacherGate>
  );
}
