import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { GradientDescentDemo } from "@/components/features/GradientDescentDemo";
import { FourierDemo } from "@/components/features/FourierDemo";
import { LorenzDemo } from "@/components/features/LorenzDemo";
import { NeuralNetDemo } from "@/components/features/NeuralNetDemo";

export const metadata: Metadata = {
  title: "Mathematics",
  description:
    "Where mathematics meets code: interactive visualisations and rendered notation.",
  alternates: { canonical: "/math" },
};

export default function MathPage() {
  return (
    <Section
      title="Mathematics + Code"
      subtitle="Interactive visualisations of dynamic systems, machine learning and signal analysis — mathematics running in the browser."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <GradientDescentDemo />
        <FourierDemo />
        <LorenzDemo />
        <NeuralNetDemo />
      </div>
    </Section>
  );
}
