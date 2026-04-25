"use client";
import {
  calculateWeightedAverage,
  calculateDiscretas,
  calculateExamReplacesLowestTest,
  calculateTheoryProjectWithProjectGate,
} from "@/lib/gradeCalculations";
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
    if (value === "") {
      setGrades((prev) => {
        const updated = { ...prev };
        delete updated[evaluationId];
        return updated;
      });
      return;
    }

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

  const examReplacesLowestResult =
    course.specialRule === "EXAM_REPLACES_LOWEST_TEST"
      ? calculateExamReplacesLowestTest(grades)
      : null;

  const theoryProjectResult =
    course.specialRule === "THEORY_PROJECT_WITH_PROJECT_GATE"
      ? calculateTheoryProjectWithProjectGate(grades)
      : null;

  const truncate = (value: number, decimals: number = 2) => {
    const factor = 10 ** decimals;
    return (Math.trunc(value * factor) / factor).toFixed(decimals);
  };

  const roundUpGrade = (value: number) => {
    return Math.ceil(value * 10) / 10;
  };

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
              Nota final estimada: {truncate(finalGrade)}{" "}
              {finalGrade >= course.passingGrade
                ? "✅ Aprobado"
                : "❌ Reprobado"}
            </p>
          ) : (
            <p>Ingresa todas las notas para calcular</p>
          )
        ) : course.specialRule === "EXAM_REPLACES_LOWEST_TEST" ? (
          examReplacesLowestResult !== null ? (
            <>
              <p>
                Promedio tareas NT: {truncate(examReplacesLowestResult.nt, 1)}
              </p>
              <p>
                Promedio pruebas NP: {truncate(examReplacesLowestResult.np, 1)}
              </p>
              <p>
                Nota final estimada:{" "}
                {truncate(examReplacesLowestResult.finalGrade)}{" "}
                {examReplacesLowestResult.passes
                  ? "✅ Aprobado"
                  : "❌ Reprobado"}
              </p>
            </>
          ) : (
            <p>Ingresa todas las notas para calcular</p>
          )
        ) : course.specialRule === "THEORY_PROJECT_WITH_PROJECT_GATE" ? (
          theoryProjectResult !== null ? (
            <>
              <p>
                Promedio actual cátedra C:{" "}
                {truncate(theoryProjectResult.currentC)}
              </p>

              {theoryProjectResult.neededTheoryAverageForMinimum !== null && (
                <p>
                  Necesitas promedio{" "}
                  {roundUpGrade(theoryProjectResult.neededTheoryAverageForMinimum).toFixed(1)}{" "}
                  en las evaluaciones de cátedra restantes para llegar al mínimo
                  de cátedra.
                </p>
              )}

              <p>
                Puntaje proyecto actual:{" "}
                {truncate(theoryProjectResult.projectPoints, 1)} / 100
              </p>

              <p>
                Partes del proyecto faltantes:{" "}
                {theoryProjectResult.missingProjectParts}
              </p>

              {!theoryProjectResult.isComplete && (
                <p className="text-slate-400">
                  Faltan notas para estimar la nota final completa.
                </p>
              )}

              {theoryProjectResult.isComplete &&
                theoryProjectResult.finalGrade !== null && (
                  <p>
                    Nota final estimada:{" "}
                    {truncate(theoryProjectResult.finalGrade)}{" "}
                    {theoryProjectResult.passes
                      ? "✅ Aprobado"
                      : "❌ Reprobado"}
                  </p>
                )}
            </>
          ) : (
            <p>Ingresa alguna nota para calcular</p>
          )
        ) : (
          <>
            <p>Promedio actual: {truncate(average)}</p>
            <p>Ponderación completada: {weightUsed}%</p>

            {remainingWeight > 0 && (
              <p>
                Necesitas promedio {roundUpGrade(neededAverage).toFixed(1)} en lo restante para
                aprobar
              </p>
            )}

            {remainingWeight === 0 && (
              <p>
                Nota final: {truncate(average)}{" "}
                {average >= course.passingGrade
                  ? "✅ Aprobado"
                  : "❌ Reprobado"}
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
