import { Wrench, Clock, CircleDollarSign, ClipboardCheck, LayoutGrid } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/data";

export default function EinhellHubPage() {
  // Get the category data
  const category = categories.find((cat) => cat.id === "einhell-hub");

  if (!category) return <div>Category not found</div>;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Einhell Maintenance Hub</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Your one-stop solution for all Einhell tool maintenance, repairs, and upgrades. Our expert technicians ensure your equipment performs at its best for years to come.
        </p>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-12">
        <Image
          src="https://ext.same-assets.com/797113633/1965852873.png"
          alt="Einhell Maintenance Hub"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex flex-col justify-end p-8">
          <h2 className="text-3xl font-bold text-white mb-2">Professional Maintenance Services</h2>
          <p className="text-white/90 max-w-xl mb-4">Expert care for all your Einhell equipment to ensure optimal performance and longevity.</p>
          <Button size="lg" className="w-fit">Explore Services</Button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <Wrench className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Expert Technicians</h3>
          <p className="text-gray-600">Trained specialists with in-depth knowledge of all Einhell products for professional service.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Quick Turnaround</h3>
          <p className="text-gray-600">Fast and efficient service to minimize downtime and get your tools back in action.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CircleDollarSign className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Cost-Effective</h3>
          <p className="text-gray-600">Affordable maintenance solutions to extend the life of your equipment and save money.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
            <ClipboardCheck className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Warranty Service</h3>
          <p className="text-gray-600">Authorized warranty repairs and maintenance to protect your investment.</p>
        </div>
      </div>

      {/* Services */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-semibold mb-4">Repairs</h3>
            <p className="text-gray-600 mb-4">
              Professional repair services for all Einhell tools and equipment. Our technicians diagnose and fix issues quickly using genuine parts.
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600">
              <li>Mechanical repairs</li>
              <li>Electrical system service</li>
              <li>Motor rebuilding</li>
              <li>Warranty repairs</li>
            </ul>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">Book Repair</Button>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-semibold mb-4">Maintenance</h3>
            <p className="text-gray-600 mb-4">
              Regular maintenance services to keep your Einhell tools operating at peak performance. Preventative care extends tool life and prevents breakdowns.
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600">
              <li>Routine servicing</li>
              <li>Performance testing</li>
              <li>Cleaning and lubrication</li>
              <li>Safety inspections</li>
            </ul>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">Schedule Service</Button>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-semibold mb-4">Upgrades</h3>
            <p className="text-gray-600 mb-4">
              Enhance your existing Einhell tools with the latest accessories and upgrades. Improve performance and add functionality to your equipment.
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600">
              <li>Battery upgrades</li>
              <li>Performance enhancements</li>
              <li>Accessory installation</li>
              <li>Custom modifications</li>
            </ul>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">Explore Upgrades</Button>
          </div>
        </div>
      </div>

      {/* Products */}
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
                <p className="text-gray-600">Quality {subcategory.name.toLowerCase()} for Einhell tools</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Service Process */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Service Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center h-full">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2 mt-4">Book Service</h3>
              <p className="text-gray-600">Schedule your service request online or by phone</p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center h-full">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2 mt-4">Inspection</h3>
              <p className="text-gray-600">Our technicians diagnose your equipment</p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center h-full">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2 mt-4">Service</h3>
              <p className="text-gray-600">We repair, maintain or upgrade your tools</p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center h-full">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">4</div>
              <h3 className="text-xl font-semibold mb-2 mt-4">Return</h3>
              <p className="text-gray-600">Collect your fully tested and serviced equipment</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-red-600 rounded-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Keep your Einhell tools in perfect condition</h2>
        <p className="max-w-2xl mx-auto mb-6">
          Our Einhell Maintenance Hub provides expert care for all your tools and equipment.
          Schedule a service today or contact us to learn more about our maintenance plans.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" className="bg-white text-red-600 hover:bg-gray-100">Book Service</Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/20">Contact Us</Button>
        </div>
      </div>
    </div>
  );
}
