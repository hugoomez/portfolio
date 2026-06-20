import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { skills, type Proficiency } from "@/data/skills";

const tiers: Proficiency[] = ["proficient", "familiar", "learning"];

export function SkillsGrid() {
  const t = useTranslations("About");

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {tiers.map((tier) => (
        <div key={tier} className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-mono text-sm uppercase tracking-widest text-accent">
            {t(tier)}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {skills[tier].map((skill) => (
              <li key={skill.name}>
                <Badge className="text-foreground">
                  {skill.name}
                  {skill.note && (
                    <span className="ml-1 text-muted-foreground">
                      · {skill.note}
                    </span>
                  )}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
