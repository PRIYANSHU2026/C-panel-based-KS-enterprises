"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/data";
import { ProductCard } from "@/components/products/ProductCard";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import useCatalog from "@/lib/useCatalog";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  // Use the catalog hook to fetch products
  const { products: catalogProducts, loading, error, refetch } = useCatalog({
    category: selectedCategory
      ? categories.find(c => c.id === selectedCategory)?.name
      : undefined,
    subcategory: selectedSubcategory
      ? categories.find(c => c.id === selectedCategory)?.subcategories.find(s => s.id === selectedSubcategory)?.name
      : undefined
  });

  // Filter products based on selected category and subcategory
  const filteredProducts = catalogProducts;

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center mb-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-red-600">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <span className="text-gray-800 font-medium">Products</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-bold mb-4">Categories</h2>

              <div className="space-y-4">
                <div
                  className={`cursor-pointer text-sm ${!selectedCategory ? 'text-red-600 font-medium' : 'text-gray-600 hover:text-red-600'}`}
                  onClick={resetFilters}
                >
                  All Products
                </div>

                {categories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <div
                      className={`cursor-pointer text-sm ${selectedCategory === category.id ? 'text-red-600 font-medium' : 'text-gray-600 hover:text-red-600'}`}
                      onClick={() => {
                        setSelectedCategory(selectedCategory === category.id ? null : category.id);
                        setSelectedSubcategory(null);
                      }}
                    >
                      {category.name}
                    </div>

                    {selectedCategory === category.id && category.subcategories.length > 0 && (
                      <div className="ml-4 space-y-2 border-l border-gray-200 pl-3">
                        {category.subcategories.map((subcategory) => (
                          <div
                            key={subcategory.id}
                            className={`cursor-pointer text-xs ${selectedSubcategory === subcategory.id ? 'text-red-600 font-medium' : 'text-gray-500 hover:text-red-600'}`}
                            onClick={() => setSelectedSubcategory(selectedSubcategory === subcategory.id ? null : subcategory.id)}
                          >
                            {subcategory.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter Products
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Categories</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div
                    className={`cursor-pointer text-sm ${!selectedCategory ? 'text-red-600 font-medium' : 'text-gray-600'}`}
                    onClick={() => {
                      resetFilters();
                      document.querySelector('[data-dismiss]')?.click();
                    }}
                  >
                    All Products
                  </div>

                  {categories.map((category) => (
                    <div key={category.id} className="space-y-2">
                      <div
                        className={`cursor-pointer text-sm ${selectedCategory === category.id ? 'text-red-600 font-medium' : 'text-gray-600'}`}
                        onClick={() => {
                          setSelectedCategory(selectedCategory === category.id ? null : category.id);
                          setSelectedSubcategory(null);
                        }}
                      >
                        {category.name}
                      </div>

                      {selectedCategory === category.id && category.subcategories.length > 0 && (
                        <div className="ml-4 space-y-2 border-l border-gray-200 pl-3">
                          {category.subcategories.map((subcategory) => (
                            <div
                              key={subcategory.id}
                              className={`cursor-pointer text-xs ${selectedSubcategory === subcategory.id ? 'text-red-600 font-medium' : 'text-gray-500'}`}
                              onClick={() => {
                                setSelectedSubcategory(selectedSubcategory === subcategory.id ? null : subcategory.id);
                                document.querySelector('[data-dismiss]')?.click();
                              }}
                            >
                              {subcategory.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {selectedSubcategory
                  ? categories.find(c => c.id === selectedCategory)?.subcategories.find(s => s.id === selectedSubcategory)?.name
                  : selectedCategory
                    ? categories.find(c => c.id === selectedCategory)?.name
                    : "All Products"
                }
              </h1>
              <div className="text-sm text-gray-500">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                <span className="ml-2 text-gray-600">Loading products...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Error loading products</h3>
                <p className="mt-2 text-gray-500">{error}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => refetch()}
                >
                  Try Again
                </Button>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your filters or search term.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
