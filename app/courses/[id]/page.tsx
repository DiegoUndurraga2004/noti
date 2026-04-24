import { courses } from "@/data/courses";
import CourseClient from "./CourseClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CoursePage({ params }: Props) {
  const { id } = await params;

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        Curso no encontrado: {id}
      </main>
    );
  }

  return <CourseClient course={course} />;
}