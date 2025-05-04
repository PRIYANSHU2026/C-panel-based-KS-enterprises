import { Leaf, Battery, Zap, ShieldCheck, LayoutGrid } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/data";

export default function GardenToolsPage() {
  // Get the category data
  const category = categories.find((cat) => cat.id === "garden-tools");

  if (!category) return <div>Category not found</div>;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Garden Tools Division</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Professional garden tools designed for performance, precision, and durability. Our range of cordless garden tools provides versatility and freedom for all your gardening tasks.
        </p>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-12">
        <Image
          src="https://ext.same-assets.com/797113633/1456128059.png"
          alt="Garden Tools"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex flex-col justify-end p-8">
          <h2 className="text-3xl font-bold text-white mb-2">Professional Garden Tools</h2>
          <p className="text-white/90 max-w-xl mb-4">High-performance tools for professional gardeners and enthusiasts alike.</p>
          <Button size="lg" className="w-fit">Explore Collection</Button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Leaf className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
          <p className="text-gray-600">Environmentally conscious tools with reduced emissions and energy-efficient operation.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Battery className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Cordless Freedom</h3>
          <p className="text-gray-600">Experience the freedom of cordless operation with long-lasting battery performance.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Professional Power</h3>
          <p className="text-gray-600">Professional-grade power and performance for demanding tasks in your garden.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Extended Warranty</h3>
          <p className="text-gray-600">Our products come with extended warranty and reliable after-sales support.</p>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Garden Tool Range</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {category.subcategories.slice(0, 8).map((subcategory) => (
            <Link href={`/category/${category.id}/${subcategory.id}`} key={subcategory.id} className="group">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:border-red-500 hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                  <LayoutGrid className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-red-600 transition-colors">{subcategory.name}</h3>
                <p className="text-gray-600">Professional {subcategory.name.toLowerCase()}</p>
              </div>
            </Link>
          ))}
        </div>
        {category.subcategories.length > 8 && (
          <div className="text-center mt-8">
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
              View All Garden Tools
            </Button>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-red-600 rounded-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Find the perfect tools for your garden</h2>
        <p className="max-w-2xl mx-auto mb-6">
          Our professional garden tools are designed to make your gardening tasks easier and more efficient.
          Browse our complete range or contact our experts for personalized advice.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" className="bg-white text-red-600 hover:bg-gray-100">View All Products</Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/20">Contact Us</Button>
        </div>
      </div>
    </div>
  );
}
