import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";

export default function NotFound() {
  const t = useTranslations("NotFound");
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-mono text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-2 max-w-md text-muted-foreground">{t("description")}</p>
      <Link href="/" className={buttonClasses({ className: "mt-6" })}>
        {t("home")}
      </Link>
    </Container>
  );
}
