"use client";

import React, { useState } from "react";
import { FileText, BarChart3, List, Search, Printer, Download } from "lucide-react";
import { useData } from "@/providers/DataProvider";
import { Item } from "@/types";

type ReportType = "everything" | "detailed" | "bulk";

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportType>("everything");
  const { items, isLoading } = useData();
  const [searchQuery, setSearchQuery] = useState("");



  const filteredItems = items.filter((item: Item) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.department?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subCategory?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Reports</h1>
          <p className="text-muted-foreground mt-1">Cross-sectional analysis of inventory and pricing.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-border bg-card rounded-lg text-muted-foreground hover:bg-muted transition-colors shadow-sm" title="Export CSV">
            <Download className="w-4 h-4" />
          </button>
          <button 
            onClick={() => window.print()}
            className="p-2 border border-border bg-card rounded-lg text-muted-foreground hover:bg-muted transition-colors shadow-sm" title="Print Report">
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Report Switcher */}
      <div className="flex p-1 bg-muted/50 rounded-xl w-fit border border-border">
        <button 
          onClick={() => setActiveReport("everything")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeReport === "everything" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          <List className="w-4 h-4" /> Everything Summary
        </button>
        <button 
          onClick={() => setActiveReport("detailed")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeReport === "detailed" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          <BarChart3 className="w-4 h-4" /> Detailed Price
        </button>
        <button 
          onClick={() => setActiveReport("bulk")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeReport === "bulk" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          <FileText className="w-4 h-4" /> Bulk Price
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 w-full max-w-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search report..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm shadow-sm"
          />
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden min-h-[400px]">
        {isLoading && items.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-muted-foreground gap-3">
             <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
             <span className="text-sm font-medium">Generating report...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {activeReport === "everything" && <EverythingTable items={filteredItems} />}
            {activeReport === "detailed" && <DetailedPriceTable items={filteredItems} />}
            {activeReport === "bulk" && <BulkPriceTable items={filteredItems} />}
          </div>
        )}
      </div>
    </div>
  );
}

function EverythingTable({ items }: { items: Item[] }) {
  return (
    <table className="w-full text-left text-xs whitespace-nowrap">
      <thead className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
        <tr>
          <th className="px-6 py-3 w-10">SI No</th>
          <th className="px-6 py-3">Dept</th>
          <th className="px-6 py-3">Category</th>
          <th className="px-6 py-3">Sub-Cat</th>
          <th className="px-6 py-3 text-foreground">Item Name & ID</th>
          <th className="px-6 py-3">Spec 1</th>
          <th className="px-6 py-3">Spec 2</th>
          <th className="px-6 py-3">Spec 3</th>
          <th className="px-6 py-3 text-right">Final Price</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {items.map((item, index) => (
          <tr key={item.id} className="hover:bg-muted/30 transition-colors">
            <td className="px-6 py-3 font-mono text-muted-foreground">{index + 1}</td>
            <td className="px-6 py-3 text-muted-foreground">{item.department?.name || "-"}</td>
            <td className="px-6 py-3 text-muted-foreground">{item.category?.name || "-"}</td>
            <td className="px-6 py-3 text-muted-foreground">{item.subCategory?.name || "-"}</td>
            <td className="px-6 py-3">
              <div className="font-medium text-foreground">{item.name}</div>
              <div className="text-[10px] text-muted-foreground uppercase opacity-70 tracking-widest">{item.id}</div>
            </td>
            <td className="px-6 py-3">{item.spec1 || "-"}</td>
            <td className="px-6 py-3">{item.spec2 || "-"}</td>
            <td className="px-6 py-3">{item.spec3 || "-"}</td>
            <td className="px-6 py-3 text-right font-bold">${(item.finalPrice || 0).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DetailedPriceTable({ items }: { items: Item[] }) {
  return (
    <table className="w-full text-left text-xs whitespace-nowrap">
      <thead className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
        <tr>
          <th className="px-6 py-3 w-10">SI No</th>
          <th className="px-6 py-3">Detailed Item Info</th>
          <th className="px-6 py-3 text-right">Base Cost</th>
          <th className="px-6 py-3">Breakdown Details</th>
          <th className="px-6 py-3 text-right">Margin %</th>
          <th className="px-6 py-3 text-right">Sales Price</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {items.map((item, index) => (
          <tr key={item.id} className="hover:bg-muted/30 transition-colors align-top">
            <td className="px-6 py-3 font-mono text-muted-foreground pt-4">{index + 1}</td>
            <td className="px-6 py-3">
              <div className="font-semibold text-foreground text-sm">{item.name}</div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-1">
                <span>{item.department?.name}</span>
                <span>•</span>
                <span>{item.category?.name}</span>
                {item.subCategory?.name && (
                  <>
                    <span>•</span>
                    <span>{item.subCategory.name}</span>
                  </>
                )}
              </div>
              <div className="text-[9px] font-mono text-muted-foreground/60 mt-0.5">{item.id}</div>
            </td>
            <td className="px-6 py-3 text-right font-medium">${(item.basePrice || 0).toFixed(2)}</td>
            <td className="px-6 py-3">
              <div className="flex flex-wrap gap-2 max-w-sm">
                {(Array.isArray(item.breakdowns) ? item.breakdowns : []).map((row: any, i: number) => (
                  <span key={i} className="bg-secondary/50 px-1.5 py-0.5 rounded text-[10px] border border-border">
                    {row.name}: ${row.amount}
                  </span>
                ))}
                {(!item.breakdowns || item.breakdowns.length === 0) && <span className="text-muted-foreground italic">No extra costs</span>}
              </div>
            </td>
            <td className="px-6 py-3 text-right text-emerald-600 font-bold">+{item.margin || 0}%</td>
            <td className="px-6 py-3 text-right font-black text-sm text-foreground">${(item.finalPrice || 0).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function BulkPriceTable({ items }: { items: Item[] }) {
  // Simple grouping by category for bulk view
  const categories = Array.from(new Set(items.map(i => i.category?.name || "Uncategorized")));

  return (
    <div className="p-6 space-y-8">
      {categories.map(cat => (
        <div key={cat} className="space-y-4">
          <h2 className="text-lg font-bold border-l-4 border-primary pl-3">{cat}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.filter(i => (i.category?.name || "Uncategorized") === cat).map(item => (
              <div key={item.id} className="p-4 border border-border rounded-lg bg-card/30 flex justify-between items-center group hover:border-primary/50 transition-colors">
                <div>
                  <div className="text-sm font-bold">{item.name}</div>
                  <div className="text-[10px] text-muted-foreground">{item.spec1} {item.spec2} {item.spec3}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-primary">${(item.finalPrice || 0).toFixed(2)}</div>
                  <div className="text-[9px] uppercase tracking-tighter text-muted-foreground italic">Per {item.unit || "Nos"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
