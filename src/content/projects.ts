/**
 * PROJECT DATA — the core of the portfolio.
 *
 * Adding a project = editing this one file. Each entry is fully type-checked.
 * The detail page at /projects/[slug] is generated from the `slug`. Aim for
 * 3–5 strong, deeply-documented case studies.
 *
 * MEDIA: use `media` for a carousel (images, local videos, YouTube). If you only
 * have one image you can still use `image` for convenience — `media` takes precedence.
 *
 * AWARD: fill `award` if the project won or was a finalist somewhere.
 *
 * PRIVATE REPO: set `privateRepo: true` when the code is not public — a lock badge
 * replaces the GitHub link automatically.
 *
 * RESEARCH: set `research: true` for projects centered on a research paper /
 * scientific contribution (as opposed to a shipped app or tool) — shows a
 * "Research" badge on the card and detail page.
 */

/** A single item in the media carousel. */
export type MediaItem =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster?: string }
  | { type: "youtube"; id: string };

export interface Award {
  /** Short recognition label, e.g. "1st Prize". */
  label: string;
  /** Event / competition name, e.g. "HackUPC 2025". */
  event?: string;
}

export interface Project {
  /** URL-safe id, used as the route /projects/<slug>. */
  slug: string;
  title: string;
  /** One-line summary shown on cards. */
  summary: string;
  /** Longer case-study body (a paragraph or two). */
  description: string;
  /** Case study: what problem did this solve? */
  problem?: string;
  /** Case study: how did you solve it (approach, key challenge)? */
  solution?: string;
  /** Technologies used, with context where helpful (e.g. "React"). */
  tech: string[];
  repoUrl?: string;
  demoUrl?: string;
  /** Link to a research paper / preprint (e.g. Zenodo, arXiv). */
  paperUrl?: string;
  /** Single cover image path under /public. Ignored when `media` is set. */
  image?: string;
  /** Carousel: ordered list of images / videos / YouTube embeds. */
  media?: MediaItem[];
  /** Award or finalist recognition. */
  award?: Award;
  /** Set to true when the source code is not publicly accessible. */
  privateRepo?: boolean;
  featured?: boolean;
  /** Set to true for research-paper-centered projects — shows a Research badge. */
  research?: boolean;
  /** ISO date (YYYY-MM-DD) — used for ordering. */
  date: string;
}

