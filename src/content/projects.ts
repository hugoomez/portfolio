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
      { type: "image", src: "/images/projects/mcmt.png" },
      { type: "video", src: "/images/projects/mcmt-demo.mp4" },
      { type: "image", src: "/images/projects/mcmt-1.svg", alt: { es: "Arquitectura de MCMT", en: "MCMT architecture" } },
    ],
    award: {
      label: { es: "1er Premio", en: "1st Prize" },
      event: { es: "Concurso de Ideas de Inteligencia Artificial para ATM, Indra", en: "AI Ideas Competition for ATM, Indra" },
    },
    privateRepo: true,
    featured: true,
    date: "2025-07-05",
  },
  {
    slug: "operacion-picos-de-europa",
    title: {
      es: "Operación Picos de Europa — Pipeline de interoperabilidad de imagen médica",
      en: "Operación Picos de Europa — Medical imaging interoperability pipeline",
    },
    summary: {
      es: "Pipeline que conecta las APIs reales de Idonia y Recog para resolver la falta de portabilidad de estudios DICOM entre comunidades autónomas y entregar a los pacientes un informe humanizado por LLM, bloqueado por un cinturón de validación cuantitativo de cuatro capas si omite hallazgos o atenúa su gravedad.",
      en: "Pipeline connecting the real Idonia and Recog APIs to solve DICOM study portability across Spanish regions and deliver LLM-humanized reports to patients, blocked by a four-layer quantitative safety belt if findings are omitted or their clinical severity downplayed.",
    },
    description: {
      es: "Operación Picos de Europa es un pipeline de interoperabilidad de imagen médica desarrollado para el hackathon IABiomed 2026 (reto Idonia × Recog). Conecta dos APIs reales del sector sanitario español para resolver dos problemas regulados por ley: la falta de portabilidad de estudios DICOM entre comunidades autónomas y la incomprensibilidad de los informes radiológicos para los pacientes (Ley 41/2002). El sistema ingiere el estudio y el informe técnico en Idonia, humaniza el informe con el LLM de Recog y entrega el resultado por Magic Link. Antes de entregarlo, lo valida con un cinturón cuantitativo de cuatro capas —legibilidad INFLESZ, checklist clínico, NER biomédico y un juez semántico basado en LLM— que bloquea la reinyección si la humanización omite hallazgos o atenúa su gravedad clínica. El backend está implementado en Python con FastAPI y Pydantic, con una arquitectura de clientes intercambiables stub/live que permite ejecutar el pipeline completo sin acceso a las APIs de producción. La autenticación JWT de la API de Idonia, no documentada, se resolvió mediante ingeniería inversa. Cada decisión de diseño del cinturón de validación está fundamentada en literatura científica reciente sobre fidelidad factual en simplificación clínica con LLMs.",
      en: "Operación Picos de Europa is a medical imaging interoperability pipeline developed for the IABiomed 2026 hackathon (Idonia × Recog challenge). It connects two real Spanish healthcare APIs to solve two legally regulated problems: the lack of DICOM study portability across autonomous communities, and the incomprehensibility of radiological reports for patients (Law 41/2002). The system ingests the study and technical report in Idonia, humanizes the report using Recog's LLM, and delivers the result via Magic Link. Before delivery, it validates the output with a four-layer quantitative safety belt — INFLESZ readability, clinical checklist, biomedical NER, and an LLM-based semantic judge — that blocks re-injection if the humanization omits findings or downplays their clinical severity. The backend is implemented in Python with FastAPI and Pydantic, using a stub/live swappable client architecture that allows running the full pipeline without access to production APIs. The undocumented JWT authentication for the Idonia API was resolved through reverse engineering. Every design decision in the validation belt is grounded in recent scientific literature on factual fidelity in clinical text simplification with LLMs.",
    },
    problem: {
      es: "En España, los estudios DICOM no son portables entre comunidades autónomas: un paciente que se hace una prueba en Asturias no puede compartir ese estudio fácilmente con un médico en Madrid. A esto se suma que los informes radiológicos están escritos en lenguaje técnico inasequible para la mayoría de los pacientes, pese a que la Ley 41/2002 les reconoce el derecho a recibir información comprensible sobre su salud. Humanizar estos informes con un LLM introduce además un riesgo clínico real: el modelo puede omitir hallazgos críticos o atenuar su gravedad sin que el usuario lo detecte.",
      en: "In Spain, DICOM studies are not portable across autonomous communities: a patient who has a scan in Asturias cannot easily share that study with a doctor in Madrid. On top of this, radiological reports are written in technical language that is inaccessible to most patients, despite Law 41/2002 granting them the right to receive comprehensible health information. Humanizing these reports with an LLM also introduces a real clinical risk: the model may omit critical findings or downplay their severity without the user noticing.",
    },
    solution: {
      es: "Diseñé un pipeline que ingiere el estudio DICOM y el informe técnico desde la API de Idonia, invoca el LLM de Recog para producir una versión humanizada en lenguaje de paciente, y antes de entregarla la somete a un cinturón de validación de cuatro capas: (1) puntuación INFLESZ para garantizar legibilidad real, (2) checklist clínico que verifica la presencia de los apartados obligatorios, (3) NER biomédico que cruza las entidades clínicas del original con las del resumen para detectar omisiones, y (4) un juez semántico basado en LLM que evalúa si la gravedad clínica se ha preservado fielmente. El pipeline solo entrega el informe humanizado si supera los cuatro umbrales; en caso contrario, bloquea y registra el fallo para revisión. La arquitectura de clientes intercambiables (stub en tests, live en producción) y la autenticación JWT resuelta por ingeniería inversa permitieron integrar las dos APIs reales en el tiempo del hackathon.",
      en: "I designed a pipeline that ingests the DICOM study and technical report from the Idonia API, invokes Recog's LLM to produce a patient-language humanized version, and before delivery subjects it to a four-layer validation belt: (1) INFLESZ score to guarantee real readability, (2) clinical checklist verifying the presence of required sections, (3) biomedical NER that cross-references clinical entities in the original and the summary to detect omissions, and (4) an LLM-based semantic judge that evaluates whether clinical severity has been faithfully preserved. The pipeline only delivers the humanized report if it passes all four thresholds; otherwise it blocks and logs the failure for review. The swappable stub/live client architecture and the JWT authentication resolved through reverse engineering allowed integrating both real APIs within the hackathon timeframe.",
    },
    tech: ["Python", "FastAPI", "Pydantic", "DICOM", "Idonia API", "Recog API", "Biomedical NER", "INFLESZ", "JWT"],
    image: "/images/projects/picos-cover.png",
    privateRepo: true,
    featured: true,
    date: "2026-06-01",
  },
  {
    slug: "biofit",
    title: {
      es: "BioFit — Ecosistema de salud integral impulsado por IA",
      en: "BioFit — AI-powered integral health ecosystem",
    },
    summary: {
      es: "Coach de IA que analiza tu técnica en tiempo real mediante visión por computador, diseña rutinas personalizadas y hace el seguimiento de tu nutrición y progreso.",
      en: "AI coach that analyses your exercise technique in real time using computer vision, designs personalised routines, and tracks your nutrition and progress.",
    },
    description: {
      es: "BioFit va más allá de una app de gimnasio: es un ecosistema de salud donde la inteligencia artificial actúa como entrenador personal disponible en cualquier momento. El núcleo del sistema es un motor de visión por computador construido sobre MediaPipe que analiza la postura frame a frame, detecta errores de técnica y emite correcciones antes de que el usuario termine la repetición. Alrededor de ese motor se articula un asistente de IA que gestiona la nutrición (registro de ingesta, objetivos calóricos y de macros), crea y adapta rutinas de entrenamiento personalizadas, y muestra un panel de análisis con el progreso del usuario a lo largo del tiempo. Toda la información se persiste en base de datos, lo que permite comparar sesiones y detectar tendencias reales de mejora.",
      en: "BioFit goes beyond a simple gym app: it's a health ecosystem where artificial intelligence acts as a personal trainer available at any time. The core is a computer vision engine built on MediaPipe that analyses the user's posture frame by frame, detects technique errors, and issues specific corrections before the user finishes the repetition. Around that engine sits an AI assistant that manages nutrition (intake logging, calorie and macro goals), creates and adapts personalised training routines, and displays a progress analytics dashboard over time. All data is persisted in a database, enabling session-to-session comparisons and real improvement trends.",
    },
    problem: {
      es: "Acceder a un entrenador personal cualificado está fuera del alcance de la mayoría. Las apps de fitness existentes son herramientas pasivas: registran lo que el usuario introduce, pero no observan, no corrigen y no razonan. El resultado es que millones de personas entrenan con mala técnica durante meses —acumulando lesiones— sin recibir feedback útil.",
      en: "Access to a qualified personal trainer is out of reach for most people. Existing fitness apps are passive tools: they record what the user inputs, but they don't observe, don't correct, and don't reason. The result is that millions of people train with poor technique for months — accumulating injuries — without ever receiving useful feedback.",
    },
    solution: {
      es: "BioFit reemplaza el ojo del entrenador con un pipeline de visión por computador basado en MediaPipe Pose, que extrae 33 puntos del esqueleto en tiempo real desde la cámara del dispositivo y evalúa los ángulos articulares y la alineación postural en cada repetición. Cuando detecta una desviación significativa, emite una corrección específica antes de que el movimiento se complete. La capa de IA integra este feedback visual con el perfil del usuario (nivel, objetivos, historial) para adaptar semana a semana las rutinas y las recomendaciones nutricionales. Todo el estado se persiste en base de datos, lo que habilita curvas de progreso reales y análisis longitudinal del rendimiento.",
      en: "BioFit replaces the trainer's eye with a computer vision pipeline built on MediaPipe Pose, which extracts 33 skeleton landmarks in real time from the device camera and evaluates joint angles and postural alignment for every repetition. When it detects a significant deviation, it issues a specific correction before the movement is completed. The AI layer integrates this visual feedback with the user's profile (level, goals, history) to adapt weekly routines and nutritional recommendations. All state is persisted in a database, enabling real progress curves and longitudinal performance analysis.",
    },
    tech: ["Python", "Streamlit", "MediaPipe", "NumPy", "Pandas", "SQLite"],
    // demoUrl: "",  // añade la demo cuando esté lista
    media: [
      { type: "image", src: "/images/projects/biofit.png" },
      { type: "video", src: "/images/projects/biofit-demo.mp4" },
    ],
    award: {
      label: { es: "Finalista", en: "Finalist" },
      event: { es: "Premios Santander X de Emprendimiento Universitario", en: "Santander X University Entrepreneurship Awards" },
    },
    privateRepo: true,
    featured: true,
    date: "2026-06-01",
  },
  {
    slug: "echolens",
    title: {
      es: "EchoLens — Clasificador de audio en tiempo real en el navegador",
      en: "EchoLens — Real-time in-browser audio classifier",
    },
    summary: {
      es: "CNN que clasifica sonidos urbanos al instante en tu propio dispositivo: entrena en PyTorch, se cuantiza a INT8 y corre al 100% sobre WebAssembly en el navegador, sin servidor y sin que el audio salga del dispositivo.",
      en: "CNN that classifies urban sounds instantly on your own device: trained in PyTorch, quantized to INT8, and running 100% on WebAssembly in the browser — no server, no audio ever leaving the device.",
    },
    description: {
      es: "EchoLens es un clasificador de sonido que funciona íntegramente en el navegador, sin servidor: el usuario abre la web, hace un sonido, y el sistema lo clasifica al instante en su propio dispositivo sin que el audio salga nunca de él. Técnicamente combina el entrenamiento de una CNN en PyTorch sobre UrbanSound8K, su exportación a ONNX y cuantización a INT8 para reducir el tamaño del modelo ~4× con menos de 2 puntos de pérdida de accuracy, y su ejecución en tiempo real con onnxruntime-web sobre WebAssembly. La captura del micrófono y el cálculo de los espectrogramas log-mel se realizan en vivo en el navegador con la Web Audio API y un AudioWorklet. El proyecto demuestra de forma conjunta competencias que rara vez aparecen juntas: procesamiento digital de señal de audio (STFT, filtros mel), entrenamiento y optimización de modelos de deep learning, despliegue de ML en el edge (cuantización y conversión de modelos) e ingeniería de ML en el navegador (inferencia on-device sobre WASM), con prácticas profesionales de ingeniería: CI/CD, tests y evaluación cuantitativa de latencia y precisión.",
      en: "EchoLens is a sound classifier that runs entirely in the browser with no server: the user opens the page, makes a sound, and the system classifies it instantly on their own device — the audio never leaves it. Technically it combines training a CNN in PyTorch on UrbanSound8K, exporting it to ONNX and quantizing it to INT8 to reduce model size ~4× with less than 2 accuracy points lost, and running it in real time with onnxruntime-web on WebAssembly. Microphone capture and log-mel spectrogram extraction run live in the browser via the Web Audio API and an AudioWorklet. The project demonstrates a set of skills that rarely appear together: digital audio signal processing (STFT, mel filters), deep learning model training and optimization, edge ML deployment (quantization and model conversion), and browser ML engineering (on-device inference on WASM) — all with professional engineering practices: CI/CD, tests, and quantitative evaluation of latency and accuracy.",
    },
    problem: {
      es: "Los modelos de ML de audio suelen requerir enviar el sonido a un servidor para su clasificación, lo que introduce latencia de red, dependencia de conectividad y, sobre todo, problemas de privacidad: el audio del usuario sale de su dispositivo. Los navegadores modernos ofrecen las primitivas necesarias para evitar esto, pero integrar el pipeline completo —captura de micrófono, extracción de características y inferencia neuronal— de forma eficiente sobre WebAssembly no es trivial.",
      en: "ML audio models typically require sending audio to a server for classification, introducing network latency, connectivity dependency, and above all privacy concerns: the user's audio leaves their device. Modern browsers offer the primitives to avoid this, but combining the full pipeline — microphone capture, feature extraction, and neural network inference — efficiently on WebAssembly is non-trivial.",
    },
    solution: {
      es: "Entrené una CNN sobre UrbanSound8K (10 clases de sonidos urbanos) en PyTorch con validación cruzada de 10 folds. Exporté el modelo a ONNX y lo cuanticé a INT8 —reducción ~4× con menos de 2 puntos de pérdida de accuracy— para inferencia eficiente en el edge. El despliegue es 100% client-side con onnxruntime-web sobre WebAssembly: la captura del micrófono y el cálculo de espectrogramas log-mel corren en tiempo real mediante la Web Audio API y un AudioWorklet, garantizando la paridad numérica entre el preprocesado en Python y en JavaScript. El proyecto incluye un estudio comparativo de backends de inferencia (WASM vs WebGPU) con métricas de latencia documentadas.",
      en: "I trained a CNN on UrbanSound8K (10 urban sound classes) in PyTorch with 10-fold cross-validation. I exported the model to ONNX and quantized it to INT8 — approximately 4× size reduction with less than 2 accuracy points lost — for efficient edge inference. Deployment is 100% client-side with onnxruntime-web on WebAssembly: microphone capture and log-mel spectrogram extraction run live via the Web Audio API and an AudioWorklet, with guaranteed numerical parity between the Python and JavaScript preprocessing pipelines. The project includes a comparative study of inference backends (WASM vs WebGPU) with documented latency metrics.",
    },
    tech: ["PyTorch", "ONNX", "onnxruntime-web", "WebAssembly", "TypeScript", "Web Audio API", "Python"],
    image: "/images/projects/echolens.png",
    repoUrl: "https://github.com/hugoomez/echolens",
    featured: true,
    date: "2026-06-14",
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
