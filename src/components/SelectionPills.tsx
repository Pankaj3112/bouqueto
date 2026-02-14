"use client";

import { getFlowerById } from "@/data/flowers";

interface SelectionPillsProps {
  selections: Array<{ flowerId: string; count: number }>;
  onRemove: (flowerId: string) => void;
}

export default function SelectionPills({ selections, onRemove }: SelectionPillsProps) {
  if (selections.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {selections.map(({ flowerId, count }) => {
        const flower = getFlowerById(flowerId);
        if (!flower) return null;

        return (
          <button
            key={flowerId}
            type="button"
            onClick={() => onRemove(flowerId)}
            className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/30 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-charcoal transition-all duration-200 hover:border-charcoal hover:bg-charcoal hover:text-cream"
            aria-label={`Remove one ${flower.name}`}
          >
            <span>{flower.name}</span>
            <span className="text-charcoal/40 group-hover:text-cream/60">x{count}</span>
            {/* Small close indicator */}
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className="ml-0.5 opacity-40"
            >
              <path
                d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
