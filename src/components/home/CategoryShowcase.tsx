"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { categories } from "@/lib/data";
import { ChevronRight } from "lucide-react";

export function CategoryShowcase() {
  // Display all categories
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800">Our Divisions</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Explore our comprehensive range of specialized divisions offering professional solutions for all your needs
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={item}>
              <Link href={`/category/${category.id}`}>
                <div className="group relative overflow-hidden rounded-lg h-[250px] border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-300">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent" />

                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 mb-4">
                      {getCategoryDescription(category.id)}
                    </p>
                    <div className="flex items-center text-red-600 font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
                      Explore Division <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/products"
            className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
          >
            View All Products <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Helper function to get descriptions for each category
function getCategoryDescription(categoryId: string): string {
  switch (categoryId) {
    case "robotic-lawn-mower":
      return "Advanced robotic lawn mowers for effortless lawn maintenance and perfect results every time";
    case "garden-tools":
      return "Professional garden tools designed for performance, reliability, and convenience for all your gardening needs";
    case "forest-tools":
      return "Heavy-duty tools for forestry and landscape management, built for professional use and challenging environments";
    case "maintenance-division":
      return "Specialized equipment and solutions for water body and bio lake maintenance, ensuring pristine aquatic environments";
    case "einhell-hub":
      return "Complete maintenance, repair, and upgrade services for your Einhell tools to ensure optimal performance";
    default:
      return "Explore our professional range of products and services";
  }
}
