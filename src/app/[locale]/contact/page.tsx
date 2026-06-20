import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/features/ContactForm";
import { siteConfig } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("contactTitle"),
    description: t("contactDescription"),
    alternates: { canonical: locale === "en" ? "/en/contact" : "/contact" },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactContent />;
}

function ContactContent() {
  const t = useTranslations("Contact");

  return (
    <Section title={t("title")} subtitle={t("subtitle")}>
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="max-w-xl">
          <ContactForm />
        </div>
        <aside className="text-sm text-muted-foreground">
          <p>{t("orEmail")}</p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-1 inline-block font-mono text-accent hover:underline"
          >
            {siteConfig.email}
          </a>
        </aside>
      </div>
    </Section>
  );
}
