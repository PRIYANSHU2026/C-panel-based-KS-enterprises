import { Leaf, Zap, ShieldCheck, Wrench, LayoutGrid } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/data";

export default function RoboticLawnMowerPage() {
  // Get the category data
  const category = categories.find((cat) => cat.id === "robotic-lawn-mower");

  if (!category) return <div>Category not found</div>;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Robotic Lawn Mower Division</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Our advanced robotic lawn mowers deliver perfect lawn maintenance with minimal effort. Experience cutting-edge technology that gives you more time to enjoy your garden.
        </p>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-12">
        <Image
          src="https://ext.same-assets.com/797113633/3405095966.png"
          alt="Robotic Lawn Mower"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex flex-col justify-end p-8">
          <h2 className="text-3xl font-bold text-white mb-2">Autonomous Lawn Care</h2>
          <p className="text-white/90 max-w-xl mb-4">Precision cutting, programmable schedules, and smart navigation for a perfectly maintained lawn.</p>
          <Button size="lg" className="w-fit">Explore Products</Button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Leaf className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
          <p className="text-gray-600">Battery-powered operation with zero emissions for an environmentally friendly solution.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Smart Technology</h3>
          <p className="text-gray-600">Advanced sensors and AI navigation to handle complex lawn layouts efficiently.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Safety Features</h3>
          <p className="text-gray-600">Multiple safety mechanisms to protect people, pets and objects during operation.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <Wrench className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Low Maintenance</h3>
          <p className="text-gray-600">Easy to maintain with automatic updates and minimal service requirements.</p>
        </div>
      </div>

      {/* Product Categories */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Product Range</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {category.subcategories.map((subcategory) => (
            <Link href={`/category/${category.id}/${subcategory.id}`} key={subcategory.id} className="group">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:border-red-500 hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                  <LayoutGrid className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-red-600 transition-colors">{subcategory.name}</h3>
                <p className="text-gray-600">Explore our range of {subcategory.name.toLowerCase()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-red-600 rounded-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to transform your lawn care experience?</h2>
        <p className="max-w-2xl mx-auto mb-6">
          Our robotic lawn mowers provide the perfect solution for effortless lawn maintenance.
          Contact us today to find the perfect model for your garden.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" className="bg-white text-red-600 hover:bg-gray-100">View All Products</Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/20">Contact Us</Button>
        </div>
      </div>
    </div>
  );
}
