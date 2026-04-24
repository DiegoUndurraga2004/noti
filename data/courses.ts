export const courses = [
  {
    id: "probabilidades-estadistica-2026-1",
    code: "EYP1113",
    name: "Probabilidades y Estadística",
    semester: "2026-1",
    passingGrade: 3.95,
    formulaDescription:
      "NF = 80% PI + 20% PL. PI es el promedio de 4 interrogaciones. PL es el promedio de 2 talleres de R, con posible bonificación.",
    evaluations: [
      { id: "i1", name: "Interrogación 1", weight: 20 },
      { id: "i2", name: "Interrogación 2", weight: 20 },
      { id: "i3", name: "Interrogación 3", weight: 20 },
      { id: "i4", name: "Interrogación 4", weight: 20 },
      { id: "r1", name: "Taller R 1", weight: 10 },
      { id: "r2", name: "Taller R 2", weight: 10 },
    ],
  },
  {
    id: "matematicas-discretas-2026-1",
    code: "IIC1253",
    name: "Matemáticas Discretas",
    semester: "2026-1",
    passingGrade: 3.95,
    formulaDescription:
      "NF = promedio de las 3 mejores notas entre I1, I2, promedio de controles, examen y examen.",
    evaluations: [
      { id: "i1", name: "Interrogación 1", weight: null },
      { id: "i2", name: "Interrogación 2", weight: null },
      { id: "c1", name: "Control 1", weight: null },
      { id: "c2", name: "Control 2", weight: null },
      { id: "exam", name: "Examen", weight: null },
    ],
    specialRule: "AVG3_TOP_WITH_EXAM_DUPLICATED",
  },
  {
    id: "electricidad-magnetismo-2026-1",
    code: "FIS1533",
    name: "Electricidad y Magnetismo",
    semester: "2026-1",
    passingGrade: 4.0,
    formulaDescription:
      "NFC = 30% I1 + 30% I2 + 30% Examen + 10% Controles. Si NL >= 4.0 y NFC >= 4.0, NF = 70% NFC + 30% NL. Si no, NF = min(NFC, NL).",
    evaluations: [
      { id: "i1", name: "Interrogación 1", weight: 21 },
      { id: "i2", name: "Interrogación 2", weight: 21 },
      { id: "exam", name: "Examen", weight: 21 },
      { id: "controls", name: "Promedio controles", weight: 7 },
      { id: "lab", name: "Nota laboratorio", weight: 30 },
    ],
    specialRule: "FIS1533_CATEDRA_LAB_MINIMUM",
  },
];