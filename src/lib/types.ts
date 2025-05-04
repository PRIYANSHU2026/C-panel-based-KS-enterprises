export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  subcategory: string;
  features?: string[];
  specifications?: Record<string, string>;
  inStock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonUrl: string;
}

// New interfaces for admin portal

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  roleId: number;
  role?: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Warranty {
  id: number;
  productId: string;
  customerId: number;
  serialNumber?: string;
  purchaseDate: string;
  expirationDate: string;
  notes?: string;
  product?: Product;
  customer?: Customer;
  createdAt: string;
  updatedAt: string;
}
