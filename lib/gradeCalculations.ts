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