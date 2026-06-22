import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { GradientDescentDemo } from "@/components/features/GradientDescentDemo";
import { FourierDemo } from "@/components/features/FourierDemo";
import { LorenzDemo } from "@/components/features/LorenzDemo";
import { NeuralNetDemo } from "@/components/features/NeuralNetDemo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("mathTitle"),
    description: t("mathDescription"),
    alternates: { canonical: locale === "en" ? "/en/math" : "/math" },
  };
}

export default async function MathPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MathContent />;
}

function MathContent() {
  const t = useTranslations("Math");

  return (
    <Section title={t("title")} subtitle={t("subtitle")}>
      <p className="mb-10 max-w-2xl text-muted-foreground">{t("intro")}</p>
      <div className="grid gap-8 lg:grid-cols-2">
        <GradientDescentDemo />
        <FourierDemo />
        <LorenzDemo />
        <NeuralNetDemo />
      </div>
    </Section>
  );
}
