"use client";

import React, { useState } from "react";

const GEMSTONE_PRICES: Record<string, number[]> = {
  Moonga: [8000, 12000, 14000, 20000, 25000, 28000],
  Moti: [2500, 4500, 6500, 11500, 18000, 22000],
  Manik: [4500, 8500, 12000, 16500, 22500, 27000, 35000, 41000],
  Gomed: [5500, 8500, 12000, 15000, 20000],
  Neelam: [60000, 100000, 110000, 120000],
  "Neelam Upratna": [4000, 6000, 8000, 11000],
  Pukhraj: [60000, 80000, 100000, 130000, 150000],
  "Pukhraj Upratna": [3500, 4500, 5500, 6000],
  Opal: [15000, 25000, 30000, 35000, 40000],
  "Opal Upratna": [5500, 6500, 7000],
  Lahsuniya: [3000, 4500, 5500, 7500, 11000],
};

export default function GemstoneForm() {
  const [selectedGem, setSelectedGem] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<string>("");

  const handleGemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGem(e.target.value);
    setSelectedPrice("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGem || !selectedPrice) {
      alert("Please select both gemstone and price rate!");
      return;
    }
    alert(`Selected: ${selectedGem} - ₹${Number(selectedPrice).toLocaleString("en-IN")}`);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Astrologer Gemstone Recommendation</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Select Gemstone:
          </label>
          <select
            value={selectedGem}
            onChange={handleGemChange}
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="">-- Choose Gemstone --</option>
            {Object.keys(GEMSTONE_PRICES).map((gem) => (
              <option key={gem} value={gem}>
                {gem}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Select Rate (₹):
          </label>
          <select
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
            disabled={!selectedGem}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: !selectedGem ? "#e9ecef" : "#fff",
            }}
          >
            <option value="">-- Choose Rate --</option>
            {selectedGem &&
              GEMSTONE_PRICES[selectedGem].map((price, index) => (
                <option key={index} value={price}>
                  ₹{price.toLocaleString("en-IN")}
                </option>
              ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!selectedGem || !selectedPrice}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: selectedGem && selectedPrice ? "#0070f3" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: selectedGem && selectedPrice ? "pointer" : "not-allowed",
          }}
        >
          Save Selection
        </button>
      </form>
    </div>
  );
}
