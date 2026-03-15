"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Search, Bell, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10 w-full shrink-0">
      <div className="flex-1 flex items-center max-w-md bg-muted/50 rounded-full px-4 py-2 border border-border/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search entire system..."
          className="bg-transparent border-none outline-none ml-2 text-sm w-full placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex items-center gap-4 ml-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
        >
          {mounted && theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-medium shadow-sm">
          <UserCircle className="w-6 h-6" />
        </div>
      </div>
    </header>
  );
}
