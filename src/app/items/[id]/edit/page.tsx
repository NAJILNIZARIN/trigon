"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ItemForm } from "@/components/items/ItemForm";
import { useData } from "@/providers/DataProvider";
import { Item } from "@/types";
import toast from "react-hot-toast";

export default function EditItemPage() {
  const { id } = useParams();
  const { departments, categories, subCategories } = useData();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/items/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) throw new Error(data.error);
          setItem(data);
        })
        .catch(err => {
          toast.error("Failed to fetch item details");
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <ItemForm 
        item={item}
        departments={departments}
        categories={categories}
        subCategories={subCategories}
      />
    </div>
  );
}
