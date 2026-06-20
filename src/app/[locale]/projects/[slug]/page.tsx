import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { ProjectCover } from "@/components/features/ProjectCover";
import { routing } from "@/i18n/routing";
import { getAllProjects, getProjectBySlug } from "@/content/projects";
import { pick } from "@/lib/utils";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllProjects().map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  const title = pick(project.title, locale);
  const description = pick(project.summary, locale);
  return {
    title,
    description,
    alternates: {
      canonical: `${locale === "en" ? "/en" : ""}/projects/${slug}`,
    },
    openGraph: { title, description, type: "article" },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: "Projects" });
  const title = pick(project.title, locale);

  return (
    <article className="py-12 sm:py-16">
      <Container>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToProjects")}
        </Link>

        <header className="mt-6">
          <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            {pick(project.summary, locale)}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({ size: "sm" })}
              >
                <ExternalLink className="h-4 w-4" />
                {t("demo")}
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({ variant: "secondary", size: "sm" })}
              >
                <GithubIcon className="h-4 w-4" />
                {t("repo")}
              </a>
            )}
          </div>
        </header>

        <div className="mt-8 overflow-hidden rounded-xl border border-border">
          <ProjectCover
            slug={project.slug}
            title={title}
            image={project.image}
            priority
          />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_240px]">
          <div className="max-w-2xl space-y-8 leading-relaxed">
            <p className="text-lg text-foreground/90">
              {pick(project.description, locale)}
            </p>

            {project.problem && (
              <section>
                <h2 className="text-xl font-semibold">{t("theProblem")}</h2>
                <p className="mt-2 text-muted-foreground">
                  {pick(project.problem, locale)}
                </p>
              </section>
            )}

            {project.solution && (
              <section>
                <h2 className="text-xl font-semibold">{t("theSolution")}</h2>
                <p className="mt-2 text-muted-foreground">
                  {pick(project.solution, locale)}
                </p>
              </section>
            )}
          </div>

          <aside className="lg:border-l lg:border-border lg:pl-8">
            <h2 className="font-mono text-sm uppercase tracking-widest text-accent">
              {t("techStack")}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <li key={tech}>
                  <Badge className="text-foreground">{tech}</Badge>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </article>
  );
}
