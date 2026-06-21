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
    period: "2024 — actualidad / present",
    role: {
      es: "Doble Grado en Ingeniería Informática y Matemáticas",
      en: "Double Degree in Computer Science Engineering & Mathematics",
    },
    organization: {
      es: "Universidad de Oviedo",
      en: "University of Oviedo",
    },
    description: {
      es: "Doble formación en informática y matemáticas con énfasis en algoritmia, estructuras de datos, programación de sistemas, álgebra lineal, análisis matemático, probabilidad y estadística. Interés especial en machine learning, optimización y computación científica. Expediente académico destacado con cinco Matrículas de Honor obtenidas durante los estudios.",

      en: "Dual training in Computer Science and Mathematics with a strong foundation in algorithms, data structures, systems programming, linear algebra, mathematical analysis, probability and statistics. Particularly interested in machine learning, optimization, and scientific computing. Strong academic record, earning five Honors Distinctions throughout the degree."
    },
  },
  {
    period: "2026",

    role: {
      es: "Microcredencial Universitaria en Computación Cuántica",
      en: "University Microcredential in Quantum Computing",
    },

    organization: {
      es: "Universidad de Oviedo",
      en: "University of Oviedo",
    },

    description: {
      es: "Programa especializado en fundamentos de computación cuántica, algoritmos cuánticos y sus aplicaciones emergentes. Durante la formación profundicé en áreas como la optimización cuántica y el Quantum Machine Learning (QML), explorando el potencial de los modelos híbridos cuántico-clásicos para problemas de optimización y aprendizaje automático. Esta experiencia reforzó mi interés por la intersección entre matemáticas, inteligencia artificial y tecnologías cuánticas.",

      en: "Specialized program covering the fundamentals of quantum computing, quantum algorithms, and emerging applications. The coursework included quantum optimization and Quantum Machine Learning (QML), exploring the potential of hybrid quantum-classical models for optimization and machine learning tasks. This experience strengthened my interest in the intersection of mathematics, artificial intelligence, and quantum technologies.",
    }
    ,
  },
];
