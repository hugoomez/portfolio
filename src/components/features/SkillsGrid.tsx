import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { skills, skillCategories } from "@/data/skills";

export function SkillsGrid() {
  const t = useTranslations("Skills");

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {skillCategories.map((category) => (
        <div
          key={category}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="mb-4 font-mono text-sm uppercase tracking-widest text-accent">
            {t(category)}
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
