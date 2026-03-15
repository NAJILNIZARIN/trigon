"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ListTree, AlertCircle, FolderTree } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { useData } from "@/providers/DataProvider";

interface Department {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  createdAt: string;
  departmentId: string;
  department: Department;
}

export default function CategoriesPage() {
  const { categories, departments, isLoading, refreshAll } = useData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  
  const [formData, setFormData] = useState({ name: "", departmentId: "" });

  const refreshData = () => {
    refreshAll();
  };



  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.departmentId) {
      return toast.error("Name and Department are required");
    }

    const isEdit = !!selectedCat;
    const url = isEdit ? `/api/categories/${selectedCat.id}` : "/api/categories";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save");
      }
      
      toast.success(`Category ${isEdit ? "updated" : "created"}!`);
      setIsModalOpen(false);
      refreshData();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  const handleDelete = async () => {
    if (!selectedCat) return;
    try {
      const res = await fetch(`/api/categories/${selectedCat.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      
      toast.success("Category deleted!");
      setIsDeleteModalOpen(false);
      refreshData();
    } catch (err) {
      toast.error("An error occurred while deleting.");
    }
  };

  const openEdit = (cat: Category) => {
    setSelectedCat(cat);
    setFormData({ name: cat.name, departmentId: cat.departmentId });
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setSelectedCat(null);
    setFormData({ name: "", departmentId: departments.length > 0 ? departments[0].id : "" });
    setIsModalOpen(true);
  };

  const openDelete = (cat: Category) => {
    setSelectedCat(cat);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-1 text-sm">Organize items by department categories.</p>
        </div>
        <button 
          onClick={openCreate}
          className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all shadow-sm active:scale-95"
          disabled={isLoading || departments.length === 0}
          title={!isLoading && departments.length === 0 ? "Create a department first" : ""}
        >
          <Plus className="w-4 h-4" />
          New Category
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {isLoading && categories.length === 0 ? (
           <div className="p-12 flex flex-col items-center justify-center text-muted-foreground gap-3">
             <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
             <span className="text-sm font-medium">Loading categories...</span>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Category Name</th>
                  <th className="px-6 py-4 font-medium">Department</th>
                  <th className="px-6 py-4 font-medium">Created At</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground max-w-sm mx-auto">
                        <ListTree className="w-10 h-10 mb-4 text-muted/50" />
                        <h3 className="text-lg font-semibold text-foreground mb-1">No Categories</h3>
                        <p className="text-sm text-center mb-4">You haven't added any categories yet. Create one to get started.</p>
                        {departments.length === 0 ? (
                          <span className="text-xs text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">Please create a Department first</span>
                        ) : (
                          <button onClick={openCreate} className="text-primary font-medium hover:underline">
                            Create Category
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <ListTree className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-foreground text-sm">{cat.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent text-accent-foreground text-xs font-medium border border-border">
                          <FolderTree className="w-3 h-3 text-muted-foreground" />
                          {cat.department?.name || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(cat.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openEdit(cat)}
                            className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors focus:opacity-100"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openDelete(cat)}
                            className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors focus:opacity-100"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedCat ? "Edit Category" : "New Category"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              placeholder="e.g. Laptops, Chairs..."
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Department</label>
            <div className="relative">
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm appearance-none"
              >
                <option value="" disabled>Select a department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-all"
            >
              {selectedCat ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Delete Category"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Are you sure you want to delete this category?</p>
              <p className="text-sm opacity-90">
                This action cannot be undone. Items within this category may be unlinked temporarily until assigned a new one.
              </p>
            </div>
          </div>
          <div className="pt-2 flex items-center justify-end gap-3">
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-all"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
