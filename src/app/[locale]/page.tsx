import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/Section";
import { buttonClasses } from "@/components/ui/Button";
import { Hero } from "@/components/features/Hero";
import { ProjectCard } from "@/components/features/ProjectCard";
import { SkillsGrid } from "@/components/features/SkillsGrid";
import { getFeaturedProjects } from "@/content/projects";
import { siteConfig } from "@/lib/config";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("Home");
  const featured = getFeaturedProjects();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    email: `mailto:${siteConfig.email}`,
    jobTitle: "Junior Software Developer",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: siteConfig.university,
    },
    sameAs: [siteConfig.social.github, siteConfig.social.linkedin].filter(
      Boolean,
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />

      <Section
        eyebrow="01"
        title={t("featuredTitle")}
        subtitle={t("featuredSubtitle")}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {featured.map((project, i) => (
            <ProjectCard key={project.slug} project={project} priority={i < 2} />
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/projects"
            className={buttonClasses({ variant: "secondary" })}
          >
            {t("allProjects")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      <Section
        eyebrow="02"
        title={t("skillsTitle")}
        subtitle={t("skillsSubtitle")}
        className="border-t border-border"
      >
        <SkillsGrid />
      </Section>
    </>
  );
}
