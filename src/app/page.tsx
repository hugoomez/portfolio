import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { buttonClasses } from "@/components/ui/Button";
import { Hero } from "@/components/features/Hero";
import { ProjectCard } from "@/components/features/ProjectCard";
import { SkillsGrid } from "@/components/features/SkillsGrid";
import { getFeaturedProjects } from "@/content/projects";
import { siteConfig } from "@/lib/config";

export default function HomePage() {
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
        title="Featured projects"
        subtitle="A selection of my best work, in case-study form."
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
            View all projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      <Section
        eyebrow="02"
        title="Technologies"
        subtitle="Tools I work with day to day."
        className="border-t border-border"
      >
        <SkillsGrid />
      </Section>
    </>
  );
}
