"use client";

import React, { createContext, useContext, ReactNode } from "react";
import useSWR, { mutate } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface DataContextType {
  items: any[];
  departments: any[];
  categories: any[];
  subCategories: any[];
  isLoading: boolean;
  isValidating: boolean;
  refreshItems: () => void;
  refreshAll: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { data: items = [], isLoading: itemsLoading, isValidating: itemsValidating } = useSWR("/api/items", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });
  
  const { data: departments = [], isLoading: deptsLoading, isValidating: deptsValidating } = useSWR("/api/departments", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
  
  const { data: categories = [], isLoading: catsLoading, isValidating: catsValidating } = useSWR("/api/categories", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
  
  const { data: subCategories = [], isLoading: subsLoading, isValidating: subsValidating } = useSWR("/api/sub-categories", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const isLoading = itemsLoading || deptsLoading || catsLoading || subsLoading;
  const isValidating = itemsValidating || deptsValidating || catsValidating || subsValidating; 


  const refreshItems = () => mutate("/api/items");
  const refreshAll = () => {
    mutate("/api/items");
    mutate("/api/departments");
    mutate("/api/categories");
    mutate("/api/sub-categories");
  };

  return (
    <DataContext.Provider value={{ 
      items, 
      departments, 
      categories, 
      subCategories, 
      isLoading,
      isValidating,
      refreshItems,
      refreshAll
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
