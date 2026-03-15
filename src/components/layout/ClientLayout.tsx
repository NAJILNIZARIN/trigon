"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useData } from "@/providers/DataProvider";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isValidating } = useData();
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Header />
        {/* Background Loading Progress Bar */}
        {isValidating && (
          <div className="absolute top-0 left-0 right-0 z-50 h-0.5 overflow-hidden">
            <div className="h-full bg-primary/60 animate-progress origin-left" />
          </div>
        )}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
