"use client";
import { calculateWeightedAverage, calculateDiscretas } from "@/lib/gradeCalculations";
import { useState, useEffect } from "react";

type Evaluation = {
  id: string;
  name: string;
  weight: number | null;
};

type Course = {
  id: string;
  code: string;
  name: string;
  semester: string;
  passingGrade: number;
  formulaDescription: string;
  evaluations: Evaluation[];
  specialRule?: string;
};

export default function CourseClient({ course }: { course: Course }) {
    const [grades, setGrades] = useState<Record<string, number>>({});

    useEffect(() => {
        const saved = localStorage.getItem(`grades-${course.id}`);

        if (saved) {
        setGrades(JSON.parse(saved));
        }
    }, [course.id]);

    useEffect(() => {
        localStorage.setItem(`grades-${course.id}`, JSON.stringify(grades));
    }, [grades, course.id]);

    const handleChange = (evaluationId: string, value: string) => {
        const grade = Number(value);

        setGrades((prev) => ({
        ...prev,
        [evaluationId]: grade,
        }));
    };

  const { average, weightUsed } = calculateWeightedAverage(
    grades,
    course.evaluations
    );

    const remainingWeight = 100 - weightUsed;

    let neededAverage = 0;

    if (remainingWeight > 0) {
    neededAverage =
        (course.passingGrade * 100 - average * weightUsed) / remainingWeight;
    }
    let finalGrade = null;

    if (course.specialRule === "AVG3_TOP_WITH_EXAM_DUPLICATED") {
    finalGrade = calculateDiscretas(grades);
    }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="text-2xl font-bold mb-2">
        {course.name} - {course.semester}
      </h1>

      <p className="text-slate-400 mb-6">{course.code}</p>

      <p className="text-slate-300 mb-6">{course.formulaDescription}</p>

      <div className="space-y-4">
        {course.evaluations.map((ev) => (
          <div
            key={ev.id}
            className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-700"
          >
            <div>
              <p className="font-medium">{ev.name}</p>
              {ev.weight !== null && (
                <p className="text-sm text-slate-400">{ev.weight}%</p>
              )}
            </div>

            <input
              type="number"
              min="1"
              max="7"
              step="0.1"
              placeholder="Nota"
              value={grades[ev.id] ?? ""}
              className="w-24 p-2 rounded bg-slate-800 text-white border border-slate-600"
              onChange={(e) => handleChange(ev.id, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-2">
        {course.specialRule === "AVG3_TOP_WITH_EXAM_DUPLICATED" ? (
            finalGrade !== null ? (
            <p>
                Nota final estimada: {finalGrade.toFixed(2)}{" "}
                {finalGrade >= course.passingGrade ? "✅ Aprobado" : "❌ Reprobado"}
            </p>
            ) : (
            <p>Ingresa todas las notas para calcular</p>
            )
        ) : (
            <>
            <p>Promedio actual: {average.toFixed(2)}</p>
            <p>Ponderación completada: {weightUsed}%</p>

            {remainingWeight > 0 && (
                <p>
                Necesitas promedio {neededAverage.toFixed(2)} en lo restante para aprobar
                </p>
            )}

            {remainingWeight === 0 && (
                <p>
                Nota final: {average.toFixed(2)}{" "}
                {average >= course.passingGrade ? "✅ Aprobado" : "❌ Reprobado"}
                </p>
            )}
            </>
        )}
        </div>
    </main>
  );
}