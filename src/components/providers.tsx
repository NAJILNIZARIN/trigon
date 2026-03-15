"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { DataProvider } from "@/providers/DataProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DataProvider>
        {children}
        <Toaster position="top-right" />
      </DataProvider>
    </ThemeProvider>
  );
}
