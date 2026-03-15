"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, ListTree, FolderTree, LayoutDashboard, Layers, FileText, Briefcase, LogOut, CheckSquare } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;

  const allLinks = [
    { href: "/items", label: "Items", icon: Package, roles: ["ADMIN", "SUPERVISOR", "WORKER"] },
    { href: "/departments", label: "Departments", icon: FolderTree, roles: ["ADMIN", "SUPERVISOR"] },
    { href: "/categories", label: "Categories", icon: ListTree, roles: ["ADMIN", "SUPERVISOR"] },
    { href: "/sub-categories", label: "Sub-Categories", icon: Layers, roles: ["ADMIN", "SUPERVISOR"] },
    { href: "/reports", label: "Inventory Reports", icon: FileText, roles: ["ADMIN", "SUPERVISOR"] },
    { href: "/quotations", label: "Quotations", icon: Briefcase, roles: ["ADMIN", "SUPERVISOR"] },
    { href: "/work", label: "My Work", icon: CheckSquare, roles: ["ADMIN", "WORKER"] },
  ];

  const links = allLinks.filter(link => role ? link.roles.includes(role) : false);

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary hover:opacity-80 transition-opacity">
          <LayoutDashboard className="w-6 h-6" />
          <span>ERP System</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary font-medium shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
