import { TreePine, Axe, Zap, ShieldCheck, LayoutGrid } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/data";

export default function ForestToolsPage() {
  // Get the category data
  const category = categories.find((cat) => cat.id === "forest-tools");

  if (!category) return <div>Category not found</div>;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Forest Tools Division</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Heavy-duty equipment for forestry work and challenging landscape management. Professional-grade tools for demanding tasks in tough environments.
        </p>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-12">
        <Image
          src="https://ext.same-assets.com/797113633/595163696.png"
          alt="Forest Tools"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex flex-col justify-end p-8">
          <h2 className="text-3xl font-bold text-white mb-2">Professional Forest Equipment</h2>
          <p className="text-white/90 max-w-xl mb-4">Heavy-duty tools designed for professional forestry and land management.</p>
          <Button size="lg" className="w-fit">Explore Collection</Button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <TreePine className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Forestry Expertise</h3>
          <p className="text-gray-600">Tools specifically designed for professional forestry applications and land management.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Axe className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Heavy-Duty Design</h3>
          <p className="text-gray-600">Robust construction and durable materials built to withstand challenging conditions.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Professional Power</h3>
          <p className="text-gray-600">High-performance motors and cutting-edge technology for demanding forestry tasks.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Safety Features</h3>
          <p className="text-gray-600">Enhanced safety mechanisms for secure operation in demanding environments.</p>
        </div>
      </div>

      {/* Product Categories */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Forest Tool Range</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {category.subcategories.map((subcategory) => (
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
      </div>

      {/* Applications */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Applications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Commercial Forestry</h3>
            <p className="text-gray-600">
              Professional tools for commercial forestry operations, timber harvesting, and woodland management.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Land Clearing</h3>
            <p className="text-gray-600">
              Heavy-duty equipment for land clearing, brush removal, and site preparation.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Vegetation Management</h3>
            <p className="text-gray-600">
              Specialized tools for vegetation control, trail maintenance, and landscape management.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-red-600 rounded-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready for professional forestry solutions?</h2>
        <p className="max-w-2xl mx-auto mb-6">
          Our forest tools are designed for professionals who demand reliability and performance.
          Contact our experts for personalized advice on the right equipment for your needs.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" className="bg-white text-red-600 hover:bg-gray-100">View All Products</Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/20">Contact Us</Button>
        </div>
      </div>
    </div>
  );
}
