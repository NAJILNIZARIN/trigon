"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Package, Search, Filter, AlertCircle, Eye, Calculator } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import Link from "next/link";
import { useData } from "@/providers/DataProvider";
import { Item } from "@/types";
import { BreakdownViewer } from "@/components/items/BreakdownViewer";

export default function ItemsPage() {
  const { items, itemsLoading, refreshItems, departments, categories, subCategories } = useData();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [itemForBreakdown, setItemForBreakdown] = useState<Item | null>(null);

  const refreshData = () => {
    refreshItems();
  };



  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      const res = await fetch(`/api/items/${selectedItem.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Item deleted!");
      setIsDeleteModalOpen(false);
      refreshData();
    } catch (err) {
      toast.error("An error occurred while deleting.");
    }
  };




  const filteredItems = items.filter((item: Item) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.department?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subCategory?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Items</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage products, pricing, and configurations.</p>
        </div>
        <Link 
          href="/items/new"
          className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          New Item
        </Link>
      </div>

      <div className="flex items-center gap-3 w-full max-w-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm shadow-sm"
          />
        </div>
        <button className="p-2 border border-border bg-card rounded-lg text-muted-foreground hover:bg-muted transition-colors shadow-sm">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden min-h-[400px]">
        {itemsLoading && items.length === 0 ? (
           <div className="p-12 flex flex-col items-center justify-center text-muted-foreground gap-3">
             <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
             <span className="text-sm font-medium">Loading items...</span>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Item Info</th>
                  <th className="px-6 py-4 font-medium">Spec 1</th>
                  <th className="px-6 py-4 font-medium">Spec 2</th>
                  <th className="px-6 py-4 font-medium">Spec 3</th>
                  <th className="px-6 py-4 font-medium">Unit</th>
                  <th className="px-6 py-4 font-medium">Hierarchy</th>
                  <th className="px-6 py-4 font-medium text-right">Price</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                  <th className="px-6 py-4 font-medium text-center">Breakdown</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground max-w-sm mx-auto">
                        <Package className="w-10 h-10 mb-4 text-muted/50" />
                        <h3 className="text-lg font-semibold text-foreground mb-1">No Items Found</h3>
                        <p className="text-sm text-center mb-4">You haven't added any items or none match your search criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Package className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">ID: {item.id.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-muted-foreground">{item.spec1 || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-muted-foreground">{item.spec2 || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-muted-foreground">{item.spec3 || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-muted px-2 py-1 rounded text-xs">{item.unit || 'Nos'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5 text-[10px] leading-tight">
                          <span className="text-primary font-medium truncate max-w-[100px]" title={item.department?.name}>D: {item.department?.name || '-'}</span>
                          <span className="text-muted-foreground truncate max-w-[100px]" title={item.category?.name}>C: {item.category?.name || '-'}</span>
                          <span className="text-muted-foreground/70 truncate max-w-[100px]" title={item.subCategory?.name}>S: {item.subCategory?.name || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-foreground">${(item.finalPrice || 0).toFixed(2)}</span>
                          <span className="text-[10px] text-muted-foreground">Base: ${(item.basePrice || 0).toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                          item.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                          item.status === 'Draft' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
                          'bg-slate-500/10 text-slate-600 border-slate-500/20'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => { setItemForBreakdown(item); setIsBreakdownModalOpen(true); }}
                          className={`p-2 rounded-lg transition-all ${
                            item.breakdowns && item.breakdowns.length > 0
                              ? "text-primary hover:bg-primary/10"
                              : "text-muted-foreground/30 cursor-not-allowed"
                          }`}
                          title={item.breakdowns && item.breakdowns.length > 0 ? "View Price Breakdown" : "No breakdown available"}
                          disabled={!item.breakdowns || item.breakdowns.length === 0}
                        >
                          <Calculator className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/items/${item.id}`} 
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors focus:opacity-100"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link 
                            href={`/items/${item.id}/edit`}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors focus:opacity-100"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => { setSelectedItem(item); setIsDeleteModalOpen(true); }}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors focus:opacity-100"
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
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Delete Item"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Are you sure you want to delete this item?</p>
              <p className="text-sm opacity-90">
                This item and all its associated cost breakdowns will be permanently deleted.
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

      <BreakdownViewer 
        isOpen={isBreakdownModalOpen} 
        onClose={() => setIsBreakdownModalOpen(false)} 
        item={itemForBreakdown} 
      />
    </div>
  );
}
