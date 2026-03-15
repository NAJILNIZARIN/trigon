"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, FolderTree, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";

interface Department {
  id: string;
  name: string;
  createdAt: string;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState({ name: "" });

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/departments");
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      toast.error("Failed to load departments.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Name is required");

    const isEdit = !!selectedDept;
    const url = isEdit ? `/api/departments/${selectedDept.id}` : "/api/departments";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save");
      
      toast.success(`Department ${isEdit ? "updated" : "created"}!`);
      setIsModalOpen(false);
      fetchDepartments();
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async () => {
    if (!selectedDept) return;
    try {
      const res = await fetch(`/api/departments/${selectedDept.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      
      toast.success("Department deleted!");
      setIsDeleteModalOpen(false);
      fetchDepartments();
    } catch (err) {
      toast.error("An error occurred while deleting.");
    }
  };

  const openEdit = (dept: Department) => {
    setSelectedDept(dept);
    setFormData({ name: dept.name });
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setSelectedDept(null);
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  const openDelete = (dept: Department) => {
    setSelectedDept(dept);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage company departments and branch categories.</p>
        </div>
        <button 
          onClick={openCreate}
          className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          New Department
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-muted-foreground gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading departments...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Department Name</th>
                  <th className="px-6 py-4 font-medium">Created At</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {departments.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground max-w-sm mx-auto">
                        <FolderTree className="w-10 h-10 mb-4 text-muted/50" />
                        <h3 className="text-lg font-semibold text-foreground mb-1">No Departments</h3>
                        <p className="text-sm text-center mb-4">You haven't added any departments yet. Create one to get started.</p>
                        <button onClick={openCreate} className="text-primary font-medium hover:underline">
                          Create Department
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  departments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <FolderTree className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-foreground text-sm">{dept.name}</span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(dept.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openEdit(dept)}
                            className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors focus:opacity-100"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openDelete(dept)}
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
        title={selectedDept ? "Edit Department" : "New Department"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Department Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              placeholder="e.g. Sales, Engineering..."
              autoFocus
            />
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
              {selectedDept ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Delete Department"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Are you sure you want to delete this department?</p>
              <p className="text-sm opacity-90">
                This action cannot be undone. All child categories and items may be unlinked or deleted per database cascading rules.
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
