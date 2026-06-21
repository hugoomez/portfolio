/**
 * PROJECT DATA — the core of the portfolio.
 *
 * Adding a project = editing this one file. Each entry is fully type-checked and
 * bilingual ({ es, en }). The detail page at /projects/[slug] is generated from
 * the `slug`. Aim for 3–5 strong, deeply-documented case studies.
 *
 * MEDIA: use `media` for a carousel (images, local videos, YouTube). If you only
 * have one image you can still use `image` for convenience — `media` takes precedence.
 *
 * AWARD: fill `award` if the project won or was a finalist somewhere.
 *
 * PRIVATE REPO: set `privateRepo: true` when the code is not public — a lock badge
 * replaces the GitHub link automatically.
 */

export interface LocalizedText {
  es: string;
  en: string;
}

/** A single item in the media carousel. */
export type MediaItem =
  | { type: "image"; src: string; alt?: LocalizedText }
  | { type: "video"; src: string; poster?: string }
  | { type: "youtube"; id: string };

export interface Award {
  /** Short recognition label, e.g. { es: "1er Premio", en: "1st Prize" }. */
  label: LocalizedText;
  /** Event / competition name, e.g. { es: "HackUPC 2025", en: "HackUPC 2025" }. */
  event?: LocalizedText;
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
  /** Single cover image path under /public. Ignored when `media` is set. */
  image?: string;
  /** Carousel: ordered list of images / videos / YouTube embeds. */
  media?: MediaItem[];
  /** Award or finalist recognition. */
  award?: Award;
  /** Set to true when the source code is not publicly accessible. */
  privateRepo?: boolean;
  featured?: boolean;
  /** ISO date (YYYY-MM-DD) — used for ordering. */
  date: string;
}

