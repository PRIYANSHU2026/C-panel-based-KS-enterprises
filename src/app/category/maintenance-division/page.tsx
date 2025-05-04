import { Droplet, Leaf, ShieldCheck, Gauge, LayoutGrid } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/data";

export default function MaintenanceDivisionPage() {
  // Get the category data
  const category = categories.find((cat) => cat.id === "maintenance-division");

  if (!category) return <div>Category not found</div>;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Maintenance Division</h1>
        <h2 className="text-2xl text-gray-700 mb-4">Water Body & Bio Lake Solutions</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Specialized solutions for water body maintenance and eco-friendly bio lake systems. Our comprehensive range of tools and equipment ensures pristine aquatic environments.
        </p>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-12">
        <Image
          src="https://ext.same-assets.com/797113633/2748826700.png"
          alt="Water Body Maintenance"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex flex-col justify-end p-8">
          <h2 className="text-3xl font-bold text-white mb-2">Water Management Solutions</h2>
          <p className="text-white/90 max-w-xl mb-4">Specialized equipment for maintaining water bodies, bio lakes, and aquatic environments.</p>
          <Button size="lg" className="w-fit">Explore Solutions</Button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Droplet className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Water Quality</h3>
          <p className="text-gray-600">Advanced solutions for monitoring and maintaining optimal water quality in all aquatic environments.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Leaf className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
          <p className="text-gray-600">Environmentally sustainable systems and products for natural water body management.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Bio-Security</h3>
          <p className="text-gray-600">Protection systems to prevent contamination and maintain healthy aquatic ecosystems.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <Gauge className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Monitoring Systems</h3>
          <p className="text-gray-600">Advanced monitoring and control systems for automated water management.</p>
        </div>
      </div>

      {/* Services */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-semibold mb-4">Water Body Maintenance</h3>
            <p className="text-gray-600 mb-4">
              Comprehensive maintenance solutions for lakes, ponds, swimming pools, and decorative water features.
              Our services include water quality management, vegetation control, and sediment removal.
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600">
              <li>Water quality testing and treatment</li>
              <li>Algae and weed control</li>
              <li>Aeration and circulation systems</li>
              <li>Seasonal maintenance programs</li>
            </ul>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">Learn More</Button>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-semibold mb-4">Bio Lake Solutions</h3>
            <p className="text-gray-600 mb-4">
              Eco-friendly bio lake design, installation, and maintenance services for natural swimming and landscape features.
              Our biological filtration systems create self-sustaining aquatic environments.
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600">
              <li>Natural filtration systems</li>
              <li>Aquatic plant selection and care</li>
              <li>Biological balance management</li>
              <li>Customized bio lake design</li>
            </ul>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">Learn More</Button>
          </div>
        </div>
      </div>

      {/* Product Categories */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Product Range</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {category.subcategories.map((subcategory) => (
            <Link href={`/category/${category.id}/${subcategory.id}`} key={subcategory.id} className="group">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:border-red-500 hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                  <LayoutGrid className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-red-600 transition-colors">{subcategory.name}</h3>
                <p className="text-gray-600">Professional solutions for {subcategory.name.toLowerCase()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-red-600 rounded-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Need specialized water management solutions?</h2>
        <p className="max-w-2xl mx-auto mb-6">
          Our experts can help you design, implement, and maintain the perfect water system for your needs.
          Contact us today for a consultation on water body or bio lake solutions.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" className="bg-white text-red-600 hover:bg-gray-100">View Products</Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/20">Request Consultation</Button>
        </div>
      </div>
    </div>
  );
}
