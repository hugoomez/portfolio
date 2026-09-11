/** Education & experience timeline. */

export interface TimelineItem {
  /** e.g. "2023 — present" */
  period: string;
  role: string;
  organization: string;
  description: string;
}

export const experience: TimelineItem[] = [
  {
    period: "2024 — present",
    role: "Double Degree in Computer Science Engineering & Mathematics",
    organization: "University of Oviedo",
    description:
      "Dual training in Computer Science and Mathematics with a strong foundation in algorithms, data structures, systems programming, linear algebra, mathematical analysis, probability and statistics. Particularly interested in machine learning, optimization, and scientific computing. Strong academic record, earning five Honors Distinctions throughout the degree.",
  },
  {
    period: "2026",
    role: "University Microcredential in Quantum Computing",
    organization: "University of Oviedo",
    description:
      "Specialized program covering the fundamentals of quantum computing, quantum algorithms, and emerging applications. The coursework included quantum optimization and Quantum Machine Learning (QML), exploring the potential of hybrid quantum-classical models for optimization and machine learning tasks. This experience strengthened my interest in the intersection of mathematics, artificial intelligence, and quantum technologies.",
  },
];
