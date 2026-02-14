"use client";

import { flowers } from "@/data/flowers";
import FlowerCard from "@/components/FlowerCard";
import SelectionPills from "@/components/SelectionPills";

interface FlowerPickerProps {
  selectedFlowers: Array<{ flowerId: string; count: number }>;
  onSelectionsChange: (selections: Array<{ flowerId: string; count: number }>) => void;
  onNext: () => void;
}

const MIN_BLOOMS = 6;
const MAX_BLOOMS = 10;

export default function FlowerPicker({
  selectedFlowers,
  onSelectionsChange,
  onNext,
}: FlowerPickerProps) {
  const totalCount = selectedFlowers.reduce((sum, s) => sum + s.count, 0);
  const canProceed = totalCount >= MIN_BLOOMS;

  function handleSelectFlower(flowerId: string) {
    if (totalCount >= MAX_BLOOMS) return;

    const existing = selectedFlowers.find((s) => s.flowerId === flowerId);
    if (existing) {
      onSelectionsChange(
        selectedFlowers.map((s) =>
          s.flowerId === flowerId ? { ...s, count: s.count + 1 } : s
        )
      );
    } else {
      onSelectionsChange([...selectedFlowers, { flowerId, count: 1 }]);
    }
  }

  function handleRemoveFlower(flowerId: string) {
    const existing = selectedFlowers.find((s) => s.flowerId === flowerId);
    if (!existing) return;

    if (existing.count <= 1) {
      onSelectionsChange(selectedFlowers.filter((s) => s.flowerId !== flowerId));
    } else {
      onSelectionsChange(
        selectedFlowers.map((s) =>
          s.flowerId === flowerId ? { ...s, count: s.count - 1 } : s
        )
      );
    }
  }

  function getFlowerCount(flowerId: string): number {
    return selectedFlowers.find((s) => s.flowerId === flowerId)?.count ?? 0;
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center">
        {/* Decorative line */}
        <div className="mb-6 flex items-center justify-center gap-3" aria-hidden="true">
          <span className="block h-px w-8 bg-charcoal/20 sm:w-12" />
          <span className="block h-1 w-1 rounded-full bg-charcoal/30" />
          <span className="block h-px w-8 bg-charcoal/20 sm:w-12" />
        </div>

        <h2 className="font-mono text-sm uppercase tracking-[0.35em] text-charcoal sm:text-base">
          Pick {MIN_BLOOMS} to {MAX_BLOOMS} Blooms
        </h2>

        {/* Bloom counter */}
        <p className="mt-3 font-mono text-xs tracking-[0.2em] text-charcoal/50">
          {totalCount}/{MAX_BLOOMS} blooms selected
        </p>

        {/* Helper text */}
        {selectedFlowers.length > 0 && (
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-charcoal/40">
            Click on a flower&apos;s name to deselect it.
          </p>
        )}
      </div>

      {/* Flower grid */}
      <div className="grid grid-cols-2 place-items-center gap-y-8 gap-x-4 sm:grid-cols-3 lg:grid-cols-5">
        {flowers.map((flower) => (
          <FlowerCard
            key={flower.id}
            flower={flower}
            count={getFlowerCount(flower.id)}
            onSelect={() => handleSelectFlower(flower.id)}
          />
        ))}
      </div>

      {/* Selection pills */}
      {selectedFlowers.length > 0 && (
        <div className="mt-10">
          {/* Section divider */}
          <div className="mb-4 flex items-center gap-3" aria-hidden="true">
            <span className="block h-px flex-1 bg-charcoal/10" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-charcoal/30">
              Your selection
            </span>
            <span className="block h-px flex-1 bg-charcoal/10" />
          </div>

          <SelectionPills selections={selectedFlowers} onRemove={handleRemoveFlower} />
        </div>
      )}

      {/* Next button */}
      <div className="mt-12 flex justify-center">
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={`w-full max-w-xs py-4 text-center font-mono text-xs uppercase tracking-[0.3em] transition-all duration-200 ${
            canProceed
              ? "bg-charcoal text-cream hover:opacity-80"
              : "cursor-not-allowed bg-charcoal/20 text-charcoal/40"
          }`}
        >
          Next
        </button>
      </div>

      {/* Minimum blooms hint */}
      {!canProceed && totalCount > 0 && (
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-charcoal/40">
          Select at least {MIN_BLOOMS - totalCount} more bloom{MIN_BLOOMS - totalCount !== 1 ? "s" : ""}
        </p>
      )}
    </section>
  );
}
