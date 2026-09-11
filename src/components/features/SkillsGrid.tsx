import { Badge } from "@/components/ui/Badge";
import { skills, skillCategories, skillCategoryLabels } from "@/data/skills";

export function SkillsGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {skillCategories.map((category) => (
        <div
          key={category}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="mb-4 font-mono text-sm uppercase tracking-widest text-accent">
            {skillCategoryLabels[category]}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {skills[category].map((skill) => (
              <li key={skill}>
                <Badge className="text-foreground">{skill}</Badge>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
