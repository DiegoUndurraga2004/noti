import Link from "next/link";
import { courses } from "@/data/courses";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Noti</h1>

      <div className="space-y-4">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="block p-4 bg-white rounded-xl shadow hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {course.name} {course.semester}
            </h2>
            <p className="text-sm text-gray-500">{course.code}</p>
          </Link>
        ))}
      </div>

      <button className="mt-8 px-4 py-2 bg-blue-600 text-white rounded-lg">
        + Agregar ramo
      </button>
    </main>
  );
}