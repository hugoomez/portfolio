import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { siteConfig } from "@/lib/config";

export function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  const links = [
    { href: siteConfig.social.github, label: t("github"), Icon: GithubIcon },
    { href: siteConfig.social.linkedin, label: t("linkedin"), Icon: LinkedinIcon },
    { href: `mailto:${siteConfig.email}`, label: t("email"), Icon: Mail },
  ].filter((l) => l.href && !l.href.endsWith("undefined"));

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="text-sm text-muted-foreground">
          <p>
            © {year} {siteConfig.name}. {t("rights")}
          </p>
          <p className="mt-1">{t("builtWith")}</p>
        </div>
        <div className="flex items-center gap-3">
          {links.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              title={label}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
