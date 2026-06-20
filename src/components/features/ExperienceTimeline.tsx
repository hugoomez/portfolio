import { useLocale } from "next-intl";
import { experience } from "@/data/experience";
import { pick } from "@/lib/utils";

export function ExperienceTimeline() {
  const locale = useLocale();

  return (
    <ol className="relative border-l border-border">
      {experience.map((item, i) => (
        <li key={i} className="mb-10 ml-6 last:mb-0">
          <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border-2 border-background bg-accent" />
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {item.period}
          </p>
          <h3 className="mt-1 text-lg font-semibold">
            {pick(item.role, locale)}
          </h3>
          <p className="text-sm font-medium text-accent">
            {pick(item.organization, locale)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {pick(item.description, locale)}
          </p>
        </li>
      ))}
    </ol>
  );
}
