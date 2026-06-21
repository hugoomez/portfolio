import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Download } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { siteConfig } from "@/lib/config";

export function Hero() {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const cvHref = locale === "en" ? siteConfig.cv.en : siteConfig.cv.es;
  const hasAvatar = Boolean(siteConfig.avatar);

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.4] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <Container className="py-20 sm:py-28">
        <div
          className={
            hasAvatar
              ? "animate-fade-up flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16"
              : "animate-fade-up"
          }
        >
          {/* ── Text content ── */}
          <div className={hasAvatar ? "max-w-2xl flex-1" : "max-w-3xl"}>
            {/* Avatar visible only on mobile */}
            {hasAvatar && (
              <div className="mb-6 lg:hidden">
                <Image
                  src={siteConfig.avatar}
                  alt={siteConfig.name}
                  width={72}
                  height={72}
                  priority
                  className="rounded-full object-cover ring-2 ring-accent/30"
                />
              </div>
            )}

            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              {t("availability")}
            </p>

            <h1 className="text-4xl font-bold leading-tight sm:text-6xl">
              {t("greeting")}{" "}
              <span className="text-accent">{siteConfig.name}</span>
            </h1>

            <p className="mt-4 text-xl font-medium text-foreground/90 sm:text-2xl">
              {t("tagline")}
            </p>

            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              {t("intro")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/projects" className={buttonClasses({ size: "lg" })}>
                {t("viewProjects")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={cvHref}
                download
                className={buttonClasses({ variant: "secondary", size: "lg" })}
              >
                <Download className="h-4 w-4" />
                {t("downloadCv")}
              </a>
              <Link
                href="/contact"
                className={buttonClasses({ variant: "ghost", size: "lg" })}
              >
                {t("contact")}
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-4 text-muted-foreground">
              {siteConfig.social.github && (
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="transition-colors hover:text-foreground"
                >
                  <GithubIcon className="h-5 w-5" />
                </a>
              )}
              {siteConfig.social.linkedin && (
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="transition-colors hover:text-foreground"
                >
                  <LinkedinIcon className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* ── Avatar visible only on desktop ── */}
          {hasAvatar && (
            <div className="hidden flex-shrink-0 lg:flex lg:items-center lg:justify-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-accent/40 to-accent/10 blur-md" />
                <Image
                  src={siteConfig.avatar}
                  alt={siteConfig.name}
                  width={260}
                  height={260}
                  priority
                  className="relative rounded-full object-cover ring-2 ring-accent/20 shadow-2xl"
                />
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
