export interface Department {
  id: string;
  name: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  departmentId: string;
  department?: Department;
}

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  category?: Category;
}

export interface Breakdown {
  id?: string;
  name: string;
  amount: number;
}

export interface Item {
  id: string;
  name: string;
  departmentId: string;
  categoryId: string;
  subCategoryId?: string;
  spec1?: string;
  spec2?: string;
  spec3?: string;
  unit: string;
  tags?: string;
  basePrice: number;
  margin: number;
  finalPrice: number;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  department?: Department;
  category?: Category;
  subCategory?: SubCategory;
  breakdowns?: Breakdown[];
}
