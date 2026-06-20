import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useLocale, useTranslations } from "next-intl";
import { Download } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { buttonClasses } from "@/components/ui/Button";
import { ExperienceTimeline } from "@/components/features/ExperienceTimeline";
import { SkillsGrid } from "@/components/features/SkillsGrid";
import { siteConfig } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("aboutTitle"),
    description: t("aboutDescription"),
    alternates: { canonical: locale === "en" ? "/en/about" : "/about" },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations("About");
  const locale = useLocale();
  const cvHref = locale === "en" ? siteConfig.cv.en : siteConfig.cv.es;

  return (
    <>
      <Section title={t("title")} subtitle={t("subtitle")}>
        <a href={cvHref} download className={buttonClasses({ variant: "secondary" })}>
          <Download className="h-4 w-4" />
          {t("downloadCv")}
        </a>
      </Section>

      <Section
        eyebrow="01"
        title={t("educationTitle")}
        className="border-t border-border"
      >
        <div className="max-w-2xl">
          <ExperienceTimeline />
        </div>
      </Section>

      <Section
        eyebrow="02"
        title={t("skillsTitle")}
        className="border-t border-border"
      >
        <SkillsGrid />
      </Section>
    </>
  );
}
