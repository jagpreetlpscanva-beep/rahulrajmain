'use client';

import React, { useState, useEffect } from 'react';

interface GemPrice {
  caratOrWeight: string;
  price: number;
  quality?: string;
}

interface GemstoneItem {
  id: string;
  name: string;
  prices: GemPrice[];
}

interface SelectedGemstonePayload {
  gemstoneId: string;
  gemstoneName: string;
  selectedWeight: string;
  selectedPrice: number;
  quality?: string;
}

interface RemedyPickerProps {
  onSelectGemstone?: (gemstoneData: SelectedGemstonePayload) => void;
  initialValue?: SelectedGemstonePayload;
}

export default function RemedyPicker({ onSelectGemstone, initialValue }: RemedyPickerProps) {
  const [gemstones, setGemstones] = useState<GemstoneItem[]>([]);
  const [selectedGemId, setSelectedGemId] = useState<string>(initialValue?.gemstoneId || '');
  const [selectedPriceIdx, setSelectedPriceIdx] = useState<number>(0);

  useEffect(() => {
    async function loadGemstones() {
      try {
        const res = await fetch('/api/admin/gemstones');
        if (res.ok) {
          const data = await res.json();
          setGemstones(data);
        }
      } catch (err) {
        console.error('Failed to load gemstones in picker:', err);
      }
    }
    loadGemstones();
  }, []);

  const currentGem = gemstones.find((g) => g.id === selectedGemId);

  const handleGemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gemId = e.target.value;
    setSelectedGemId(gemId);
    setSelectedPriceIdx(0);

    const found = gemstones.find((g) => g.id === gemId);
    if (found && found.prices.length > 0 && onSelectGemstone) {
      onSelectGemstone({
        gemstoneId: found.id,
        gemstoneName: found.name,
        selectedWeight: found.prices[0].caratOrWeight,
        selectedPrice: found.prices[0].price,
        quality: found.prices[0].quality,
      });
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = parseInt(e.target.value, 10);
    setSelectedPriceIdx(idx);

    if (currentGem && currentGem.prices[idx] && onSelectGemstone) {
      const tier = currentGem.prices[idx];
      onSelectGemstone({
        gemstoneId: currentGem.id,
        gemstoneName: currentGem.name,
        selectedWeight: tier.caratOrWeight,
        selectedPrice: tier.price,
        quality: tier.quality,
      });
    }
  };

  return (
    <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 space-y-4">
      <h4 className="font-semibold text-amber-900 text-sm">Select Recommended Gemstone</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Gemstone</label>
          <select
            value={selectedGemId}
            onChange={handleGemChange}
            className="w-full text-sm border-amber-300 rounded-lg p-2 bg-white focus:ring-amber-500"
          >
            <option value="">-- Choose Gemstone --</option>
            {gemstones.map((gem) => (
              <option key={gem.id} value={gem.id}>
                {gem.name}
              </option>
            ))}
          </select>
        </div>

        {currentGem && currentGem.prices.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Select Weight & Price Tier</label>
            <select
              value={selectedPriceIdx}
              onChange={handlePriceChange}
              className="w-full text-sm border-amber-300 rounded-lg p-2 bg-white focus:ring-amber-500"
            >
              {currentGem.prices.map((priceOption, idx) => (
                <option key={idx} value={idx}>
                  {priceOption.caratOrWeight} - ₹{priceOption.price} {priceOption.quality ? `(${priceOption.quality})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
