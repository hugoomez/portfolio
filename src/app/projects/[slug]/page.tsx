import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText, FlaskConical, Lock, Trophy } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { ProjectCover } from "@/components/features/ProjectCover";
import { MediaCarousel } from "@/components/features/MediaCarousel";
import { getAllProjects, getProjectBySlug } from "@/content/projects";

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: { title: project.title, description: project.summary, type: "article" },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const title = project.title;
  const hasMedia = project.media && project.media.length > 0;

  return (
    <article className="py-12 sm:py-16">
      <Container>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>

        <header className="mt-6">
          {(project.research || project.award) && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {project.research && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
                  <FlaskConical className="h-4 w-4" />
                  Research
                </span>
              )}
              {project.award && (
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400">
                  <Trophy className="h-4 w-4" />
                  <span>{project.award.label}</span>
                  {project.award.event && (
                    <>
                      <span className="text-amber-500/50">·</span>
                      <span className="font-normal text-muted-foreground">
                        {project.award.event}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            {project.summary}
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
                Live demo
              </a>
            )}
            {project.paperUrl && (
              <a
                href={project.paperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({ variant: "secondary", size: "sm" })}
              >
                <FileText className="h-4 w-4" />
                Preprint
              </a>
            )}
            {project.privateRepo ? (
              <span className={buttonClasses({ variant: "secondary", size: "sm" })}>
                <Lock className="h-4 w-4" />
                Private code
              </span>
            ) : (
              project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses({ variant: "secondary", size: "sm" })}
                >
                  <GithubIcon className="h-4 w-4" />
                  Code
                </a>
              )
            )}
          </div>
        </header>

        <div className="mt-8">
          {hasMedia ? (
            <MediaCarousel items={project.media!} title={title} priority />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border">
              <ProjectCover
                slug={project.slug}
                title={title}
                image={project.image}
                priority
              />
            </div>
          )}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_240px]">
          <div className="max-w-2xl space-y-8 leading-relaxed">
            <p className="text-lg text-foreground/90">{project.description}</p>

            {project.problem && (
              <section>
                <h2 className="text-xl font-semibold">The problem</h2>
                <p className="mt-2 text-muted-foreground">{project.problem}</p>
              </section>
            )}

            {project.solution && (
              <section>
                <h2 className="text-xl font-semibold">The solution</h2>
                <p className="mt-2 text-muted-foreground">{project.solution}</p>
              </section>
            )}
          </div>

          <aside className="lg:border-l lg:border-border lg:pl-8">
            <h2 className="font-mono text-sm uppercase tracking-widest text-accent">
              Tech stack
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