export const projects: Project[] = [
  {
    slug: "mcmt",
    title: "MCMT — Real-time multi-camera multi-target tracking",
    summary:
      "Person-tracking engine across hundreds of cameras (up to 1,300 simultaneously), combining a geometric C++ core with a graph neural network to resolve ambiguous cases.",
    description:
      "MCMT is a multi-camera multi-target tracking library designed to answer, in real time and at scale, the question 'is this person I see in camera A the same one I saw earlier in camera B?'. The system tracks each object within a single camera using an extended Kalman filter, fuses those local tracks into global identities through a cascade of geometric and appearance-based rules, and only falls back on a graph neural network for the small fraction of cases geometry can't resolve confidently. It's built as a Python/C++ hybrid: Python orchestrates business logic and design patterns, while C++ (via Eigen and nanobind) implements the performance-critical kernels, sharing memory with zero copies through Apache Arrow. The whole architecture targets free-threaded Python 3.13 (no-GIL), with lock-free data structures and a strict lock hierarchy to guarantee real parallelism without deadlocks.",
    problem:
      "In a venue covered by many overlapping cameras, the system must continuously decide which detection from one camera corresponds to a person already seen in another, under tough constraints: each camera only provides 2D coordinates that must be projected into real-world metric space; the same person looks different depending on angle and lighting; camera clocks drift out of sync; and everything has to be resolved within milliseconds for thousands of detections per second at a scale of up to 1,300 cameras. A single bad association can also permanently corrupt a person's visual identity if not handled carefully.",
    solution:
      "I designed a two-tier architecture: a geometric tier ('Glance') that resolves roughly 99% of associations through a five-gate cascade of increasing cost — camera field-of-view compatibility, ground-plane proximity, Mahalanobis distance over the Kalman filter's covariance, velocity coherence, and finally appearance similarity (Re-ID) — solved with the Hungarian algorithm. The remaining 1% of ambiguous cases is handed off, off the critical path and on background threads, to a graph neural network (MPGNN) with attention and Sinkhorn normalization. Every performance-critical kernel (Kalman filter, 2D→3D projection, lock-free temporal synchronization, double-buffered embedding pool, graph network inference) has both a C++ implementation and a pure-NumPy one, used as an automatic fallback and as a numerically validated reference in tests. The result is a multi-threaded system with four concurrent responsibilities (critical path, AI inference, identity lifecycle) coordinated through double buffering, bounded queues, and a documented lock hierarchy that eliminates deadlocks by design. The system was validated on the WILDTRACK dataset with MODA/MODP metrics and an ablation study confirming the core design thesis: geometry resolves almost everything, and the graph network delivers a measurable improvement on the hard cases without compromising real-time latency.",
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
      "PyTorch (training)",
      "SQLite",
    ],
    // repoUrl: "https://github.com/hugoomez/mcmt",
    media: [
      { type: "image", src: "/images/projects/mcmt.png" },
      { type: "video", src: "/images/projects/mcmt-demo.mp4" },
      { type: "image", src: "/images/projects/mcmt-1.svg", alt: "MCMT architecture" },
    ],
    award: {
      label: "1st Prize",
      event: "AI Ideas Competition for ATM, Indra",
    },
    privateRepo: true,
    featured: true,
    date: "2026-06-22",
  },
  {
    slug: "clinical-fidelity-belt",
    title: "Clinical Fidelity Belt — Evaluation gate for AI-humanized radiology reports",
    summary:
      "A four-layer evaluation gate that decides whether an AI-humanized radiology report still preserves clinical severity well enough for a patient to read — plus a documented negative result: a transformer clinical NER backend that collapsed from 56% to 8.6% entity recall.",
    description:
      "Clinical Fidelity Belt started at the IABiomed 2026 hackathon as an evaluation gate for AI-humanized radiology reports: a four-layer check (readability, clinical coverage, entity recall, factual fidelity) that decides whether a patient-friendly rewrite still preserves the original's clinical severity, formalizing the line between legitimate simplification and dangerous attenuation. It compares three independent fidelity backends — lexical entailment, NLI-based contradiction detection (mDeBERTa-v3), and an LLM-as-judge (Gemini) — against an adversarial test set with deliberately seeded severity attenuations. The most interesting finding is negative: the transformer-based clinical NER backend dropped entity recall from 56% to 8.6% against a hand-curated technical-to-lay dictionary, a failure diagnosed in detail to separate fixable pattern bugs from limitations inherent to lexical matching. It ships as a Python package with 30 offline tests, CI across Python 3.10/3.12/3.14, a pinned environment, a data card, and documented limitations — scoped honestly as a proof of concept validated on a single synthetic clinical case.",
    problem:
      "Radiology reports written for clinicians are unreadable to most patients, and LLMs can rewrite them in plain language — but simplification and information loss look identical from the outside. A rewritten report can quietly downplay a finding's severity without the drop in technical density that would normally signal a problem, and there was no established, empirically validated way to tell an appropriate rewrite from a dangerous one before it reaches a patient.",
    solution:
      "I built a four-layer gate — readability, clinical coverage, entity recall, and factual fidelity — that a humanized report must pass before reaching a patient, and benchmarked three candidate fidelity backends against each other on an adversarial set with deliberately seeded attenuations: lexical entailment, NLI-based contradiction detection via mDeBERTa-v3, and an LLM-as-judge using Gemini. When the clinical NER backend underperformed sharply (56% → 8.6% entity recall against a hand-curated dictionary), instead of hiding the result I diagnosed it, separating bugs I could fix from limitations inherent to lexical matching against clinical language. The whole thing is packaged as a tested Python library — 30 offline tests, CI on three Python versions, a pinned environment, and a data card — scoped honestly as a single-case proof of concept.",
    tech: ["Python", "mDeBERTa-v3", "NLI", "Gemini API", "Biomedical NER", "pytest", "GitHub Actions"],
    image: "/images/projects/picos-cover.png",
    repoUrl: "https://github.com/hugoomez/clinical-fidelity-belt",
    featured: true,
    date: "2026-06-01",
  },
  {
    slug: "quantized-gemm-error",
    title: "Quantized GEMM Error — Isolating the two design choices behind MXFP4 vs. NVFP4",
    summary:
      "A research paper isolating what actually explains NVIDIA's claimed NVFP4-over-MXFP4 training advantage: a from-scratch quantization engine, a numerical-error bound derived from first principles, and a 1.6-million-trial factorial study pinning the advantage on scale format rather than block size.",
    description:
      "Quantized GEMM Error is a short paper for the NewInML workshop at NeurIPS 2026, investigating why NVIDIA's NVFP4 format needs 36% fewer training tokens than MXFP4 to match pretraining loss — a number that can't say which of NVFP4's two design changes (a smaller 16-value block vs. MXFP4's 32, and a finer E4M3 scale vs. MXFP4's power-of-two E8M0) actually matters, since both change at once. I built a full 4-bit block-scaled quantization engine from scratch in NumPy (FP4/FP8/E8M0, block scaling, a random Hadamard transform, a quantized-GEMM pipeline), validating every layer bit-exact against reference implementations (ml_dtypes, Microsoft's microxcaling) before trusting a single result. Classical rounding-error bounds don't hold for block-scaled formats under exact accumulation, so I derived a new one from first principles and validated it against theory and an independently published result. A preregistered 640-configuration, 1.6-million-trial factorial sweep — run on CPU for exact fp64 accumulation, with checkpointing that survived a mid-run thermal shutdown — isolates the two confounded factors directly. The headline finding: scale format, not block size, is what actually drives NVFP4's advantage on a backward-error proxy, validated against real GPT-2 activations and disclosed honestly where the theory and the data disagreed.",
    problem:
      "NVIDIA's own benchmark for NVFP4 bundles two independent design changes — a smaller 16-value quantization block (vs. MXFP4's 32) and a finer-grained E4M3 scale format (vs. MXFP4's power-of-two E8M0) — into a single headline number, so a 36%-fewer-tokens claim says nothing about which change actually matters. Classical numerical-error theory (Higham's rounding bounds) doesn't apply to block-scaled quantization under exact accumulation either, so there was no principled way to even predict which factor should dominate before running the experiment.",
    solution:
      "I designed a preregistered 2×2 factorial experiment — real hardware formats plus two synthetic, non-hardware control configurations — to isolate block size from scale format, crossed with tail weight (how 'spiky' activation distributions are), rounding mode, and an outlier-spreading transform. The sweep ran 640 configurations and 1.6 million trials on a laptop CPU — deliberately, since the experiment needs exact fp64 accumulation that GPUs handle poorly — with checkpoint/resume infrastructure that survived an actual mid-run thermal shutdown without losing data. The originally preregistered comparison, locating where the derived error bound breaks down, turned out uninformative on this grid; rather than force a false positive, I disclosed that honestly and pivoted to a direct magnitude-based causal analysis: scale format, not block size, dominates NVFP4's advantage across nearly the whole tested range, with an honest caveat at the heaviest tail weight. I validated the synthetic model against real GPT-2 activations (strong transfer at 2 of 3 layers, the third traced to a documented 'massive activations' phenomenon), verified every citation against primary sources by hand, and put the paper through two adversarial review passes before submission.",
    tech: ["Python", "NumPy", "ml_dtypes", "microxcaling", "Bootstrap CI", "LaTeX"],
    repoUrl: "https://github.com/hugoomez/quantized-gemm-error",
    paperUrl: "https://zenodo.org/records/22554253",
    featured: true,
    research: true,
    date: "2026-09-11",
  },
  {
    slug: "biofit",
    title: "BioFit — AI-powered integral health ecosystem",
    summary:
      "AI coach that analyses your exercise technique in real time using computer vision, designs personalised routines, and tracks your nutrition and progress.",
    description:
      "BioFit goes beyond a simple gym app: it's a health ecosystem where artificial intelligence acts as a personal trainer available at any time. The core is a computer vision engine built on MediaPipe that analyses the user's posture frame by frame, detects technique errors, and issues specific corrections before the user finishes the repetition. Around that engine sits an AI assistant that manages nutrition (intake logging, calorie and macro goals), creates and adapts personalised training routines, and displays a progress analytics dashboard over time. All data is persisted in a database, enabling session-to-session comparisons and real improvement trends.",
    problem:
      "Access to a qualified personal trainer is out of reach for most people. Existing fitness apps are passive tools: they record what the user inputs, but they don't observe, don't correct, and don't reason. The result is that millions of people train with poor technique for months — accumulating injuries — without ever receiving useful feedback.",
    solution:
      "BioFit replaces the trainer's eye with a computer vision pipeline built on MediaPipe Pose, which extracts 33 skeleton landmarks in real time from the device camera and evaluates joint angles and postural alignment for every repetition. When it detects a significant deviation, it issues a specific correction before the movement is completed. The AI layer integrates this visual feedback with the user's profile (level, goals, history) to adapt weekly routines and nutritional recommendations. All state is persisted in a database, enabling real progress curves and longitudinal performance analysis.",
    tech: ["Python", "Streamlit", "MediaPipe", "NumPy", "Pandas", "SQLite"],
    // demoUrl: "",  // add the demo when it's ready
    media: [
      { type: "image", src: "/images/projects/biofit.png" },
      { type: "video", src: "/images/projects/biofit-demo.mp4" },
    ],
    award: {
      label: "Finalist",
      event: "Santander X University Entrepreneurship Awards",
    },
    privateRepo: true,
    featured: true,
    date: "2026-06-01",
  },
  {
    slug: "echolens",
    title: "EchoLens — Real-time in-browser audio classifier",
    summary:
      "CNN that classifies urban sounds instantly on your own device: trained in PyTorch, quantized to INT8, and running 100% on WebAssembly in the browser — no server, no audio ever leaving the device.",
    description:
      "EchoLens is a sound classifier that runs entirely in the browser with no server: the user opens the page, makes a sound, and the system classifies it instantly on their own device — the audio never leaves it. Technically it combines training a CNN in PyTorch on UrbanSound8K, exporting it to ONNX and quantizing it to INT8 to reduce model size ~4× with less than 2 accuracy points lost, and running it in real time with onnxruntime-web on WebAssembly. Microphone capture and log-mel spectrogram extraction run live in the browser via the Web Audio API and an AudioWorklet. The project demonstrates a set of skills that rarely appear together: digital audio signal processing (STFT, mel filters), deep learning model training and optimization, edge ML deployment (quantization and model conversion), and browser ML engineering (on-device inference on WASM) — all with professional engineering practices: CI/CD, tests, and quantitative evaluation of latency and accuracy.",
    problem:
      "ML audio models typically require sending audio to a server for classification, introducing network latency, connectivity dependency, and above all privacy concerns: the user's audio leaves their device. Modern browsers offer the primitives to avoid this, but combining the full pipeline — microphone capture, feature extraction, and neural network inference — efficiently on WebAssembly is non-trivial.",
    solution:
      "I trained a CNN on UrbanSound8K (10 urban sound classes) in PyTorch with 10-fold cross-validation. I exported the model to ONNX and quantized it to INT8 — approximately 4× size reduction with less than 2 accuracy points lost — for efficient edge inference. Deployment is 100% client-side with onnxruntime-web on WebAssembly: microphone capture and log-mel spectrogram extraction run live via the Web Audio API and an AudioWorklet, with guaranteed numerical parity between the Python and JavaScript preprocessing pipelines. The project includes a comparative study of inference backends (WASM vs WebGPU) with documented latency metrics.",
    tech: ["PyTorch", "ONNX", "onnxruntime-web", "WebAssembly", "TypeScript", "Web Audio API", "Python"],
    demoUrl: "https://echolens-pied.vercel.app/",
    repoUrl: "https://github.com/hugoomez/echolens",
    media: [
      { type: "image", src: "/images/projects/echolens.png" },
      { type: "video", src: "/images/projects/demo-echolens.mp4" },
    ],
    featured: true,
    date: "2026-06-14",
  },
  {
    slug: "rag-hallucination-detector",
    title: "RAG Hallucination Detector",
    summary:
      "A hallucination detector for RAG systems: a full pipeline (retrieval + generation + verification) with a model matching published state-of-the-art results, plus a research paper auditing an unexploited annotation-quality issue in the field's standard benchmark.",
    description:
      'This project tackles a real problem in RAG (Retrieval-Augmented Generation) systems: detecting when an LLM invents information not supported by the context it was given. It has two independent deliverables, each solid on its own. The first is the system: a complete RAG pipeline (FAISS + embeddings retriever, LLM generation, and a token-level hallucination detector) with an interactive demo and a deployable API; the final model (ModernBERT, token-level binary classification) matches the published F1 of LettuceDetect-base and, in its scaled-up variant, slightly surpasses the F1 of LettuceDetect-large — the field\'s most recent reference system — trained entirely on free GPU. The second is the paper: during evaluation, it turned out that RAGTruth, the field\'s standard benchmark, labels both false content and true-but-not-mentioned-in-context content as "hallucination," without any published system distinguishing between the two cases when scoring. The project quantifies exactly how much this conflation weighs (9.49% of the test set\'s character mass), designs a pre-registered ablation experiment to test whether fixing it helps training (result: no, with a dose-response curve ruling out both alternative explanations), and documents the full finding in a preprint verified line by line against the raw data.',
    problem:
      "Production RAG systems can generate answers that \"sound right\" but aren't actually supported by the retrieved documents — a real risk in sensitive domains (legal, healthcare, finance). On top of that, the benchmark the community uses to measure these detectors (RAGTruth) mixes, under a single label, genuinely harmful hallucinations with content that is technically ungrounded but true — and no published system, including the field's reference systems, accounts for this when reporting its metrics.",
    solution:
      "A token-level hallucination detector (ModernBERT), trained and validated with full experimental rigor: zero-shot baseline, systematic comparison across 4 different architectures, error analysis, and a pre-registered ablation with the decision fixed in code before seeing the results. The system is integrated into a real RAG pipeline (retrieval + generation + verification), with a working demo and API. In parallel, the benchmark's label-conflation problem was quantified and formally documented, with exhaustive verification of every figure against the raw data and the cited primary sources.",
    tech: [
      "PyTorch",
      "Hugging Face Transformers",
      "ModernBERT",
      "FAISS",
      "sentence-transformers",
      "FastAPI",
      "Docker",
      "HTML/CSS/JS",
    ],
    repoUrl: "https://github.com/hugoomez/rag-hallucination-detector",
    paperUrl: "https://zenodo.org/records/21693377",
    media: [
      { type: "image", src: "/images/projects/rag-hallucination-detector.png" },
      { type: "image", src: "/images/projects/rag-hallucination-detector-1.png" },
    ],
    featured: true,
    research: true,
    date: "2026-07-30",
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
