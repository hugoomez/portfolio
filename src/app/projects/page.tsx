import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/features/ProjectCard";
import { getAllProjects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Case studies of my best projects: problem, solution, stack and results.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <Section
      title="Projects"
      subtitle="Case studies: problem, solution, stack and result."
    >
      {projects.length === 0 ? (
        <p className="text-muted-foreground">More projects coming soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} priority={i < 2} />
          ))}
        </div>
      )}
    </Section>
  );
}
