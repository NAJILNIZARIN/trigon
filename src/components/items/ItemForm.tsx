"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calculator, Save, ArrowLeft, Info } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Item, Department, Category, SubCategory, Breakdown } from "@/types";
import { BreakdownPopup } from "./BreakdownPopup";

interface ItemFormProps {
  item?: Item | null;
  departments: Department[];
  categories: Category[];
  subCategories: SubCategory[];
}

export function ItemForm({ item, departments, categories, subCategories }: ItemFormProps) {
  const router = useRouter();
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
    description: "",
  });
  const [breakdowns, setBreakdowns] = useState<Breakdown[]>([]);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
        description: item.description || "",
      });
      setBreakdowns(item.breakdowns ? item.breakdowns.map((b: Breakdown) => ({ name: b.name, amount: b.amount })) : []);
    }
  }, [item]);

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
    
    setIsSaving(true);
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
      router.push("/items");
      router.refresh();
    } catch (err: unknown) {
      toast.error((err as Error).message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBreakdownSave = (updatedBreakdowns: Breakdown[], total: number) => {
    setBreakdowns(updatedBreakdowns);
    setFormData(prev => ({ ...prev, basePrice: total }));
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <form onSubmit={handleSave} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={() => router.back()}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{item ? "Edit Item" : "Create New Item"}</h1>
              <p className="text-muted-foreground text-sm">Configure item details, hierarchy, and pricing.</p>
            </div>
          </div>
          <button 
            type="submit"
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {item ? "Save Changes" : "Create Item"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Information Card */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                <Info className="w-5 h-5" />
                <h2>Basic Information</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Item Name <span className="text-destructive">*</span></label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    placeholder="e.g. Premium Mechanical Keyboard"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm min-h-[120px] resize-none"
                    placeholder="Detailed description of the item..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Spec 1</label>
                  <input 
                    type="text" 
                    value={formData.spec1}
                    onChange={(e) => setFormData({ ...formData, spec1: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    placeholder="e.g. 16GB"
                  />
                </div>
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Spec 2</label>
                  <input 
                    type="text" 
                    value={formData.spec2}
                    onChange={(e) => setFormData({ ...formData, spec2: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    placeholder="e.g. DDR4"
                  />
                </div>
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Spec 3</label>
                  <input 
                    type="text" 
                    value={formData.spec3}
                    onChange={(e) => setFormData({ ...formData, spec3: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    placeholder="e.g. RGB"
                  />
                </div>
              </div>
            </div>

            {/* Hierarchy & Status Card */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-primary font-semibold mb-6">
                <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <h2>Organization & Classification</h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Department</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => {
                      setFormData({ ...formData, departmentId: e.target.value, categoryId: "", subCategoryId: "" });
                    }}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm appearance-none"
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
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm disabled:opacity-50 appearance-none"
                  >
                    <option value="">Select Category</option>
                    {filteredCategories.map((c: Category) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Sub-Category</label>
                  <select
                    value={formData.subCategoryId}
                    onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value })}
                    disabled={!formData.categoryId || filteredSubCategories.length === 0}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm disabled:opacity-50 appearance-none"
                  >
                    <option value="">Select Sub-Category</option>
                    {filteredSubCategories.map((s: SubCategory) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Inventory Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Unit of Measure</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm appearance-none"
                  >
                    <option value="Nos">Nos</option>
                    <option value="Set">Set</option>
                    <option value="Kg">Kg</option>
                    <option value="Box">Box</option>
                    <option value="Mtr">Mtr</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Search Tags</label>
                  <input 
                    type="text" 
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    placeholder="e.g. premium, fast, 2024"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Sidebar */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-primary mb-6">
                <Calculator className="w-5 h-5" /> Pricing Summary
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <label>Base Price ($)</label>
                    <button 
                      type="button"
                      onClick={() => setIsBreakdownOpen(true)}
                      className="text-[10px] text-primary hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Breakdown
                    </button>
                  </div>
                  <input 
                    type="number" 
                    min="0" step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-lg"
                  />
                  <p className="text-[10px] text-muted-foreground italic">
                    {breakdowns.length > 0 ? `${breakdowns.length} price components applied` : "No breakdown applied"}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Margin percentage (%)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      min="0" step="0.1"
                      value={formData.margin}
                      onChange={(e) => setFormData({ ...formData, margin: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-lg"
                    />
                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center font-bold text-muted-foreground mr-1 shrink-0">%</div>
                  </div>
                </div>

                <div className="h-px bg-border my-2" />

                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Final Customer Price</span>
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col items-center justify-center gap-1 shadow-inner">
                    <span className="text-3xl font-black text-primary animate-in zoom-in-50 duration-500">${finalPrice.toFixed(2)}</span>
                    <span className="text-[10px] text-primary/60 font-medium">Tax excluded</span>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => setIsBreakdownOpen(true)}
                  className="w-full py-3 border border-dashed border-primary/30 text-primary hover:bg-primary/5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4" /> Edit Breakdown
                </button>
              </div>
            </div>
            
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                Tip: Use the price breakdown tool to accurately calculate costs for labour and materials. This helps maintain healthy margins.
              </p>
            </div>
          </div>
        </div>
      </form>

      <BreakdownPopup 
        isOpen={isBreakdownOpen}
        onClose={() => setIsBreakdownOpen(false)}
        initialBreakdowns={breakdowns}
        onSave={handleBreakdownSave}
      />
    </div>
  );
}
