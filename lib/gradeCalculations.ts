export function calculateWeightedAverage(
  grades: Record<string, number>,
  evaluations: { id: string; weight: number | null }[]
) {
  let total = 0;
  let weightUsed = 0;

  evaluations.forEach((ev) => {
    const grade = grades[ev.id];

    if (grade !== undefined && ev.weight !== null) {
      total += grade * ev.weight;
      weightUsed += ev.weight;
    }
  });

  return {
    average: weightUsed > 0 ? total / weightUsed : 0,
    weightUsed,
  };
}

export function calculateDiscretas(grades: Record<string, number>) {
  const { i1, i2, c1, c2, exam } = grades;

  if (
    i1 === undefined ||
    i2 === undefined ||
    c1 === undefined ||
    c2 === undefined ||
    exam === undefined
  ) {
    return null;
  }

  const controlsAvg = (c1 + c2) / 2;

  const values = [i1, i2, controlsAvg, exam, exam];

  values.sort((a, b) => b - a); // mayor a menor

  const top3 = values.slice(0, 3);

  const final = top3.reduce((sum, v) => sum + v, 0) / 3;

  return final;
}

export function calculateExamReplacesLowestTest(
  grades: Record<string, number>
) {
  const { i1, i2, exam, t1, t2, t3 } = grades;

  if (
    i1 === undefined ||
    i2 === undefined ||
    exam === undefined ||
    t1 === undefined ||
    t2 === undefined ||
    t3 === undefined
  ) {
    return null;
  }

  const nt = Math.round(((t1 + t2 + t3) / 3) * 10) / 10;

  const lowestTest = Math.min(i1, i2);
  const effectiveI1I2Sum = i1 + i2 - lowestTest + Math.max(lowestTest, exam);

  const np = Math.round(((effectiveI1I2Sum + exam) / 3) * 10) / 10;

  const formulaGrade = 0.25 * nt + 0.75 * np;

  const finalGrade =
    nt >= 4.0 && np >= 4.0 ? formulaGrade : Math.min(formulaGrade, 3.9);

  return {
    nt,
    np,
    finalGrade,
    passes: finalGrade >= 4.0 && nt >= 4.0 && np >= 4.0,
  };
}

export function calculateTheoryProjectWithProjectGate(
  grades: Record<string, number>
) {
  const { i1, i2, exam, e1, e2, e3, attendance, projectTest } = grades;

  const theoryEvaluations = [
    { id: "i1", value: i1, weight: 1 },
    { id: "i2", value: i2, weight: 1 },
    { id: "exam", value: exam, weight: 1.5 },
  ];

  const completedTheory = theoryEvaluations.filter(
    (ev) => ev.value !== undefined
  );

  const missingTheory = theoryEvaluations.filter(
    (ev) => ev.value === undefined
  );

  const theoryPoints = completedTheory.reduce(
    (sum, ev) => sum + ev.value! * ev.weight,
    0
  );

  const theoryWeightCompleted = completedTheory.reduce(
    (sum, ev) => sum + ev.weight,
    0
  );

  const theoryWeightMissing = missingTheory.reduce(
    (sum, ev) => sum + ev.weight,
    0
  );

  const currentC =
    theoryWeightCompleted > 0 ? theoryPoints / theoryWeightCompleted : 0;

  const neededTheoryAverageForMinimum =
    theoryWeightMissing > 0
      ? (3.9 * 3.5 - theoryPoints) / theoryWeightMissing
      : null;

  const projectPoints = (e1 ?? 0) + (e2 ?? 0) + (e3 ?? 0);

  const missingProjectParts = [e1, e2, e3].filter(
    (value) => value === undefined
  ).length;

  const isComplete =
    i1 !== undefined &&
    i2 !== undefined &&
    exam !== undefined &&
    e1 !== undefined &&
    e2 !== undefined &&
    e3 !== undefined &&
    attendance !== undefined &&
    projectTest !== undefined;

  let finalGrade: number | null = null;
  let passes = false;
  let p: number | null = null;
  let attendanceFactor: number | null = null;

  if (isComplete) {
    const c = (i1 + i2 + 1.5 * exam) / 3.5;

    attendanceFactor = 0.7;

    if (attendance >= 100) attendanceFactor = 1.05;
    else if (attendance >= 70) attendanceFactor = 1.0;
    else if (attendance >= 60) attendanceFactor = 0.9;
    else if (attendance >= 50) attendanceFactor = 0.8;

    const weightedProjectPoints = projectPoints * attendanceFactor;

    p =
      projectTest >= 60
        ? (Math.min(weightedProjectPoints, 100) / 100) * 6 + 1
        : 1;

    const rawFinalGrade =
      projectTest >= 60 ? 0.5 * c + 0.5 * p : Math.min(c, 3.89);

    passes = rawFinalGrade >= 4.0 && c >= 3.9 && p >= 3.9 && projectTest >= 60;

    finalGrade = passes ? rawFinalGrade : Math.min(rawFinalGrade, 3.9);
  }

  return {
    currentC,
    neededTheoryAverageForMinimum,
    projectPoints,
    missingProjectParts,
    isComplete,
    finalGrade,
    passes,
    p,
    attendanceFactor,
  };
}
