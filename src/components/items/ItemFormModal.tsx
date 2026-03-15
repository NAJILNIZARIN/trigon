"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calculator } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Item, Department, Category, SubCategory, Breakdown } from "@/types";



interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: Item | null;
  departments: Department[];
  categories: Category[];
  subCategories: SubCategory[];
}

export function ItemFormModal({ isOpen, onClose, onSuccess, item, departments, categories, subCategories }: ItemFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    departmentId: "",
    categoryId: "",
    subCategoryId: "",
    spec1: "",
    spec2: "",
    spec3: "",
    unit: "Nos",
    tags: "",
    basePrice: 0,
    margin: 0,
    status: "Active",
  });
  const [breakdowns, setBreakdowns] = useState<Breakdown[]>([]);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        departmentId: item.departmentId || "",
        categoryId: item.categoryId || "",
        subCategoryId: item.subCategoryId || "",
        spec1: item.spec1 || "",
        spec2: item.spec2 || "",
        spec3: item.spec3 || "",
        unit: item.unit || "Nos",
        tags: item.tags || "",
        basePrice: item.basePrice || 0,
        margin: item.margin || 0,
        status: item.status || "Active",
      });
      setBreakdowns(item.breakdowns ? item.breakdowns.map((b: Breakdown) => ({ name: b.name, amount: b.amount })) : []);
    } else {
      // Reset form for new item when modal opens without an item
      setFormData({
        name: "",
        departmentId: "",
        categoryId: "",
        subCategoryId: "",
        spec1: "",
        spec2: "",
        spec3: "",
        unit: "Nos",
        tags: "",
        basePrice: 0,
        margin: 0,
        status: "Active",
      });
      setBreakdowns([]);
    }
  }, [item, isOpen]);

  const finalPrice = formData.basePrice + (formData.basePrice * (formData.margin / 100));
  
  const filteredCategories = formData.departmentId 
    ? categories.filter(c => c.departmentId === formData.departmentId)
    : [];

  const filteredSubCategories = formData.categoryId
    ? subCategories.filter(s => s.categoryId === formData.categoryId)
    : [];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Item name is required");
    if (formData.basePrice < 0 || formData.margin < 0) return toast.error("Pricing cannot be negative");

    // Validate breakdowns
    for (const b of breakdowns) {
      if (!b.name.trim()) return toast.error("Breakdown name is required");
      if (b.amount < 0) return toast.error("Breakdown amount cannot be negative");
    }

    const isEdit = !!item;
    const url = isEdit ? `/api/items/${item.id}` : "/api/items";
    const method = isEdit ? "PUT" : "POST";

    const payload = {
      ...formData,
      finalPrice,
      breakdowns
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save item.");
      }
      toast.success(`Item ${isEdit ? "updated" : "created"} successfully!`);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  const addBreakdown = () => setBreakdowns([...breakdowns, { name: "", amount: 0 }]);
  const removeBreakdown = (index: number) => setBreakdowns(breakdowns.filter((_, i) => i !== index));
  const updateBreakdown = (index: number, field: keyof Breakdown, value: any) => {
    const updated = [...breakdowns];
    updated[index] = { ...updated[index], [field]: value };
    setBreakdowns(updated);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item ? "Edit Item" : "New Item"}>
      <form onSubmit={handleSave} className="space-y-5 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Item Name <span className="text-destructive">*</span></label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              placeholder="e.g. Mechanical Keyboard"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Department</label>
              <select
                value={formData.departmentId}
                onChange={(e) => {
                  setFormData({ ...formData, departmentId: e.target.value, categoryId: "", subCategoryId: "" });
                }}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              >
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => {
                  setFormData({ ...formData, categoryId: e.target.value, subCategoryId: "" });
                }}
                disabled={!formData.departmentId || filteredCategories.length === 0}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm disabled:opacity-50"
              >
                <option value="">Select Category</option>
                {filteredCategories.map((c: Category) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Sub-Category</label>
              <select
                value={formData.subCategoryId}
                onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value })}
                disabled={!formData.categoryId || filteredSubCategories.length === 0}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm disabled:opacity-50"
              >
                <option value="">Select Sub-Category</option>
                {filteredSubCategories.map((s: SubCategory) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              >
                <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
            </div>
          </div>

          <div className="h-px bg-border my-2" />

          {/* Specs */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Spec 1</label>
              <input 
                type="text" 
                value={formData.spec1}
                onChange={(e) => setFormData({ ...formData, spec1: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary text-xs"
                placeholder="e.g. 16GB"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Spec 2</label>
              <input 
                type="text" 
                value={formData.spec2}
                onChange={(e) => setFormData({ ...formData, spec2: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary text-xs"
                placeholder="e.g. DDR4"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Spec 3</label>
              <input 
                type="text" 
                value={formData.spec3}
                onChange={(e) => setFormData({ ...formData, spec3: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary text-xs"
                placeholder="e.g. RGB"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              >
                <option value="Nos">Nos</option>
                <option value="Set">Set</option>
                <option value="Kg">Kg</option>
                <option value="Box">Box</option>
                <option value="Mtr">Mtr</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Tags</label>
              <input 
                type="text" 
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                placeholder="e.g. premium, fast"
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-border my-4" />

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
            <Calculator className="w-4 h-4" /> Pricing & Margin
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Base Price ($)</label>
              <input 
                type="number" 
                min="0" step="0.01"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Margin (%)</label>
              <input 
                type="number" 
                min="0" step="0.1"
                value={formData.margin}
                onChange={(e) => setFormData({ ...formData, margin: parseFloat(e.target.value) || 0 })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex justify-between items-center">
            <span className="text-sm font-medium text-primary/80">Calculated Final Price:</span>
            <span className="text-lg font-bold text-primary">${finalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="h-px bg-border my-4" />

        {/* Breakdowns */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Cost Breakdowns</h3>
              <p className="text-xs text-muted-foreground">Optional components or charges.</p>
            </div>
            <button 
              type="button"
              onClick={addBreakdown}
              className="text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1.5 rounded-md flex items-center gap-1 font-medium transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Component
            </button>
          </div>
          
          <div className="space-y-2">
            {breakdowns.length === 0 ? (
              <div className="text-center p-4 border border-dashed border-border rounded-lg text-sm text-muted-foreground">
                No breakdowns added. Focus on base price.
              </div>
            ) : (
              breakdowns.map((b, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input 
                    type="text"
                    value={b.name}
                    placeholder="Component Name"
                    onChange={(e) => updateBreakdown(index, 'name', e.target.value)}
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  />
                  <div className="flex items-center gap-2 w-1/3">
                    <span className="text-muted-foreground text-sm">$</span>
                    <input 
                      type="number"
                      min="0" step="0.01"
                      value={b.amount}
                      onChange={(e) => updateBreakdown(index, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-full bg-background border border-border rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeBreakdown(index)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 sticky bottom-0 bg-card border-t border-border mt-4 py-2">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-all"
          >
            {item ? "Save Changes" : "Create Item"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
