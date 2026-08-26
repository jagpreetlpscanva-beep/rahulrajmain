"use client";

import React, { useState, useEffect } from "react";

export interface GemstoneMaster {
  _id?: string;
  name: string;
  planet: string;
  rati: string;
  grade: string;
  mantra: string;
  day: string;
  finger: string;
  prices: number[];
}

export interface PrescriptionGemstoneItem {
  gemstoneName: string;
  planet: string;
  rati: string;
  grade: string;
  mantra: string;
  day: string;
  finger: string;
  selectedPrice: number | string;
}

interface GemstoneFormProps {
  onAddGemstone?: (gemstone: PrescriptionGemstoneItem) => void;
}

export default function GemstoneForm({ onAddGemstone }: GemstoneFormProps) {
  const [gemstoneMasters, setGemstoneMasters] = useState<GemstoneMaster[]>([]);
  const [availablePrices, setAvailablePrices] = useState<number[]>([]);
  
  // Selected Gemstone Form Data (All Editable)
  const [selectedGemstone, setSelectedGemstone] = useState<PrescriptionGemstoneItem>({
    gemstoneName: "",
    planet: "",
    rati: "",
    grade: "",
    mantra: "",
    day: "",
    finger: "",
    selectedPrice: "",
  });

  // Fetch admin configured gemstones on load
  useEffect(() => {
    fetch("/api/admin/gemstones")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setGemstoneMasters(data);
      })
      .catch((err) => console.error("Error fetching gemstones", err));
  }, []);

  // Handle Gemstone Selection & Autofill fields
  const handleSelectGemstone = (name: string) => {
    const master = gemstoneMasters.find((g) => g.name === name);
    if (master) {
      setSelectedGemstone({
        gemstoneName: master.name,
        planet: master.planet || "",
        rati: master.rati || "",
        grade: master.grade || "",
        mantra: master.mantra || "",
        day: master.day || "",
        finger: master.finger || "",
        selectedPrice: master.prices?.[0] || "",
      });
      setAvailablePrices(master.prices || []);
    } else {
      setSelectedGemstone({
        gemstoneName: name,
        planet: "",
        rati: "",
        grade: "",
        mantra: "",
        day: "",
        finger: "",
        selectedPrice: "",
      });
      setAvailablePrices([]);
    }
  };

  const handleAddField = () => {
    if (onAddGemstone) {
      onAddGemstone(selectedGemstone);
    }
  };

  return (
    <div className="bg-amber-50/50 p-4 border border-amber-200 rounded-xl space-y-4">
      <h3 className="font-bold text-amber-900 text-lg border-b border-amber-200 pb-2">
        Gemstone Recommendation (Prescription)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Select Gemstone Name */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Select Gemstone</label>
          <select
            value={selectedGemstone.gemstoneName}
            onChange={(e) => handleSelectGemstone(e.target.value)}
            className="w-full p-2 text-sm border rounded-md bg-white focus:ring-2 focus:ring-amber-500"
          >
            <option value="">-- Select Gemstone --</option>
            {gemstoneMasters.map((gem) => (
              <option key={gem._id || gem.name} value={gem.name}>
                {gem.name} ({gem.planet})
              </option>
            ))}
          </select>
        </div>

        {/* 2. Planet (Autofilled & Editable) */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Planet</label>
          <input
            type="text"
            value={selectedGemstone.planet}
            onChange={(e) => setSelectedGemstone({ ...selectedGemstone, planet: e.target.value })}
            placeholder="e.g. Sun"
            className="w-full p-2 text-sm border rounded-md bg-white"
          />
        </div>

        {/* 3. Rati (Autofilled & Editable) */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Rati / Weight</label>
          <input
            type="text"
            value={selectedGemstone.rati}
            onChange={(e) => setSelectedGemstone({ ...selectedGemstone, rati: e.target.value })}
            placeholder="e.g. 5.25 Rati"
            className="w-full p-2 text-sm border rounded-md bg-white"
          />
        </div>

        {/* 4. Grade / Quality (Autofilled & Editable) */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Grade</label>
          <input
            type="text"
            value={selectedGemstone.grade}
            onChange={(e) => setSelectedGemstone({ ...selectedGemstone, grade: e.target.value })}
            placeholder="e.g. Natural"
            className="w-full p-2 text-sm border rounded-md bg-white"
          />
        </div>

        {/* 5. Wearing Day (Autofilled & Editable) */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Day to Wear</label>
          <input
            type="text"
            value={selectedGemstone.day}
            onChange={(e) => setSelectedGemstone({ ...selectedGemstone, day: e.target.value })}
            placeholder="e.g. Sunday Morning"
            className="w-full p-2 text-sm border rounded-md bg-white"
          />
        </div>

        {/* 6. Finger (Autofilled & Editable) */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Finger</label>
          <input
            type="text"
            value={selectedGemstone.finger}
            onChange={(e) => setSelectedGemstone({ ...selectedGemstone, finger: e.target.value })}
            placeholder="e.g. Ring Finger"
            className="w-full p-2 text-sm border rounded-md bg-white"
          />
        </div>

        {/* 7. Price Dropdown (Admin-configured multiple prices) */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Select Price (Admin Prices)</label>
          <select
            value={selectedGemstone.selectedPrice}
            onChange={(e) => setSelectedGemstone({ ...selectedGemstone, selectedPrice: e.target.value })}
            className="w-full p-2 text-sm border rounded-md bg-white font-semibold text-green-700"
          >
            <option value="">-- Select Price --</option>
            {availablePrices.map((price, idx) => (
              <option key={idx} value={price}>
                ₹{price}
              </option>
            ))}
          </select>
        </div>

        {/* 8. Mantra (Autofilled & Editable) */}
        <div className="md:col-span-2 lg:col-span-4">
          <label className="block text-xs font-bold text-gray-700 mb-1">Chanting Mantra</label>
          <input
            type="text"
            value={selectedGemstone.mantra}
            onChange={(e) => setSelectedGemstone({ ...selectedGemstone, mantra: e.target.value })}
            placeholder="e.g. Om Suryaya Namah 108 Times"
            className="w-full p-2 text-sm border rounded-md bg-white"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleAddField}
          className="bg-amber-900 text-white px-5 py-2 rounded-md hover:bg-amber-950 font-bold text-sm"
        >
          Add Gemstone to Prescription
        </button>
      </div>
    </div>
  );
}
