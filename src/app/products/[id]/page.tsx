"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ChevronRight, Info, Loader2, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { products } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import useCatalog from "@/lib/useCatalog";

// This is no longer needed with client-side data fetching
// export function generateStaticParams() {
//   return products.map((product) => ({
//     id: product.id,
//   }));
// }

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch product details using the catalog hook
  const { product, loading, error, products: allProducts } = useCatalog({
    id,
    fallbackToLocal: true
  });

  // If product not found and not loading, return 404
  if (!loading && !product && !error) {
    notFound();
  }

  // Get related products (same category, excluding current product)
  const relatedProducts = allProducts.length > 0
    ? allProducts
        .filter((p) => product && p.category === product.category && p.id !== id)
        .slice(0, 4)
    : products
        .filter((p) => product && p.category === product.category && p.id !== id)
        .slice(0, 4);

  // Loading state
  if (loading) {
    return (
      <div className="py-8 md:py-12">
        <div className="container mx-auto px-4 flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          <span className="ml-2 text-gray-600">Loading product details...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900">Error loading product</h3>
            <p className="mt-2 text-gray-500">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If we've reached this point, we should have a product
  if (!product) return null;

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center mb-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-red-600">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <Link href="/products" className="text-gray-500 hover:text-red-600">
            Products
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <span className="text-gray-800 font-medium">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="lg:w-1/2">
            <div className="relative aspect-square border rounded-lg overflow-hidden bg-white">
              <Image
                src={product.images[activeImageIndex]}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority
              />
            </div>

            {/* Thumbnail images */}
            {product.images.length > 1 && (
              <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <div
                    key={`thumb-${index}`}
                    className={`relative h-20 w-20 border rounded-md overflow-hidden cursor-pointer ${
                      activeImageIndex === index ? 'border-red-600 ring-2 ring-red-200' : 'border-gray-200'
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                  {product.category}
                </div>
                <div className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                  {product.subcategory}
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={`star-${i}`}
                      className={`h-5 w-5 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">4.0 (12 reviews)</span>
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Features list */}
              {product.features && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold uppercase text-gray-700 mb-2">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={`feature-${index}`} className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Availability and Shipping */}
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  {product.inStock ? (
                    <>
                      <div className="h-4 w-4 rounded-full bg-green-500" />
                      <span className="font-medium text-green-700">In Stock</span>
                    </>
                  ) : (
                    <>
                      <div className="h-4 w-4 rounded-full bg-red-500" />
                      <span className="font-medium text-red-700">Out of Stock</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4 text-gray-500" />
                  <span>Free shipping for orders over ₹10,000</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Get a Quote
                </Button>
                <Button size="lg" variant="outline">
                  Download Brochure
                </Button>
              </div>

              {/* Safety notice */}
              <div className="mt-8 p-4 bg-blue-50 rounded-md flex gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Professional equipment. Please read the instruction manual carefully before use. Contact our support team for any assistance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product details tabs */}
        <div className="mt-16">
          <Tabs defaultValue="specifications">
            <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 mb-8">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="mt-4">
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-bold mb-4">Technical Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="py-3 border-b border-gray-100">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">{key}</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-4">
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-bold mb-4">Product Details</h2>
                <p className="text-gray-600 mb-4">
                  {product.description}
                </p>
                <p className="text-gray-600">
                  All our products come with a standard 2-year warranty that can be extended to 5 years with our premium service plan.
                  Our {product.name} is designed for both professional and home use, providing exceptional performance and durability.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="support" className="mt-4">
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-bold mb-4">Support & Warranty</h2>
                <p className="text-gray-600 mb-4">
                  For technical support or warranty claims, please contact our customer service:
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-gray-600">
                    <ChevronRight className="h-5 w-5 text-red-600 mr-2" />
                    <span>Phone: 9845019069, 7760093353</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <ChevronRight className="h-5 w-5 text-red-600 mr-2" />
                    <span>Email: support@ksenterprises.com</span>
                  </li>
                </ul>
                <p className="text-gray-600">
                  Our service centers are located in major cities across India. For warranty service,
                  please keep your invoice and product serial number handy.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <Separator className="mb-8" />
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                >
                  <Link href={`/products/${relatedProduct.id}`}>
                    <div className="group relative aspect-square rounded-lg border overflow-hidden bg-white">
                      <Image
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        fill
                        className="object-contain p-8 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="mt-4 font-medium text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
