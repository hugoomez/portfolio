import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/features/ContactForm";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about opportunities, internships or collaborations.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Section title="Contact" subtitle="Got an opportunity or want to collaborate? Drop me a line.">
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="max-w-xl">
          <ContactForm />
        </div>
        <aside className="text-sm text-muted-foreground">
          <p>Or email me directly at</p>
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
