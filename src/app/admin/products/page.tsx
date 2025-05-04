"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "../../../lib/types";
import {
  Search, Plus, Edit2, Trash2, Filter,
  ArrowDown, ArrowUp, RefreshCw, X
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Load search parameters from URL
  useEffect(() => {
    const page = searchParams.get("page");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const order = searchParams.get("order");
    const category = searchParams.get("category");

    if (page) setCurrentPage(parseInt(page));
    if (search) setSearchTerm(search);
    if (sort) setSortBy(sort);
    if (order) setSortOrder(order);
    if (category) setSelectedCategory(category);
  }, [searchParams]);

  // Fetch products based on current filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        // In a real implementation, this would be an API call with filters
        // For now, simulate a delay and return mock data
        setTimeout(() => {
          // Simulate API response
          const mockProducts: Product[] = Array.from({ length: 15 }, (_, i) => ({
            id: `prod-${i + 1}`,
            name: `Power Tool ${i + 1}`,
            description: `This is a high-quality power tool with multiple features`,
            price: Math.floor(Math.random() * 500) + 100,
            images: [`/images/product-${(i % 5) + 1}.jpg`],
            category: i % 3 === 0 ? "power-tools" : i % 3 === 1 ? "garden-tools" : "robotic-lawn-mower",
            subcategory: i % 2 === 0 ? "drills" : "saws",
            inStock: Math.random() > 0.2,
          }));

          const mockCategories = [
            { id: "power-tools", name: "Power Tools" },
            { id: "garden-tools", name: "Garden Tools" },
            { id: "robotic-lawn-mower", name: "Robotic Lawn Mower" }
          ];

          setCategories(mockCategories);

          // Apply filters
          let filteredProducts = [...mockProducts];

          if (searchTerm) {
            filteredProducts = filteredProducts.filter(
              p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   p.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }

          if (selectedCategory) {
            filteredProducts = filteredProducts.filter(
              p => p.category === selectedCategory
            );
          }

          // Apply sorting
          filteredProducts.sort((a, b) => {
            if (sortBy === "price") {
              return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
            } else {
              // Sort by name
              const nameA = a.name.toUpperCase();
              const nameB = b.name.toUpperCase();
              if (nameA < nameB) return sortOrder === "asc" ? -1 : 1;
              if (nameA > nameB) return sortOrder === "asc" ? 1 : -1;
              return 0;
            }
          });

          // Pagination
          const totalItems = filteredProducts.length;
          const itemsPerPage = 10;
          const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);

          setTotalPages(calculatedTotalPages);

          // Adjust page if it's out of bounds
          const adjustedPage = Math.min(currentPage, calculatedTotalPages || 1);
          if (adjustedPage !== currentPage) {
            setCurrentPage(adjustedPage);
          }

          // Get items for current page
          const startIndex = (adjustedPage - 1) * itemsPerPage;
          const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

          setProducts(paginatedProducts);
          setLoading(false);
        }, 500);

      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, sortBy, sortOrder, currentPage, selectedCategory]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (currentPage > 1) params.set("page", currentPage.toString());
    if (searchTerm) params.set("search", searchTerm);
    if (sortBy !== "name") params.set("sort", sortBy);
    if (sortOrder !== "asc") params.set("order", sortOrder);
    if (selectedCategory) params.set("category", selectedCategory);

    const queryString = params.toString();
    const url = queryString ? `/admin/products?${queryString}` : "/admin/products";

    router.replace(url);
  }, [currentPage, searchTerm, sortBy, sortOrder, selectedCategory, router]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSortBy("name");
    setSortOrder("asc");
    setSelectedCategory("");
    setCurrentPage(1);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    // Here you would make an API call to delete the product
    setProducts(products.filter(p => p.id !== productId));
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus size={16} className="mr-2" />
          Add Product
        </Link>
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search form */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </form>

          {/* Category filter */}
          <div className="md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          {/* Reset button */}
          <button
            onClick={handleResetFilters}
            type="button"
            disabled={!searchTerm && !selectedCategory && sortBy === "name" && sortOrder === "asc"}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={16} className="mr-2" />
            Reset
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Products table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("name")}
                    className="group inline-flex items-center"
                  >
                    Product
                    {sortBy === "name" && (
                      sortOrder === "asc" ?
                        <ArrowUp size={14} className="ml-1 text-gray-400" /> :
                        <ArrowDown size={14} className="ml-1 text-gray-400" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("price")}
                    className="group inline-flex items-center"
                  >
                    Price
                    {sortBy === "price" && (
                      sortOrder === "asc" ?
                        <ArrowUp size={14} className="ml-1 text-gray-400" /> :
                        <ArrowDown size={14} className="ml-1 text-gray-400" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-sm text-gray-500 text-center">
                    <div className="flex justify-center items-center py-4">
                      <div className="w-6 h-6 border-2 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
                      <span className="ml-2">Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-sm text-gray-500 text-center">
                    No products found. {searchTerm || selectedCategory ? (
                      <button
                        onClick={handleResetFilters}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Clear filters
                      </button>
                    ) : (
                      <Link href="/admin/products/new" className="text-blue-600 hover:text-blue-800">
                        Add a product
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {product.images && product.images.length > 0 ? (
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={product.images[0]}
                              alt={product.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                              <Package size={16} />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">{product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {categories.find(c => c.id === product.category)?.name || product.category}
                      </div>
                      <div className="text-sm text-gray-500">{product.subcategory}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.inStock
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-2">
                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit product"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1 || loading}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages || loading}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{products.length > 0 ? (currentPage - 1) * 10 + 1 : 0}</span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * 10, (currentPage - 1) * 10 + products.length)}
                </span>{" "}
                of <span className="font-medium">{totalPages * 10}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1 || loading}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages || loading}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