export const projects: Project[] = [
  {
    slug: "mcmt",
    title: {
      es: "MCMT — Seguimiento multi-cámara y multi-objetivo en tiempo real",
      en: "MCMT — Real-time multi-camera multi-target tracking",
    },
    summary: {
      es: "Motor de seguimiento de personas a través de cientos de cámaras (hasta 1.300 simultáneas), combinando un núcleo geométrico en C++ con una red de grafos para resolver los casos ambiguos.",
      en: "Person-tracking engine across hundreds of cameras (up to 1,300 simultaneously), combining a geometric C++ core with a graph neural network to resolve ambiguous cases.",
    },
    description: {
      es: "MCMT es una librería de seguimiento multi-cámara multi-objetivo diseñada para responder, en tiempo real y a gran escala, a la pregunta 'esta persona que veo en la cámara A, ¿es la misma que vi antes en la cámara B?'. El sistema sigue cada objeto dentro de una cámara con un filtro de Kalman extendido, fusiona esas pistas en identidades globales mediante una cascada de reglas geométricas y de apariencia, y solo recurre a una red neuronal de grafos para el pequeño porcentaje de casos que la geometría no puede resolver con confianza. Está construido como un híbrido Python/C++: Python orquesta la lógica de negocio y los patrones de diseño, mientras que C++ (con Eigen y nanobind) implementa los núcleos de cálculo intensivo, compartiendo memoria sin copias vía Apache Arrow. Toda la arquitectura está pensada para el Python 3.13 sin GIL (free-threaded), con estructuras lock-free y una jerarquía estricta de cerrojos para garantizar paralelismo real sin deadlocks.",
      en: "MCMT is a multi-camera multi-target tracking library designed to answer, in real time and at scale, the question 'is this person I see in camera A the same one I saw earlier in camera B?'. The system tracks each object within a single camera using an extended Kalman filter, fuses those local tracks into global identities through a cascade of geometric and appearance-based rules, and only falls back on a graph neural network for the small fraction of cases geometry can't resolve confidently. It's built as a Python/C++ hybrid: Python orchestrates business logic and design patterns, while C++ (via Eigen and nanobind) implements the performance-critical kernels, sharing memory with zero copies through Apache Arrow. The whole architecture targets free-threaded Python 3.13 (no-GIL), with lock-free data structures and a strict lock hierarchy to guarantee real parallelism without deadlocks.",
    },
    problem: {
      es: "En un recinto vigilado por muchas cámaras con campos de visión solapados, hay que decidir continuamente qué detección de una cámara corresponde a qué persona ya vista en otra, en condiciones difíciles: cada cámara solo da coordenadas 2D y hay que proyectarlas al mundo real en metros; la misma persona cambia de aspecto según el ángulo y la luz; los relojes de las cámaras no están perfectamente sincronizados; y todo debe resolverse en milisegundos para miles de detecciones por segundo a la escala de hasta 1.300 cámaras. Un error de asociación, además, puede contaminar para siempre la identidad visual de una persona si no se gestiona con cuidado.",
      en: "In a venue covered by many overlapping cameras, the system must continuously decide which detection from one camera corresponds to a person already seen in another, under tough constraints: each camera only provides 2D coordinates that must be projected into real-world metric space; the same person looks different depending on angle and lighting; camera clocks drift out of sync; and everything has to be resolved within milliseconds for thousands of detections per second at a scale of up to 1,300 cameras. A single bad association can also permanently corrupt a person's visual identity if not handled carefully.",
    },
    solution: {
      es: "Diseñé una arquitectura de dos niveles: un nivel geométrico ('Glance') que resuelve en torno al 99% de las asociaciones mediante una cascada de cinco compuertas de coste creciente —compatibilidad de campos de visión, proximidad en el suelo, distancia de Mahalanobis sobre la covarianza del filtro de Kalman, coherencia de velocidad y, por último, similitud de apariencia (Re-ID)— resuelta con el algoritmo húngaro. El 1% de casos ambiguos restantes se delega, fuera de la ruta crítica y en hilos de fondo, a una red neuronal de grafos (MPGNN) con atención y normalización Sinkhorn. Cada núcleo de cálculo crítico (filtro de Kalman, proyección 2D→3D, sincronización temporal lock-free, pool de embeddings con doble búfer, inferencia de la red de grafos) tiene una implementación en C++ y otra en NumPy puro, usada como respaldo automático y como referencia numérica validada en tests. El resultado es un sistema multihilo con cuatro responsabilidades concurrentes (ruta crítica, inferencia IA, ciclo de vida de identidades) coordinadas mediante doble búfer, colas acotadas y una jerarquía de cerrojos documentada que elimina los deadlocks por diseño. El sistema se validó sobre el dataset WILDTRACK con métricas MODA/MODP y un estudio de ablación que confirma la tesis de diseño: la geometría resuelve casi todo, y la red de grafos aporta una mejora medible sobre los casos difíciles sin penalizar la latencia en tiempo real.",
      en: "I designed a two-tier architecture: a geometric tier ('Glance') that resolves roughly 99% of associations through a five-gate cascade of increasing cost — camera field-of-view compatibility, ground-plane proximity, Mahalanobis distance over the Kalman filter's covariance, velocity coherence, and finally appearance similarity (Re-ID) — solved with the Hungarian algorithm. The remaining 1% of ambiguous cases is handed off, off the critical path and on background threads, to a graph neural network (MPGNN) with attention and Sinkhorn normalization. Every performance-critical kernel (Kalman filter, 2D→3D projection, lock-free temporal synchronization, double-buffered embedding pool, graph network inference) has both a C++ implementation and a pure-NumPy one, used as an automatic fallback and as a numerically validated reference in tests. The result is a multi-threaded system with four concurrent responsibilities (critical path, AI inference, identity lifecycle) coordinated through double buffering, bounded queues, and a documented lock hierarchy that eliminates deadlocks by design. The system was validated on the WILDTRACK dataset with MODA/MODP metrics and an ablation study confirming the core design thesis: geometry resolves almost everything, and the graph network delivers a measurable improvement on the hard cases without compromising real-time latency.",
    },
    tech: [
      "Python 3.13 (free-threaded)",
      "C++20",
      "nanobind",
      "Apache Arrow",
      "Eigen",
      "NumPy",
      "ONNX Runtime",
      "FAISS",
      "Pydantic",
      "scikit-build-core / CMake",
      "PyTorch (entrenamiento)",
      "SQLite",
    ],
    // repoUrl: "https://github.com/hugoomez/mcmt", // descomenta y ajusta si el repo es público
    // demoUrl: "https://tu-demo.vercel.app",
    media: [
      { type: "video", src: "/images/projects/mcmt-demo.mp4" },
      { type: "image", src: "/images/projects/mcmt-1.svg", alt: { es: "Arquitectura de MCMT", en: "MCMT architecture" } },
    ],
    award: {
      label: { es: "1er Premio", en: "1st Prize" },
      event: { es: "Concurso de Ideas de Inteligencia Artificial para ATM, Indra", en: "AI Ideas Competition for ATM, Indra" },
    },
    privateRepo: true,
    featured: true,
    date: "2026-01-15",
  },
  // TODO: reemplaza este placeholder con tu proyecto real.
  // Este ejemplo muestra cómo usar el badge de premio + repo privado.
  {
    slug: "placeholder-web-app",
    title: {
      es: "Aplicación web (placeholder)",
      en: "Web app (placeholder)",
    },
    summary: {
      es: "Sustituye este texto por una frase corta que describa tu proyecto.",
      en: "Replace this with a short sentence describing your project.",
    },
    description: {
      es: "Describe aquí el contexto, tu rol y el impacto. Enlaza el repositorio y, si es posible, una demo en vivo.",
      en: "Describe the context, your role and the impact here. Link the repository and, if possible, a live demo.",
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
    repoUrl: "https://github.com/hugoomez/tu-repo",
    demoUrl: "https://tu-demo.vercel.app",
    // IMAGEN SIMPLE: usa `image` si solo tienes una captura y no necesitas carrusel.
    // image: "/images/projects/placeholder-web-app.webp",
    // PREMIO: descomenta y edita si el proyecto ganó algo.
    award: {
      label: { es: "Finalista", en: "Finalist" },
      event: { es: "Nombre del hackathon o concurso", en: "Hackathon or competition name" },
    },
    // REPO PRIVADO: descomenta si el código no es público.
    // privateRepo: true,
    featured: true,
    date: "2025-11-02",
  },
  // TODO: reemplaza este placeholder con tu proyecto real.
  // Este ejemplo muestra un proyecto con repositorio privado.
  {
    slug: "placeholder-algorithm",
    title: {
      es: "Proyecto algorítmico (placeholder)",
      en: "Algorithmic project (placeholder)",
    },
    summary: {
      es: "Sustituye este texto. Ideal para proyectos donde las matemáticas se encuentran con el código.",
      en: "Replace this. Great for projects where mathematics meets code.",
    },
    description: {
      es: "Perfecto para mostrar tu perfil CS + Matemáticas: optimización, grafos, criptografía, simulación numérica… Explica el fundamento matemático y la implementación.",
      en: "Great to showcase your CS + Mathematics profile: optimisation, graphs, cryptography, numerical simulation… Explain the mathematical foundation and the implementation.",
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
    // REPO PRIVADO activo: el botón de GitHub se sustituye por un candado.
    privateRepo: true,
    // repoUrl: "https://github.com/hugoomez/tu-repo",  // ignorado si privateRepo: true
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
