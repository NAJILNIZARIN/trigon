"use client";

import React, { useState } from "react";
import { PackageSearch, Plus, Search, Filter, Edit2, Trash2, Loader2, ListTree, FolderTree } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ItemsPage() {
  const { data: items, error, isLoading } = useSWR("/api/items", fetcher);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = (Array.isArray(items) ? items : []).filter((item: any) => 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.department?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Items Master</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Manage and organize your item inventory.</p>
        </div>
        <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5" /> Add New Item
        </button>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Search items by name, department, or category..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm placeholder:text-muted-foreground/60 shadow-sm"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-card/50 border border-border rounded-3xl animate-pulse" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item: any) => (
              <div key={item.id} className="bg-card border border-border p-6 rounded-3xl shadow-sm hover:border-primary/50 transition-all group relative overflow-hidden flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="p-3.5 bg-primary/10 rounded-2xl">
                    <ListTree className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2.5 bg-muted/50 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-2.5 bg-muted/50 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                
                <h3 className="font-bold text-xl text-foreground mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                
                <div className="space-y-3 mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium flex items-center gap-2"><FolderTree className="w-4 h-4 opacity-60" /> Department</span>
                    <span className="text-foreground font-bold">{item.department?.name || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium flex items-center gap-2"><Filter className="w-4 h-4 opacity-60" /> Category</span>
                    <span className="text-foreground font-bold">{item.category?.name || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-black text-primary">${item.finalPrice?.toFixed(2)}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20">
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-24 bg-card/40 border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center text-muted-foreground">
              <PackageSearch className="w-16 h-16 mb-6 opacity-20" />
              <p className="font-bold text-xl text-foreground/80">No results found</p>
              <p className="text-sm mt-1 max-w-xs text-center font-medium">Try adjusting your search query or check back later.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
