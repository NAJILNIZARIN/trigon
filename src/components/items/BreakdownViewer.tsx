import React from "react";
import { DollarSign, Briefcase, Package, Tag, Calculator } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Item, Breakdown } from "@/types";

interface BreakdownViewerProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
}

export function BreakdownViewer({ isOpen, onClose, item }: BreakdownViewerProps) {
  if (!item) return null;

  const breakdowns = item.breakdowns || [];
  
  // Categorize breakdowns if possible (heuristic based on common names used in BreakdownPopup)
  const labourCosts = breakdowns.filter(b => b.name.toLowerCase().includes('labour') || b.name.toLowerCase().includes('labor'));
  const materialCosts = breakdowns.filter(b => b.name.toLowerCase().includes('material'));
  const otherCosts = breakdowns.filter(b => 
    !b.name.toLowerCase().includes('labour') && 
    !b.name.toLowerCase().includes('labor') && 
    !b.name.toLowerCase().includes('material')
  );

  const total = breakdowns.reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Price Breakdown: ${item.name}`}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted/50 rounded-lg border border-border">
            <span className="text-xs text-muted-foreground block mb-1">Base Price</span>
            <span className="text-lg font-bold text-foreground">${item.basePrice.toFixed(2)}</span>
          </div>
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <span className="text-xs text-primary block mb-1">Calculated Total</span>
            <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {/* Labour section if exists */}
          {labourCosts.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3 h-3" /> Labour Costs
              </h4>
              <div className="space-y-1">
                {labourCosts.map((b, i) => (
                  <div key={i} className="flex justify-between items-center p-2.5 bg-card border border-border rounded-lg text-sm">
                    <span className="text-foreground">{b.name}</span>
                    <span className="font-medium">${b.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Materials section if exists */}
          {materialCosts.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3 h-3" /> Material Costs
              </h4>
              <div className="space-y-1">
                {materialCosts.map((b, i) => (
                  <div key={i} className="flex justify-between items-center p-2.5 bg-card border border-border rounded-lg text-sm">
                    <span className="text-foreground">{b.name}</span>
                    <span className="font-medium">${b.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other section if exists */}
          {otherCosts.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3 h-3" /> Other Costs
              </h4>
              <div className="space-y-1">
                {otherCosts.map((b, i) => (
                  <div key={i} className="flex justify-between items-center p-2.5 bg-card border border-border rounded-lg text-sm">
                    <span className="text-foreground">{b.name}</span>
                    <span className="font-medium">${b.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {breakdowns.length === 0 && (
            <div className="text-center py-8 bg-muted/20 rounded-xl border border-dashed border-border">
              <Calculator className="w-10 h-10 text-muted/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No breakdown details available for this item.</p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border flex justify-between items-center">
          <div className="text-sm">
            <span className="text-muted-foreground">Margin: </span>
            <span className="font-semibold text-foreground">{item.margin}%</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground block">Final Selling Price</span>
            <span className="text-xl font-bold text-foreground">${item.finalPrice.toFixed(2)}</span>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full py-2.5 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg transition-colors border border-border"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
