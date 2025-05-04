"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Search, Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { categories } from "@/lib/data";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Contact bar */}
      <div className="bg-[#2A2A2A] text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 text-sm">
            <Phone size={14} className="animate-pulse" />
            <span>Contact us at: 9845019069, 7760093353, 9480453271</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto flex justify-between items-center py-4 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-14 w-32">
              <Image
                src="https://ext.same-assets.com/3095408095/1636527971.png"
                alt="K&S Enterprises"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-800 hover:text-red-600 transition-colors font-medium"
            >
              Home
            </Link>
            <div className="group relative">
              <Link
                href="/products"
                className="text-gray-800 hover:text-red-600 transition-colors font-medium flex items-center gap-1"
              >
                Products
              </Link>
              <div className="absolute left-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="bg-white shadow-lg rounded-md border overflow-hidden">
                  <div className="py-2">
                    {categories.map((category) => (
                      <div key={category.id} className="px-4 py-2">
                        <Link
                          href={`/category/${category.id}`}
                          className="block text-sm font-medium text-gray-800 hover:text-red-600"
                        >
                          {category.name}
                        </Link>
                        {category.subcategories.length > 0 && (
                          <div className="ml-4 mt-2 space-y-1">
                            {category.subcategories.slice(0, 6).map((subcategory) => (
                              <Link
                                key={subcategory.id}
                                href={`/category/${category.id}/${subcategory.id}`}
                                className="block text-xs text-gray-600 hover:text-red-600"
                              >
                                {subcategory.name}
                              </Link>
                            ))}
                            {category.subcategories.length > 6 && (
                              <Link
                                href={`/category/${category.id}`}
                                className="block text-xs font-medium text-red-600 hover:underline mt-1"
                              >
                                View all {category.subcategories.length} subcategories
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <Link
              href="/about"
              className="text-gray-800 hover:text-red-600 transition-colors font-medium"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-gray-800 hover:text-red-600 transition-colors font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* Search */}
          <div className="flex items-center">
            <div className={`relative ${isSearchOpen ? "w-60" : "w-10"} transition-all duration-300 ease-in-out`}>
              <div
                className={`absolute inset-y-0 right-0 flex items-center pr-3 ${isSearchOpen ? "cursor-pointer" : "hidden"}`}
                onClick={() => setIsSearchOpen(false)}
              >
                <X size={18} className="text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search products..."
                className={`py-1 px-3 ${isSearchOpen ? "w-full opacity-100" : "w-0 opacity-0"} transition-all duration-300`}
              />
              <Search
                size={20}
                className={`text-gray-600 hover:text-red-600 cursor-pointer ${isSearchOpen ? "hidden" : "block"}`}
                onClick={() => setIsSearchOpen(true)}
              />
            </div>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden ml-4">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    href="/"
                    className="text-gray-800 hover:text-red-600 transition-colors font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    href="/products"
                    className="text-gray-800 hover:text-red-600 transition-colors font-medium"
                  >
                    Products
                  </Link>
                  <div className="pl-4 mt-2 border-l-2 border-red-200">
                    {categories.map((category) => (
                      <div key={category.id} className="mb-4">
                        <Link
                          href={`/category/${category.id}`}
                          className="block text-sm font-medium text-gray-800 hover:text-red-600"
                        >
                          {category.name}
                        </Link>
                        {category.subcategories.length > 0 && (
                          <div className="ml-4 mt-2 space-y-1">
                            {category.subcategories.slice(0, 4).map((subcategory) => (
                              <Link
                                key={subcategory.id}
                                href={`/category/${category.id}/${subcategory.id}`}
                                className="block text-xs text-gray-600 hover:text-red-600"
                              >
                                {subcategory.name}
                              </Link>
                            ))}
                            {category.subcategories.length > 4 && (
                              <Link
                                href={`/category/${category.id}`}
                                className="block text-xs font-medium text-red-600 hover:underline mt-1"
                              >
                                View all {category.subcategories.length} subcategories
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/about"
                    className="text-gray-800 hover:text-red-600 transition-colors font-medium"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/contact"
                    className="text-gray-800 hover:text-red-600 transition-colors font-medium"
                  >
                    Contact
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
