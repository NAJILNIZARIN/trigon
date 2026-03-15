import React, { useState } from "react";
import { CheckSquare, Clock, AlertTriangle, ChevronRight, MessageSquare, Plus, Loader2, Send } from "lucide-react";
import useSWR, { useSWRConfig } from "swr";
import toast from "react-hot-toast";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState<"assigned" | "history">("assigned");
  const { data: assignments, isLoading } = useSWR("/api/quotations", fetcher);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Work Assignments</h1>
          <p className="text-muted-foreground mt-1">Track your active projects and report daily progress.</p>
        </div>
        <div className="flex p-1 bg-muted/50 rounded-xl w-fit border border-border">
          <button 
            onClick={() => setActiveTab("assigned")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === "assigned" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            Active Tasks
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === "history" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            History
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="h-40 bg-card/50 border border-border rounded-2xl animate-pulse" />
        ) : (
          (assignments || []).map((q: any) => (
            <div key={q.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm group hover:border-primary/30 transition-colors">
              <div className="p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                      <CheckSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">{q.title}</h2>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Clock className="w-3 h-3" /> Assigned by {q.supervisor?.name} • {q.durationDays} Day Project
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 bg-muted/20 p-3 rounded-lg border border-border/50">
                    {q.description}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase">
                       Day {(q.progress?.length || 0) + 1} of {q.durationDays}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 uppercase">
                       Status: {q.status}
                    </div>
                  </div>
                </div>

                <div className="md:w-72 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Today's Action</h4>
                    <button 
                      onClick={() => setSelectedTask(q)}
                      className="w-full bg-primary text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                      <Plus className="w-4 h-4" /> Log Progress
                    </button>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1.5 hover:text-foreground cursor-pointer transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" /> {(q.comments?.length || 0)} Comments
                    </span>
                    <span className="flex items-center gap-1 hover:text-foreground cursor-pointer transition-colors">
                      View Hub <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="h-1.5 bg-muted flex">
                <div 
                  className="h-full bg-primary transition-all duration-1000" 
                  style={{ width: `${Math.min(100, ((q.progress?.length || 0) / q.durationDays) * 100)}%` }}
                />
              </div>
            </div>
          ))
        )}

        {(!assignments || assignments.length === 0) && !isLoading && (
          <div className="py-20 bg-muted/20 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-muted-foreground">
            <CheckSquare className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium text-lg">No active work assignments.</p>
            <p className="text-sm text-center max-w-xs">When a supervisor assigns you a project, it will appear here for daily reporting.</p>
          </div>
        )}
      </div>

      {selectedTask && (
        <ProgressModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
        />
      )}
    </div>
  );
}

function ProgressModal({ task, onClose }: { task: any, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { mutate } = useSWRConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quotationId: task.id,
          dayNumber: (task.progress?.length || 0) + 1,
          content,
        }),
      });

      if (res.ok) {
        toast.success("Progress logged successfully!");
        mutate("/api/quotations");
        onClose();
      } else {
        toast.error("Failed to log progress");
      }
    } catch (err) {
      toast.error("Error submitting report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in duration-300">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-foreground">Log Daily Progress</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{task.title} • Day {(task.progress?.length || 0) + 1}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Work Accomplished Today</label>
            <textarea 
               required
               autoFocus
               value={content}
               onChange={(e) => setContent(e.target.value)}
               className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 min-h-[150px] resize-none text-sm font-medium leading-relaxed"
               placeholder="Example: Completed base coat on the north wall. Cleaned up the site. Ready for second coat tomorrow."
            />
          </div>

          <div className="pt-2 flex gap-3">
             <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-border rounded-xl font-bold hover:bg-muted transition-all">Cancel</button>
             <button type="submit" disabled={loading} className="flex-[2] bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    <Send className="w-4 h-4" /> Submit Daily Report
                  </>
                )}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
