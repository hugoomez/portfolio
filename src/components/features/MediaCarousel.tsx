"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import type { MediaItem } from "@/content/projects";
import { pick } from "@/lib/utils";

function MediaSlide({
  item,
  title,
  locale,
  priority,
}: {
  item: MediaItem;
  title: string;
  locale: string;
  priority: boolean;
}) {
  if (item.type === "image") {
    return (
      <Image
        src={item.src}
        alt={item.alt ? pick(item.alt, locale) : title}
        width={1200}
        height={675}
        priority={priority}
        className="aspect-[16/9] w-full object-cover"
      />
    );
  }

  if (item.type === "video") {
    return (
      <video
        src={item.src}
        poster={item.poster}
        controls
        playsInline
        className="aspect-[16/9] w-full bg-black object-contain"
      />
    );
  }

  return (
    <div className="aspect-[16/9] w-full bg-black">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${item.id}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}

export function MediaCarousel({
  items,
  title,
  priority = false,
}: {
  items: MediaItem[];
  title: string;
  priority?: boolean;
}) {
  const locale = useLocale();
  const [current, setCurrent] = useState(0);
  const total = items.length;

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + total) % total),
    [total],
  );
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % total),
    [total],
  );

  if (total === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="relative">
        <MediaSlide
          item={items[current]}
          title={title}
          locale={locale}
          priority={priority && current === 0}
        />

        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow-md backdrop-blur-sm transition hover:bg-background"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow-md backdrop-blur-sm transition hover:bg-background"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="flex items-center justify-center gap-2 border-t border-border bg-muted/20 py-2.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ir a elemento ${i + 1} de ${total}`}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === current
                  ? "w-5 bg-accent"
                  : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
