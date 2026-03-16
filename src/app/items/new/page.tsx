"use client";

import React from "react";
import { ItemForm } from "@/components/items/ItemForm";
import { useData } from "@/providers/DataProvider";

export default function NewItemPage() {
  const { departments, categories, subCategories } = useData();

  return (
    <div className="container mx-auto py-8">
      <ItemForm 
        departments={departments}
        categories={categories}
        subCategories={subCategories}
      />
    </div>
  );
}
