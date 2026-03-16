"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useData } from "@/providers/DataProvider";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isValidating } = useData();
  const pathname = usePathname();

  // Don't show sidebar/header on the login page
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

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
