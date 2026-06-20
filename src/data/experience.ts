import type { LocalizedText } from "@/content/projects";

/**
 * EDUCATION & EXPERIENCE timeline.
 * TODO (USER): replace with your real education, internships and roles.
 */

export interface TimelineItem {
  /** e.g. "2023 — present" */
  period: string;
  role: LocalizedText;
  organization: LocalizedText;
  description: LocalizedText;
}

export const experience: TimelineItem[] = [
  {
    period: "2023 — actualidad / present",
    role: {
      es: "Doble Grado en Ingeniería Informática y Matemáticas",
      en: "Double Degree in Computer Science Engineering & Mathematics",
    },
    organization: {
      es: "Universidad de Oviedo — EPI Gijón",
      en: "University of Oviedo — EPI Gijón",
    },
    description: {
      es: "Formación con doble base en ingeniería del software y matemáticas: algoritmos, estructuras de datos, análisis, álgebra y probabilidad. TODO: añade asignaturas relevantes y logros.",
      en: "Training with a dual foundation in software engineering and mathematics: algorithms, data structures, analysis, algebra and probability. TODO: add relevant coursework and achievements.",
    },
  },
  {
    period: "TODO",
    role: {
      es: "Tu primera práctica o proyecto",
      en: "Your first internship or project",
    },
    organization: {
      es: "Empresa / Universidad",
      en: "Company / University",
    },
    description: {
      es: "TODO (USER): describe una experiencia real — prácticas, trabajo, proyecto académico destacado o voluntariado técnico.",
      en: "TODO (USER): describe a real experience — internship, job, notable academic project or technical volunteering.",
    },
  },
];
