/** Skills grouped by category. Display labels are localized under "Skills" in messages. */

export const skills = {
  Languages: ["Python", "C++", "SQL", "Java", "C"],
  MachineLearning: ["PyTorch", "scikit-learn", "NumPy", "Pandas", "Scipy"],
  Tools: ["Git", "Linux", "Docker", "PostgreSQL"],
} as const;

export type SkillCategory = keyof typeof skills;

export const skillCategories = Object.keys(skills) as SkillCategory[];
