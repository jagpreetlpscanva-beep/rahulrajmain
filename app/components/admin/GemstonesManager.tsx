"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";

export interface Gemstone {
  _id?: string;
  name: string;
  planet: string;
  rati: string;
  grade: string;
  mantra: string;
  day: string;
  finger: string;
  prices: number[]; // Multiple price options added by admin
}

const DEFAULT_GEMSTONE: Gemstone = {
  name: "",
  planet: "",
  rati: "",
  grade: "",
  mantra: "",
  day: "",
  finger: "",
  prices: [1100, 2100, 5100],
};

export default function GemstonesManager() {
  const [gemstones, setGemstones] = useState<Gemstone[]>([]);
  const [formData, setFormData] = useState<Gemstone>(DEFAULT_GEMSTONE);
  const [priceInput, setPriceInput] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchGemstones();
  }, []);

  const fetchGemstones = async () => {
    try {
      const res = await fetch("/api/admin/gemstones");
      const data = await res.json();
      if (Array.isArray(data)) setGemstones(data);
    } catch (err) {
      console.error("Failed to load gemstones", err);
    }
  };

  const handleAddPrice = () => {
    const val = parseFloat(priceInput);
    if (!isNaN(val) && val > 0) {
      setFormData({ ...formData, prices: [...formData.prices, val] });
      setPriceInput("");
    }
  };

  const handleRemovePrice = (index: number) => {
    const updated = formData.prices.filter((_, i) => i !== index);
    setFormData({ ...formData, prices: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/gemstones", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { ...formData, _id: editingId } : formData),
      });

      if (res.ok) {
        fetchGemstones();
        setFormData(DEFAULT_GEMSTONE);
        setEditingId(null);
      }
    } catch (err) {
      console.error("Failed to save gemstone", err);
    }
  };

  const handleEdit = (gem: Gemstone) => {
    setEditingId(gem._id || null);
    setFormData({ ...gem, prices: gem.prices || [] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/admin/gemstones?id=${id}`, { method: "DELETE" });
      fetchGemstones();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-amber-900">Gemstones Master Settings</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-amber-50/40">
        <div>
          <label className="block text-sm font-semibold mb-1">Gemstone Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Ruby (Manikyam)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Planet (Grah)</label>
          <input
            type="text"
            required
            placeholder="e.g. Sun (Surya)"
            value={formData.planet}
            onChange={(e) => setFormData({ ...formData, planet: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Rati / Weight</label>
          <input
            type="text"
            placeholder="e.g. 5.25 - 7 Rati"
            value={formData.rati}
            onChange={(e) => setFormData({ ...formData, rati: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Grade / Quality</label>
          <input
            type="text"
            placeholder="e.g. Natural / Unheated"
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Wearing Day</label>
          <input
            type="text"
            placeholder="e.g. Sunday Morning"
            value={formData.day}
            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Wearing Finger</label>
          <input
            type="text"
            placeholder="e.g. Ring Finger (Right Hand)"
            value={formData.finger}
            onChange={(e) => setFormData({ ...formData, finger: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">Mantra</label>
          <input
            type="text"
            placeholder="e.g. Om Suryaya Namah (108 times)"
            value={formData.mantra}
            onChange={(e) => setFormData({ ...formData, mantra: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Dynamic Multiple Price Section */}
        <div className="md:col-span-2 border-t pt-3">
          <label className="block text-sm font-semibold mb-1">Add Dynamic Prices (Admin Multiple Prices)</label>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="Enter price (e.g. 3500)"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              className="p-2 border rounded-md flex-1"
            />
            <button
              type="button"
              onClick={handleAddPrice}
              className="bg-amber-800 text-white px-4 py-2 rounded-md hover:bg-amber-900"
            >
              Add Price
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.prices.map((p, idx) => (
              <span key={idx} className="bg-amber-200 text-amber-950 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                ₹{p}
                <button type="button" onClick={() => handleRemovePrice(idx)} className="text-red-600 font-bold hover:text-red-800">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <button type="submit" className="w-full bg-amber-900 text-white py-2 rounded-md hover:bg-amber-950 font-bold">
            {editingId ? "Update Gemstone" : "Save Gemstone Master"}
          </button>
        </div>
      </form>

      {/* Gemstones List Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-amber-200">
          <thead>
            <tr className="bg-amber-100 text-amber-900">
              <th className="border p-2">Gemstone</th>
              <th className="border p-2">Planet</th>
              <th className="border p-2">Details</th>
              <th className="border p-2">Prices</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {gemstones.map((gem) => (
              <tr key={gem._id} className="text-center">
                <td className="border p-2 font-semibold">{gem.name}</td>
                <td className="border p-2">{gem.planet}</td>
                <td className="border p-2 text-sm text-left">
                  <div><b>Finger:</b> {gem.finger}</div>
                  <div><b>Day:</b> {gem.day}</div>
                  <div><b>Rati:</b> {gem.rati}</div>
                </td>
                <td className="border p-2">
                  {gem.prices?.map((p) => `₹${p}`).join(", ")}
                </td>
                <td className="border p-2 space-x-2">
                  <button onClick={() => handleEdit(gem)} className="p-1 text-blue-600 hover:text-blue-800">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(gem._id!)} className="p-1 text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
