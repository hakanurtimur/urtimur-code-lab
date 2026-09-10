import { CurriculumDashboard } from "@/features/curriculum/curriculum-dashboard";
import { curriculumModules } from "@/features/curriculum/get-lesson";
import { StudentGate } from "@/features/auth/student-gate";

export default function Home() {
  return (
    <StudentGate>
      <CurriculumDashboard modules={curriculumModules} />
    </StudentGate>
  );
}
