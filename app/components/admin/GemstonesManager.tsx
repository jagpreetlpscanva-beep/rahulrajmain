'use client';

import React, { useState, useEffect } from 'react';

interface PriceOption {
  caratOrWeight: string;
  price: number;
  quality?: string;
}

interface Gemstone {
  id: string;
  name: string;
  prices: PriceOption[];
  active: boolean;
}

export default function GemstonesManager() {
  const [gemstones, setGemstones] = useState<Gemstone[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGem, setEditingGem] = useState<Partial<Gemstone> | null>(null);

  useEffect(() => {
    fetchGemstones();
  }, []);

  const fetchGemstones = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/gemstones');
      if (res.ok) {
        const data = await res.json();
        setGemstones(data);
      }
    } catch (err) {
      console.error('Failed to load gemstones:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingGem?.name) return;
    try {
      const res = await fetch('/api/admin/gemstones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingGem),
      });
      if (res.ok) {
        setEditingGem(null);
        fetchGemstones();
      }
    } catch (err) {
      console.error('Failed to save gemstone:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gemstone?')) return;
    try {
      const res = await fetch(`/api/admin/gemstones?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchGemstones();
      }
    } catch (err) {
      console.error('Failed to delete gemstone:', err);
    }
  };

  const addPriceTier = () => {
    if (!editingGem) return;
    const prices = editingGem.prices || [];
    setEditingGem({
      ...editingGem,
      prices: [...prices, { caratOrWeight: '', price: 0, quality: '' }],
    });
  };

  const updatePriceTier = (index: number, field: keyof PriceOption, value: any) => {
    if (!editingGem || !editingGem.prices) return;
    const updatedPrices = [...editingGem.prices];
    updatedPrices[index] = { ...updatedPrices[index], [field]: value };
    setEditingGem({ ...editingGem, prices: updatedPrices });
  };

  const removePriceTier = (index: number) => {
    if (!editingGem || !editingGem.prices) return;
    const updatedPrices = editingGem.prices.filter((_, i) => i !== index);
    setEditingGem({ ...editingGem, prices: updatedPrices });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-amber-900">Gemstone Pricing & Controls</h2>
        <button
          onClick={() => setEditingGem({ name: '', prices: [], active: true })}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700 font-medium"
        >
          + Add New Gemstone
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading gemstones...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gemstones.map((gem) => (
            <div key={gem.id} className="border border-amber-200 rounded-lg p-4 space-y-3 bg-amber-50/30">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-amber-900 text-lg">{gem.name}</h3>
                <div className="space-x-2">
                  <button
                    onClick={() => setEditingGem(gem)}
                    className="text-amber-700 hover:text-amber-900 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(gem.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase">Prices & Tiers:</p>
                {gem.prices && gem.prices.length > 0 ? (
                  <ul className="text-sm space-y-1">
                    {gem.prices.map((p, idx) => (
                      <li key={idx} className="flex justify-between text-gray-700 bg-white px-3 py-1.5 rounded border border-gray-100">
                        <span>{p.caratOrWeight} {p.quality ? `(${p.quality})` : ''}</span>
                        <span className="font-medium text-amber-900">₹{p.price}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400 italic">No pricing tiers defined.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {editingGem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-amber-900">
              {editingGem.id ? 'Edit Gemstone' : 'Add New Gemstone'}
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gemstone Name</label>
              <input
                type="text"
                value={editingGem.name || ''}
                onChange={(e) => setEditingGem({ ...editingGem, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g. Yellow Sapphire (Pukhraj)"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Price Options & Tiers</label>
                <button
                  type="button"
                  onClick={addPriceTier}
                  className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded hover:bg-amber-200"
                >
                  + Add Tier
                </button>
              </div>

              {(editingGem.prices || []).map((tier, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg border">
                  <input
                    type="text"
                    placeholder="Weight/Carat (e.g. 5 Ratti)"
                    value={tier.caratOrWeight}
                    onChange={(e) => updatePriceTier(idx, 'caratOrWeight', e.target.value)}
                    className="flex-1 border text-sm rounded px-2 py-1"
                  />
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    value={tier.price || ''}
                    onChange={(e) => updatePriceTier(idx, 'price', parseFloat(e.target.value) || 0)}
                    className="w-24 border text-sm rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="Quality"
                    value={tier.quality || ''}
                    onChange={(e) => updatePriceTier(idx, 'quality', e.target.value)}
                    className="w-24 border text-sm rounded px-2 py-1"
                  />
                  <button
                    type="button"
                    onClick={() => removePriceTier(idx)}
                    className="text-red-500 hover:text-red-700 font-bold px-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setEditingGem(null)}
                className="px-4 py-2 border text-gray-600 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700"
              >
                Save Gemstone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
