"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border border-gray-200 h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

        {/* Quick actions */}
        <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center space-x-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Link href={`/products/${product.id}`}>
            <Button size="icon" variant="secondary" className="rounded-full bg-white hover:bg-gray-100 shadow-md">
              <Eye className="h-4 w-4 text-gray-700" />
              <span className="sr-only">Quick view</span>
            </Button>
          </Link>
        </div>
      </div>
      <CardContent className="flex-grow pt-4">
        <Link
          href={`/products/${product.id}`}
          className="font-medium text-base text-gray-800 hover:text-red-600 transition-colors line-clamp-2 min-h-[48px]"
        >
          {product.name}
        </Link>
        <p className="text-sm text-gray-500 mt-1">
          {product.category} - {product.subcategory}
        </p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-center items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={`/products/${product.id}`}
            className="text-sm text-red-600 hover:text-red-700 font-medium underline-offset-4 hover:underline"
          >
            Details
          </Link>
        </motion.div>
      </CardFooter>
    </Card>
  );
}
