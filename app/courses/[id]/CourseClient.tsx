"use client";

import type { Course } from "@/data/courses";
import { calculateCourseResult } from "@/lib/gradeCalculations";
import { useEffect, useState } from "react";

export default function CourseClient({ course }: { course: Course }) {
  const [grades, setGrades] = useState<Record<string, number>>({});
  const [hasLoadedGrades, setHasLoadedGrades] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`grades-${course.id}`);

    if (saved) {
      setGrades(JSON.parse(saved));
    }

    setHasLoadedGrades(true);
  }, [course.id]);

  useEffect(() => {
    if (!hasLoadedGrades) return;

    localStorage.setItem(`grades-${course.id}`, JSON.stringify(grades));
  }, [grades, course.id, hasLoadedGrades]);

  const handleChange = (
    evaluation: Course["evaluations"][number],
    value: string
  ) => {
    if (value === "") {
      setGrades((prev) => {
        const updated = { ...prev };
        delete updated[evaluation.id];
        return updated;
      });
      return;
    }

    if (value.includes(",")) return;

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) return;

    const min =
      evaluation.min ?? (evaluation.inputType === "grade" ? 1 : undefined);
    const max =
      evaluation.max ?? (evaluation.inputType === "grade" ? 7 : undefined);

    if (min !== undefined && numericValue < min) return;
    if (max !== undefined && numericValue > max) return;

    setGrades((prev) => ({
      ...prev,
      [evaluation.id]: numericValue,
    }));
  };

  const clearGrades = () => {
    setGrades({});
    localStorage.removeItem(`grades-${course.id}`);
  };

  const result = calculateCourseResult(course, grades);

  const truncate = (value: number, decimals: number = 2) => {
    const factor = 10 ** decimals;
    return (Math.trunc(value * factor) / factor).toFixed(decimals);
  };

  const roundUpGrade = (value: number) => {
    return Math.ceil(value * 10) / 10;
  };

  const formatNeededGrade = (value: number) => {
    return roundUpGrade(Math.max(value, 1)).toFixed(1);
  };

  const formatDetailValue = (value: number | string, decimals: number = 2) => {
    if (typeof value === "string") return value;
    return truncate(value, decimals);
  };

  const blockedNumberKeys = ["e", "E", "+", "-", ","];

  const getPlaceholder = (evaluation: Course["evaluations"][number]) => {
    if (evaluation.inputType === "grade") return "4.0";
    if (evaluation.inputType === "percent") return "70";
    if (evaluation.inputType === "points") return "0";

    return "4.0";
  };

  const getAlertClass = (type: "success" | "warning" | "danger") => {
    if (type === "success") {
      return "rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-green-300";
    }

    if (type === "danger") {
      return "rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-300";
    }

    return "rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-yellow-300";
  };

  const formatNeededLabel = (label: string) => {
    if (label.includes("Nota necesaria en cada evaluación restante")) {
      return "Necesitas en cada evaluación restante";
    }

    if (label.startsWith("Promedio necesario en lo restante de")) {
      return label
        .replace(
          "Promedio necesario en lo restante de ",
          "Necesitas promedio en lo que falta de "
        )
        .replace(" para llegar al mínimo", "");
    }

    if (label.startsWith("Nota mínima necesaria en")) {
      return label.replace("Nota mínima necesaria en", "Necesitas al menos en");
    }

    return label;
  };

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="text-2xl font-bold mb-2">
        {course.name} - {course.semester}
      </h1>

      <p className="text-slate-400 mb-6">{course.code}</p>

      <p className="text-slate-300 mb-6">{course.formulaDescription}</p>

      <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-200">
        <p className="font-semibold">Importante</p>
        <p>
          Noti es una herramienta de apoyo para estimar tus notas. Es
          responsabilidad de cada estudiante corroborar los cálculos con el
          programa oficial del curso y las reglas informadas por el equipo
          docente.
        </p>
      </div>

      <button
        type="button"
        onClick={clearGrades}
        className="mb-6 rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
      >
        Limpiar notas
      </button>

      <div className="space-y-4">
        {course.evaluations.map((ev) => (
          <div
            key={ev.id}
            className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-700"
          >
            <div>
              <p className="font-medium">{ev.name}</p>
              {ev.unit && <p className="text-sm text-slate-400">{ev.unit}</p>}
            </div>

            <input
              type="number"
              min={ev.min}
              max={ev.max}
              step={ev.step ?? 0.1}
              value={grades[ev.id] ?? ""}
              className="w-24 p-2 rounded bg-slate-800 text-white border border-slate-600"
              placeholder={getPlaceholder(ev)}
              onKeyDown={(e) => {
                if (blockedNumberKeys.includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => handleChange(ev, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-5 space-y-4">
        <div>
          <p className="text-xl font-bold">Resultado</p>
          <p className="text-sm text-slate-400">
            Los valores se actualizan automáticamente al ingresar tus notas.
          </p>
        </div>

        {result.alerts && result.alerts.length > 0 && (
          <div className="space-y-2">
            {result.alerts.map((alert) => (
              <p key={alert.message} className={getAlertClass(alert.type)}>
                {alert.message}
              </p>
            ))}
          </div>
        )}

        {result.details.length > 0 && (
          <div className="space-y-2">
            {result.details.map((detail) => (
              <div
                key={`${detail.label}-${String(detail.value)}`}
                className="flex justify-between gap-4 border-b border-slate-800 pb-2 last:border-b-0"
              >
                <span className="text-slate-300">{detail.label}</span>
                <span className="font-medium text-white">
                  {formatDetailValue(detail.value, detail.decimals)}
                </span>
              </div>
            ))}
          </div>
        )}

        {result.needed.length > 0 && (
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 space-y-2">
            <p className="font-semibold text-blue-300">Qué necesitas</p>

            {result.needed.map((needed) => (
              <div
                key={needed.label}
                className="flex justify-between gap-4 text-blue-100"
              >
                <span>{formatNeededLabel(needed.label)}</span>
                <span className="font-bold">
                  {formatNeededGrade(needed.value)}
                </span>
              </div>
            ))}
          </div>
        )}

        {!result.isComplete && (
          <p className="text-sm text-slate-400">{result.message}</p>
        )}

        {result.isComplete && result.finalGrade !== null && (
          <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Nota final estimada</p>
            <p className="text-2xl font-bold">
              {truncate(result.finalGrade)}{" "}
              {result.passed ? "✅ Aprobado" : "❌ Reprobado"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
