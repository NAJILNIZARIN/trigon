"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Layers } from "lucide-react";
import toast from "react-hot-toast";
import { useData } from "@/providers/DataProvider";

interface Category {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  category: Category;
}

export default function SubCategoriesPage() {
  const { subCategories, categories, isLoading, refreshAll } = useData();
  const loading = isLoading && subCategories.length === 0;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [formData, setFormData] = useState({ name: "", categoryId: "" });

  const refreshData = () => {
    refreshAll();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingSubCategory;
    const url = isEdit ? `/api/sub-categories/${editingSubCategory.id}` : "/api/sub-categories";
    
    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save");
      }
      
      toast.success(`Sub-category ${isEdit ? "updated" : "created"}!`);
      setIsModalOpen(false);
      refreshData();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sub-Categories</h1>
          <p className="text-muted-foreground mt-1">Manage Level-3 hierarchy classifications.</p>
        </div>
        <button 
          onClick={() => {
            setEditingSubCategory(null);
            setFormData({ name: "", categoryId: "" });
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" /> New Sub-Category
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-4 text-sm font-semibold">Sub-Category Name</th>
                <th className="px-6 py-4 text-sm font-semibold">Parent Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subCategories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">No sub-categories found.</td>
                </tr>
              ) : (
                subCategories.map((sub) => (
                  <tr key={sub.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{sub.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/50 text-secondary-foreground text-xs font-medium border border-border">
                        <Layers className="w-3 h-3" /> {sub.category?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingSubCategory(sub);
                            setFormData({ name: sub.name, categoryId: sub.categoryId });
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-card w-full max-w-md rounded-xl shadow-2xl border border-border p-6 overflow-hidden">
            <h2 className="text-xl font-bold mb-4">{editingSubCategory ? "Edit" : "New"} Sub-Category</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                  placeholder="e.g. Core i9 Series"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Parent Category</label>
                <select 
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg hover:bg-muted font-medium transition-colors">Cancel</button>
                <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium shadow-lg shadow-primary/20 transition-all hover:opacity-90">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
