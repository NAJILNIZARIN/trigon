import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useData } from "@/providers/DataProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Modern ERP",
  description: "Enterprise Resource Planning SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased text-foreground bg-background selection:bg-primary/20`}>
        <Providers>
          <LayoutContent>
            {children}
          </LayoutContent>
        </Providers>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
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
