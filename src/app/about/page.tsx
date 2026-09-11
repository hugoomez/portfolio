import type { Metadata } from "next";
import { Download, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { buttonClasses } from "@/components/ui/Button";
import { ExperienceTimeline } from "@/components/features/ExperienceTimeline";
import { SkillsGrid } from "@/components/features/SkillsGrid";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description: "About me: education, experience and the technologies I work with.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Section title="About" subtitle="Education, experience and how I work.">
        <a href={siteConfig.cv} download className={buttonClasses({ variant: "secondary" })}>
          <Download className="h-4 w-4" />
          Download CV
        </a>
      </Section>

      <Section
        eyebrow="01"
        title="Education & experience"
        className="border-t border-border"
      >
        <div className="max-w-2xl">
          <ExperienceTimeline />
        </div>
      </Section>

      <Section
        eyebrow="02"
        title="Technologies"
        className="border-t border-border"
      >
        <SkillsGrid />
      </Section>

      <Section
        eyebrow="03"
        title="Lab"
        className="border-t border-border"
      >
        <p className="mb-6 max-w-2xl text-muted-foreground">
          Interactive visualisations of dynamic systems, Fourier series, and gradient
          descent — where mathematics becomes code.
        </p>
        <Link href="/math" className={buttonClasses({ variant: "secondary" })}>
          Open lab
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Section>
    </>
  );
}
