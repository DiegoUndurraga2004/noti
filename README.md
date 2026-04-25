# Noti

Web app para estudiantes universitarios que permite calcular promedios, entender ponderaciones de evaluación y saber qué notas necesitan para aprobar o eximirse de un ramo.

## Problema

Muchos estudiantes no tienen claridad sobre cuánto necesitan en sus próximas evaluaciones para aprobar un curso. Cuando los ramos tienen muchas notas, porcentajes, requisitos de eximición o reglas especiales, calcularlo manualmente se vuelve confuso y poco práctico.

## Solución

Noti permite seleccionar o agregar un ramo, ingresar las notas obtenidas y visualizar de forma simple:

- Promedio actual ponderado
- Nota necesaria en evaluaciones restantes
- Requisitos de aprobación
- Requisitos de eximición
- Estado del estudiante en el curso

Además, la app contempla una funcionalidad para subir el programa del curso en PDF y generar automáticamente una plantilla de cálculo usando IA.

## Funcionalidades principales

- Listado de ramos disponibles
- Vista individual por ramo
- Inputs para ingresar notas
- Cálculo automático de nota necesaria para aprobar
- Cálculo de nota necesaria para eximirse
- Subida de programa del curso en PDF
- Detección de cursos ya existentes
- Generación automática de estructura de evaluaciones con IA
- Herramienta de escala de notas

## Flujo principal

1. El usuario entra a la página principal.
2. Selecciona un ramo existente o agrega uno nuevo.
3. Si agrega un ramo, sube el programa del curso en PDF.
4. El sistema revisa si el curso ya existe.
5. Si existe, redirige al ramo correspondiente.
6. Si no existe, la IA genera una plantilla con evaluaciones, porcentajes y requisitos.
7. El usuario ingresa sus notas.
8. La app calcula qué necesita para aprobar o eximirse.

## Stack tecnológico

- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- OpenAI API
- PDF parser
- Vercel

## Estructura esperada

```txt
/
├── Página principal con listado de ramos
├── /courses/[id] Vista de cálculo por ramo
├── /add-course Subida de programa del curso
└── /grade-scale Herramienta de escala de notas
```
