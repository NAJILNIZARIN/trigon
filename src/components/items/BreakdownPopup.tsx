"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, X, Calculator, Hammer, Package, FileText } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Breakdown } from "@/types";

interface BreakdownPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialBreakdowns: Breakdown[];
  onSave: (breakdowns: Breakdown[], total: number) => void;
}

export function BreakdownPopup({ isOpen, onClose, initialBreakdowns, onSave }: BreakdownPopupProps) {
  const [breakdowns, setBreakdowns] = useState<Breakdown[]>([]);

  useEffect(() => {
    if (isOpen) {
      setBreakdowns(initialBreakdowns.length > 0 ? initialBreakdowns : []);
    }
  }, [isOpen, initialBreakdowns]);

  const addBreakdown = (category: string) => {
    setBreakdowns([...breakdowns, { name: category, amount: 0 }]);
  };

  const removeBreakdown = (index: number) => {
    setBreakdowns(breakdowns.filter((_, i) => i !== index));
  };

  const updateBreakdown = (index: number, field: keyof Breakdown, value: any) => {
    const updated = [...breakdowns];
    updated[index] = { ...updated[index], [field]: value };
    setBreakdowns(updated);
  };

  const totalCost = breakdowns.reduce((sum, b) => sum + (b.amount || 0), 0);

  const handleSave = () => {
    onSave(breakdowns, totalCost);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Components of Price Breakdown">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Labour Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Hammer className="w-4 h-4 text-primary" /> Labour
            </h3>
            <button 
              type="button"
              onClick={() => addBreakdown("Labour")}
              className="text-[10px] bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1 rounded-md flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Labour
            </button>
          </div>
          <div className="space-y-2">
            {breakdowns.map((b, i) => b.name.toLowerCase().includes("labour") && (
              <div key={i} className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-200">
                <input 
                  type="text"
                  value={b.name}
                  onChange={(e) => updateBreakdown(i, 'name', e.target.value)}
                  className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  placeholder="Labour Type"
                />
                <div className="flex items-center gap-2 w-1/3">
                  <span className="text-muted-foreground text-sm">$</span>
                  <input 
                    type="number"
                    min="0" step="0.01"
                    value={b.amount}
                    onChange={(e) => updateBreakdown(i, 'amount', parseFloat(e.target.value) || 0)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  />
                </div>
                <button 
                  onClick={() => removeBreakdown(i)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Material Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" /> Material
            </h3>
            <button 
              type="button"
              onClick={() => addBreakdown("Material")}
              className="text-[10px] bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1 rounded-md flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Material
            </button>
          </div>
          <div className="space-y-2">
            {breakdowns.map((b, i) => b.name.toLowerCase().includes("material") && (
              <div key={i} className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-200">
                <input 
                  type="text"
                  value={b.name}
                  onChange={(e) => updateBreakdown(i, 'name', e.target.value)}
                  className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  placeholder="Material Name"
                />
                <div className="flex items-center gap-2 w-1/3">
                  <span className="text-muted-foreground text-sm">$</span>
                  <input 
                    type="number"
                    min="0" step="0.01"
                    value={b.amount}
                    onChange={(e) => updateBreakdown(i, 'amount', parseFloat(e.target.value) || 0)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  />
                </div>
                <button 
                  onClick={() => removeBreakdown(i)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Description/Other Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> Other Costs
            </h3>
            <button 
              type="button"
              onClick={() => addBreakdown("Description")}
              className="text-[10px] bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1 rounded-md flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Description
            </button>
          </div>
          <div className="space-y-2">
            {breakdowns.map((b, i) => !b.name.toLowerCase().includes("labour") && !b.name.toLowerCase().includes("material") && (
              <div key={i} className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-200">
                <input 
                  type="text"
                  value={b.name}
                  onChange={(e) => updateBreakdown(i, 'name', e.target.value)}
                  className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  placeholder="Description"
                />
                <div className="flex items-center gap-2 w-1/3">
                  <span className="text-muted-foreground text-sm">$</span>
                  <input 
                    type="number"
                    min="0" step="0.01"
                    value={b.amount}
                    onChange={(e) => updateBreakdown(i, 'amount', parseFloat(e.target.value) || 0)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  />
                </div>
                <button 
                  onClick={() => removeBreakdown(i)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="h-px bg-border my-4" />

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex justify-between items-center shadow-inner">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            <span className="font-semibold text-primary/80">Total Cost:</span>
          </div>
          <span className="text-2xl font-black text-primary animate-in zoom-in-50 duration-300">${totalCost.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 text-sm font-bold rounded-lg shadow-lg active:scale-95 transition-all"
          >
            Apply Breakdown
          </button>
        </div>
      </div>
    </Modal>
  );
}
