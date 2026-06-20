import Image from "next/image";
import { hueFromString } from "@/lib/utils";

/**
 * Project cover image. Falls back to a deterministic gradient (no broken images)
 * until the user adds a real screenshot at the `image` path.
 */
export function ProjectCover({
  slug,
  title,
  image,
  priority = false,
}: {
  slug: string;
  title: string;
  image?: string;
  priority?: boolean;
}) {
  if (image) {
    return (
      <Image
        src={image}
        alt={title}
        width={1200}
        height={675}
        priority={priority}
        className="aspect-[16/9] w-full object-cover"
      />
    );
  }

  const hue = hueFromString(slug);
  return (
    <div
      aria-hidden
      className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, oklch(0.6 0.18 ${hue}), oklch(0.45 0.2 ${(hue + 60) % 360}))`,
      }}
    >
      <span className="select-none font-mono text-6xl font-bold text-white/90">
        {title.charAt(0).toUpperCase()}
      </span>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
    </div>
  );
}
