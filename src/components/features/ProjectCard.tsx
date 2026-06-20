import { useLocale, useTranslations } from "next-intl";
import { ExternalLink, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProjectCover } from "./ProjectCover";
import { pick } from "@/lib/utils";
import type { Project } from "@/content/projects";

export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("Projects");
  const title = pick(project.title, locale);

  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/projects/${project.slug}`} className="block">
        <ProjectCover
          slug={project.slug}
          title={title}
          image={project.image}
          priority={priority}
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          {project.featured && (
            <Badge className="border-accent/40 text-accent">
              {t("featured")}
            </Badge>
          )}
        </div>

        <h3 className="text-lg font-semibold">
          <Link
            href={`/projects/${project.slug}`}
            className="hover:text-accent"
          >
            {title}
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-sm text-muted-foreground">
          {pick(project.summary, locale)}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
          >
            {t("viewCaseStudy")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <div className="flex items-center gap-3 text-muted-foreground">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t("repo")} — ${title}`}
                className="transition-colors hover:text-foreground"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t("demo")} — ${title}`}
                className="transition-colors hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
