import { cn } from "@/lib/utils";
import { Container } from "./Container";

/** Consistent vertical rhythm wrapper with an optional titled header. */
export function Section({
  id,
  className,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  id?: string;
  className?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", className)}>
      <Container>
        {(eyebrow || title || subtitle) && (
          <header className="mb-10 max-w-2xl">
            {eyebrow && (
              <p className="mb-2 font-mono text-sm uppercase tracking-widest text-accent">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
            )}
            {subtitle && (
              <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>
            )}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
