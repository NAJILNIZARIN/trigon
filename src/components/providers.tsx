"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { DataProvider } from "@/providers/DataProvider";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <DataProvider>
          {children}
          <Toaster position="top-right" />
        </DataProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
