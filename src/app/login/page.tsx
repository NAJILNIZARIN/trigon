"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { LayoutDashboard, Mail, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/",
      });

      if (result?.error) {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Visual Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-md relative animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <LayoutDashboard className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">ERP System</h1>
          <p className="text-muted-foreground mt-2 font-medium">Please sign in to your account</p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@trigon.com"
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Password</label>
              <div className="relative group">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Continue to Dashboard"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/50 text-center space-y-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
              Secure Enterprise Access
            </p>
            <button 
              onClick={async () => {
                const res = await fetch("/api/auth/seed", { method: "POST" });
                const data = await res.json();
                if (data.success) toast.success("Test users seeded!");
                else toast.error("Seeding failed");
              }}
              className="text-[10px] text-muted-foreground/30 hover:text-muted-foreground transition-colors"
            >
              System Initialization
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          &copy; 2026 Trigon ERP. All rights reserved.
        </p>
      </div>
    </div>
  );
}
