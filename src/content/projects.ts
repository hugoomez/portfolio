/**
 * PROJECT DATA — the core of the portfolio.
 *
 * Adding a project = editing this one file. Each entry is fully type-checked and
 * bilingual ({ es, en }). The detail page at /projects/[slug] is generated from
 * the `slug`. See CONTENT_GUIDE.md for field-by-field instructions and image sizes.
 *
 * The three entries below are PLACEHOLDERS marked with TODO. Replace them with
 * your real repositories — do not ship the placeholders. Aim for 3–5 strong,
 * deeply-documented case studies (quality over quantity).
 */

export interface LocalizedText {
  es: string;
  en: string;
}

export interface Project {
  /** URL-safe id, used as the route /projects/<slug>. */
  slug: string;
  title: LocalizedText;
  /** One-line summary shown on cards. */
  summary: LocalizedText;
  /** Longer case-study body (a paragraph or two). */
  description: LocalizedText;
  /** Case study: what problem did this solve? */
  problem?: LocalizedText;
  /** Case study: how did you solve it (approach, key challenge)? */
  solution?: LocalizedText;
  /** Technologies used, with context where helpful (e.g. "React"). */
  tech: string[];
  repoUrl?: string;
  demoUrl?: string;
  /**
   * Screenshot path under /public, e.g. "/images/projects/<slug>.webp".
   * Omit to show a generated gradient cover (recommended until you have a real
   * screenshot — avoids broken images).
   */
  image?: string;
  featured?: boolean;
  /** ISO date (YYYY-MM-DD) — used for ordering. */
  date: string;
}

export const projects: Project[] = [
  // TODO (USER): replace this placeholder with your real project.
  {
    slug: "placeholder-data-pipeline",
    title: {
      es: "Pipeline de datos (placeholder)",
      en: "Data pipeline (placeholder)",
    },
    summary: {
      es: "Ejemplo de proyecto: sustituye este texto por un caso real de tu GitHub.",
      en: "Example project: replace this with a real case study from your GitHub.",
    },
    description: {
      es: "Este es un proyecto de ejemplo para que veas el formato de caso de estudio. Describe aquí el contexto, tu rol y el impacto. Bórralo y añade tus proyectos reales editando src/content/projects.ts.",
      en: "This is a sample project so you can see the case-study format. Describe the context, your role and the impact here. Delete it and add your real projects by editing src/content/projects.ts.",
    },
    problem: {
      es: "Describe el problema concreto que resolviste y por qué importaba.",
      en: "Describe the concrete problem you solved and why it mattered.",
    },
    solution: {
      es: "Explica tu enfoque, el reto técnico principal y cómo lo resolviste. Incluye resultados o métricas si los tienes.",
      en: "Explain your approach, the key technical challenge and how you solved it. Include results or metrics if you have them.",
    },
    tech: ["TypeScript", "Node.js", "PostgreSQL"],
    repoUrl: "https://github.com/tu-usuario/tu-repo",
    demoUrl: undefined,
    featured: true,
    date: "2026-01-15",
  },
  // TODO (USER): replace this placeholder with your real project.
  {
    slug: "placeholder-web-app",
    title: {
      es: "Aplicación web (placeholder)",
      en: "Web app (placeholder)",
    },
    summary: {
      es: "Ejemplo de proyecto: aplicación full-stack. Sustitúyelo por uno real.",
      en: "Example project: a full-stack app. Replace it with a real one.",
    },
    description: {
      es: "Otro ejemplo de caso de estudio. Recuerda enlazar el repositorio y, si es posible, una demo en vivo: los reclutadores valoran mucho poder probar el proyecto.",
      en: "Another sample case study. Remember to link the repository and, if possible, a live demo: recruiters greatly value being able to try the project.",
    },
    problem: {
      es: "¿Qué necesidad cubría la aplicación?",
      en: "What need did the app address?",
    },
    solution: {
      es: "Arquitectura, decisiones de diseño y resultado final.",
      en: "Architecture, design decisions and final result.",
    },
    tech: ["React", "Next.js", "Tailwind CSS"],
    repoUrl: "https://github.com/tu-usuario/tu-repo",
    demoUrl: "https://tu-demo.vercel.app",
    featured: true,
    date: "2025-11-02",
  },
  // TODO (USER): replace this placeholder with your real project.
  {
    slug: "placeholder-algorithm",
    title: {
      es: "Proyecto algorítmico (placeholder)",
      en: "Algorithmic project (placeholder)",
    },
    summary: {
      es: "Ejemplo: un proyecto donde las matemáticas se encuentran con el código.",
      en: "Example: a project where mathematics meets code.",
    },
    description: {
      es: "Un buen sitio para mostrar tu perfil CS + Matemáticas: optimización, grafos, criptografía, simulación numérica… Explica el fundamento matemático y la implementación.",
      en: "A great place to show your CS + Mathematics profile: optimisation, graphs, cryptography, numerical simulation… Explain the mathematical foundation and the implementation.",
    },
    problem: {
      es: "El problema formal y sus restricciones.",
      en: "The formal problem and its constraints.",
    },
    solution: {
      es: "El algoritmo elegido, su complejidad y por qué es el adecuado.",
      en: "The chosen algorithm, its complexity and why it fits.",
    },
    tech: ["Python", "NumPy", "Matplotlib"],
    repoUrl: "https://github.com/tu-usuario/tu-repo",
    featured: false,
    date: "2025-09-20",
  },
];

export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
