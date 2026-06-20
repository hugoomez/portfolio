/**
 * SKILLS — grouped by proficiency, NOT percentage bars (recruiters dislike those).
 * Add brief context where useful (e.g. "React — 3 projects").
 * TODO (USER): adjust the lists to reflect your real experience.
 */

export type Proficiency = "proficient" | "familiar" | "learning";

export interface Skill {
  name: string;
  /** Optional context shown beside the name. */
  note?: string;
}

export const skills: Record<Proficiency, Skill[]> = {
  proficient: [
    { name: "TypeScript" },
    { name: "JavaScript" },
    { name: "Python" },
    { name: "React" },
    { name: "Git" },
    { name: "SQL" },
  ],
  familiar: [
    { name: "Next.js" },
    { name: "Node.js" },
    { name: "Java" },
    { name: "Tailwind CSS" },
    { name: "PostgreSQL" },
    { name: "C" },
  ],
  learning: [
    { name: "Docker" },
    { name: "Rust" },
    { name: "Go" },
  ],
};
