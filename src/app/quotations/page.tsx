"use client";

import React, { useState, useEffect } from "react";
import { Plus, Briefcase, Calendar, Users, ArrowRight, Loader2, MessageSquare, Clock } from "lucide-react";
import useSWR, { useSWRConfig } from "swr";
import toast from "react-hot-toast";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function QuotationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: quotations, isLoading } = useSWR("/api/quotations", fetcher);
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Quotations</h1>
          <p className="text-muted-foreground mt-1">Manage project estimates and worker assignments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" /> Create Quotation
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-card/50 border border-border rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(quotations || []).map((q: any) => (
            <div key={q.id} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:border-primary/50 transition-colors group relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-3 bg-primary/10 text-primary rounded-bl-xl font-bold text-xs">
                {q.durationDays} Days
              </div>
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{q.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{q.description}</p>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-border mt-auto">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" /> Workers
                  </span>
                  <span className="font-medium">{(q.assignedWorkers || []).length} Assigned</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" /> Status
                  </span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${q.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {q.status}
                  </span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                    <span>Overall Progress</span>
                    <span>{Math.min(100, Math.round(((q.progress?.length || 0) / q.durationDays) * 100))}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-1000" 
                      style={{ width: `${Math.min(100, ((q.progress?.length || 0) / q.durationDays) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button className="flex-1 bg-muted hover:bg-muted/80 text-foreground py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" /> List
                </button>
                <button className="flex-1 bg-primary/10 text-primary py-2 rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2">
                   Track <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {(!quotations || quotations.length === 0) && (
            <div className="col-span-full py-20 bg-muted/20 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-muted-foreground">
              <Briefcase className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium text-lg">No active quotations found.</p>
              <p className="text-sm">Click the button above to start a new project.</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && <QuotationModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

function QuotationModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [days, setDays] = useState(1);
  const [desc, setDesc] = useState("");
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const { mutate } = useSWRConfig();
  
  const { data: workers } = useSWR("/api/users/workers", fetcher);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWorkers.length === 0) {
      toast.error("Please assign at least one worker");
      return;
    }
    setLoading(true);
    
    try {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: desc,
          durationDays: days,
          workerIds: selectedWorkers,
        }),
      });

      if (res.ok) {
        toast.success("Quotation created and workers notified!");
        mutate("/api/quotations");
        onClose();
      } else {
        toast.error("Failed to create quotation");
      }
    } catch (err) {
      toast.error("Error creating quotation");
    } finally {
      setLoading(false);
    }
  };

  const toggleWorker = (id: string) => {
    setSelectedWorkers(prev => 
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in duration-300">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-foreground">Prepare New Quotation</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Project Title</label>
            <input 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 font-medium"
              placeholder="e.g. Interior Painting - Office Floor 2"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-sm font-medium">Duration (Days)</label>
                <input 
                  type="number"
                  min={1}
                  required
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                />
             </div>
             <div className="space-y-1">
                <label className="text-sm font-medium">Status</label>
                <select className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 font-medium">
                  <option>Draft</option>
                  <option selected>Ready to Start</option>
                  <option>High Priority</option>
                </select>
             </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Worker Assignment</label>
            <div className="border border-border rounded-xl p-3 max-h-40 overflow-y-auto bg-muted/10 space-y-2">
              {(workers || []).map((w: any) => (
                <label key={w.id} className="flex items-center gap-3 p-2 hover:bg-primary/10 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-primary/20">
                  <input 
                    type="checkbox" 
                    checked={selectedWorkers.includes(w.id)}
                    onChange={() => toggleWorker(w.id)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer" 
                  />
                  <div className="flex-1">
                    <div className="text-sm font-bold">{w.name}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{w.specialty || "General Worker"}</div>
                  </div>
                </label>
              ))}
              {(!workers || workers.length === 0) && (
                <div className="text-center py-4 text-xs text-muted-foreground italic">
                  Loading available staff...
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Job Description</label>
            <textarea 
               value={desc}
               onChange={(e) => setDesc(e.target.value)}
               className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px] resize-none text-sm"
               placeholder="Detail the work requirements..."
            />
          </div>

          <div className="pt-4 flex gap-3">
             <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-border rounded-xl font-bold hover:bg-muted transition-all">Cancel</button>
             <button type="submit" disabled={loading} className="flex-[2] bg-primary text-white py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Dispatch Project"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
