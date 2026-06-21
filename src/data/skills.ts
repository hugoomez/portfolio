/**
 * SKILLS — grouped by category (not percentage bars, which recruiters dislike).
 * Category display labels are localized in src/messages/*.json under "Skills".
 * TODO (USER): adjust the lists to reflect your real experience.
 */

export const skills = {
  Languages: ["Python", "C++", "SQL", "Java", "C"],
  MachineLearning: ["PyTorch", "scikit-learn", "NumPy", "Pandas", "Scipy"],
  Tools: ["Git", "Linux", "Docker", "PostgreSQL"],
} as const;

export type SkillCategory = keyof typeof skills;

export const skillCategories = Object.keys(skills) as SkillCategory[];
