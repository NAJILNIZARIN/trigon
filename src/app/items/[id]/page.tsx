import { PrismaClient } from "@prisma/client";
import { ArrowLeft, Package, FolderTree, ListTree, Calculator, Hash, Calendar, Layers } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// In production, instantiate prisma safely. For this Next.js local setup it's acceptable.
const prisma = new PrismaClient();

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      department: true,
      category: true,
      breakdowns: true,
    }
  });

  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/items" className="p-2 bg-card border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
              {item.name}
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border tracking-normal ${
                item.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                item.status === 'Draft' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
                'bg-slate-500/10 text-slate-600 border-slate-500/20'
              }`}>
                {item.status}
              </span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1 flex items-center gap-4">
              <span className="flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" /> ID: {item.id.slice(-8).toUpperCase()}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Created {new Date(item.createdAt).toLocaleDateString()}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-primary">
              <Package className="w-5 h-5" /> Item Details
            </h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1 bg-muted/30 p-4 rounded-lg border border-border/50">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"><FolderTree className="w-4 h-4" /> Department</span>
                <p className="font-semibold text-foreground">{item.department?.name || 'Unassigned'}</p>
              </div>
              <div className="space-y-1 bg-muted/30 p-4 rounded-lg border border-border/50">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"><ListTree className="w-4 h-4" /> Category</span>
                <p className="font-semibold text-foreground">{item.category?.name || 'Unassigned'}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-primary">
                <Layers className="w-5 h-5" /> Cost Breakdowns
              </h2>
            </div>
            
            {item.breakdowns.length > 0 ? (
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-5 py-3.5 font-medium text-muted-foreground">Component</th>
                      <th className="px-5 py-3.5 font-medium text-muted-foreground text-right w-32">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {item.breakdowns.map((b) => (
                      <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3.5 font-medium">{b.name}</td>
                        <td className="px-5 py-3.5 text-right font-mono">${b.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="bg-primary/5 font-semibold">
                      <td className="px-5 py-4 text-primary">Total Components</td>
                      <td className="px-5 py-4 text-right text-primary font-mono text-base">
                        ${item.breakdowns.reduce((sum, b) => sum + b.amount, 0).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-border rounded-lg text-muted-foreground bg-muted/10">
                <Layers className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p>No breakdowns were recorded for this item.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden text-center flex flex-col items-center justify-center p-8 bg-gradient-to-b from-card to-primary/5 relative">
            <Calculator className="w-12 h-12 text-primary mb-4 opacity-10 absolute right-4 top-4" />
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Final Price</h3>
            <div className="text-5xl font-black text-foreground tracking-tighter drop-shadow-sm">
              ${item.finalPrice.toFixed(2)}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-5 relative overflow-hidden">
             
            <h3 className="font-semibold flex items-center gap-2">Pricing Configuration</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                <span className="text-muted-foreground text-sm font-medium">Base Price</span>
                <span className="font-semibold font-mono tracking-tight">${item.basePrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                <span className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">Margin Applied</span>
                <span className="font-semibold font-mono text-emerald-600 bg-emerald-400/20 px-2 py-0.5 rounded-md">+{item.margin}%</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border mt-2">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-muted-foreground">Calculated Value</span>
                <span className="font-mono text-muted-foreground">${(item.basePrice + (item.basePrice * (item.margin/100))).toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3 bg-muted py-2 rounded">
                Final Price = Base + (Base × Margin)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
