"use client";

import { useState } from "react";
import Image from "next/image";
import { getFlowerById } from "@/data/flowers";
import type { ArrangementItem, GreeneryItem } from "@/lib/arrangement";

interface BouquetCompositionProps {
  arrangement: ArrangementItem[];
  greenery: GreeneryItem[];
}

export default function BouquetComposition({
  arrangement,
  greenery,
}: BouquetCompositionProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  function handleImageError(key: string) {
    setFailedImages((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }

  const hasContent = arrangement.length > 0 || greenery.length > 0;

  return (
    <div className="relative mx-auto w-full max-w-md" style={{ aspectRatio: "3 / 4" }}>
      {/* Empty state */}
      {!hasContent && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 28 28"
            fill="none"
            className="text-charcoal/15"
          >
            <ellipse cx="14" cy="8" rx="3.5" ry="6" fill="currentColor" opacity="0.3" />
            <ellipse cx="14" cy="20" rx="3.5" ry="6" fill="currentColor" opacity="0.3" />
            <ellipse cx="8" cy="14" rx="6" ry="3.5" fill="currentColor" opacity="0.3" />
            <ellipse cx="20" cy="14" rx="6" ry="3.5" fill="currentColor" opacity="0.3" />
            <circle cx="14" cy="14" r="3" fill="currentColor" opacity="0.4" />
          </svg>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-charcoal/30">
            Select flowers to begin
          </p>
        </div>
      )}

      {/* Greenery layer — single large bush image as background */}
      {greenery.map((item, i) => {
        const key = `greenery-${i}`;
        const hasFailed = failedImages.has(key);

        if (hasFailed) return null;

        return (
          <div
            key={key}
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: item.zIndex }}
          >
            <Image
              src={item.image}
              alt=""
              width={600}
              height={800}
              className="h-full w-full object-contain"
              onError={() => handleImageError(key)}
              draggable={false}
              priority
            />
          </div>
        );
      })}

      {/* Flower layer — large overlapping flowers on top of bush */}
      {arrangement.map((item, i) => {
        const flower = getFlowerById(item.flowerId);
        const key = `flower-${item.flowerId}-${i}`;
        const hasFailed = failedImages.has(key) || !flower;

        if (hasFailed) return null;

        return (
          <div
            key={key}
            className="absolute"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              zIndex: item.zIndex,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
              width: "30%",
            }}
          >
            <Image
              src={flower!.image}
              alt={flower!.name}
              width={200}
              height={200}
              className="h-auto w-full object-contain drop-shadow-md"
              onError={() => handleImageError(key)}
              draggable={false}
            />
          </div>
        );
      })}
    </div>
  );
}
