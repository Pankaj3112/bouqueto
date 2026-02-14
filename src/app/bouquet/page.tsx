"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import FlowerPicker from "@/components/FlowerPicker";
import BouquetCustomizer from "@/components/BouquetCustomizer";
import CardWriter from "@/components/CardWriter";
import { generateArrangement, generateGreenery } from "@/lib/arrangement";
import { greenerySets } from "@/data/greenery";
import type { ArrangementItem, GreeneryItem, FlowerSelection } from "@/lib/arrangement";

export default function BouquetBuilderPage() {
  const router = useRouter();
  const createBouquet = useMutation(api.bouquets.create);

  const [step, setStep] = useState(1);
  const [selectedFlowers, setSelectedFlowers] = useState<FlowerSelection[]>([]);
  const [arrangement, setArrangement] = useState<ArrangementItem[]>([]);
  const [greenery, setGreenery] = useState<GreeneryItem[]>([]);
  const [greeneryIndex, setGreeneryIndex] = useState(0);
  const [cardMessage, setCardMessage] = useState("");

  const handlePickerNext = useCallback(() => {
    const newArrangement = generateArrangement(selectedFlowers);
    const newGreenery = generateGreenery(greenerySets[greeneryIndex].images);
    setArrangement(newArrangement);
    setGreenery(newGreenery);
    setStep(2);
  }, [selectedFlowers, greeneryIndex]);

  const handleNewArrangement = useCallback(() => {
    // Add a random offset to the selections so we get a different arrangement
    const jitteredSelections: FlowerSelection[] = selectedFlowers.map((s) => ({
      ...s,
      count: s.count, // keep count the same
    }));
    // Shuffle the order to produce a different seed
    const shuffled = [...jitteredSelections].sort(() => Math.random() - 0.5);
    const newArrangement = generateArrangement(shuffled);
    const newGreenery = generateGreenery(greenerySets[greeneryIndex].images);
    setArrangement(newArrangement);
    setGreenery(newGreenery);
  }, [selectedFlowers, greeneryIndex]);

  const handleChangeGreenery = useCallback(() => {
    const nextIndex = (greeneryIndex + 1) % greenerySets.length;
    setGreeneryIndex(nextIndex);
    const newGreenery = generateGreenery(greenerySets[nextIndex].images);
    setGreenery(newGreenery);
  }, [greeneryIndex]);

  const handleSave = useCallback(async () => {
    const id = await createBouquet({
      flowers: selectedFlowers,
      arrangement: arrangement.map(({ x, y, rotation, scale, flowerId }) => ({
        x,
        y,
        rotation,
        scale,
        flowerId,
      })),
      greeneryStyle: greenerySets[greeneryIndex].id,
      cardMessage,
    });
    router.push(`/bouquet/${id}`);
  }, [createBouquet, selectedFlowers, arrangement, greeneryIndex, cardMessage, router]);

  return (
    <main className="min-h-screen bg-cream">
      {step === 1 && (
        <FlowerPicker
          selectedFlowers={selectedFlowers}
          onSelectionsChange={setSelectedFlowers}
          onNext={handlePickerNext}
        />
      )}
      {step === 2 && (
        <BouquetCustomizer
          selectedFlowers={selectedFlowers}
          arrangement={arrangement}
          greenery={greenery}
          greeneryStyle={greenerySets[greeneryIndex].id}
          onNewArrangement={handleNewArrangement}
          onChangeGreenery={handleChangeGreenery}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <CardWriter
          cardMessage={cardMessage}
          onMessageChange={setCardMessage}
          selectedFlowers={selectedFlowers}
          onBack={() => setStep(2)}
          onNext={handleSave}
        />
      )}
    </main>
  );
}
