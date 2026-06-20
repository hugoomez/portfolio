import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/features/ProjectCard";
import { getAllProjects } from "@/content/projects";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("projectsTitle"),
    description: t("projectsDescription"),
    alternates: { canonical: locale === "en" ? "/en/projects" : "/projects" },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProjectsContent />;
}

function ProjectsContent() {
  const t = useTranslations("Projects");
  const projects = getAllProjects();

  return (
    <Section title={t("title")} subtitle={t("subtitle")}>
      {projects.length === 0 ? (
        <p className="text-muted-foreground">{t("empty")}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} priority={i < 2} />
          ))}
        </div>
      )}
    </Section>
  );
}
