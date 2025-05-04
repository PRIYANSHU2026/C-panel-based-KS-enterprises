"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Clock, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center mb-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-red-600">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <span className="text-gray-800 font-medium">About Us</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-12 mb-16">
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              About K&S Enterprises
            </h1>
            <div className="space-y-4 text-gray-600">
              <p>
                K&S Enterprises is a leading provider of high-quality garden tools and power tools, delivering professional-grade solutions to customers across India since 2010.
              </p>
              <p>
                Our mission is to provide innovative, reliable, and eco-friendly tools that help our customers accomplish their tasks efficiently and effectively. We believe in the power of quality tools to transform the way people work.
              </p>
              <p>
                With a focus on cordless technology, we offer a comprehensive range of garden and power tools that combine performance, durability, and convenience.
              </p>
            </div>
            <div className="mt-8">
              <Link href="/contact">
                <Button className="bg-red-600 hover:bg-red-700">Contact Us</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="md:w-1/2 relative min-h-[300px] md:min-h-0 rounded-lg overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image
              src="https://ext.same-assets.com/3095408095/3677636569.jpeg"
              alt="K&S Enterprises Facility"
              fill
              className="object-cover rounded-lg"
            />
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Our commitment to excellence drives everything we do. We stand by these core values that define who we are.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Quality",
                description: "We are committed to providing high-quality tools that meet the highest standards of performance and durability.",
                delay: 0
              },
              {
                title: "Innovation",
                description: "We continuously strive to innovate and improve our products to meet evolving customer needs and challenges.",
                delay: 0.1
              },
              {
                title: "Customer Satisfaction",
                description: "We prioritize customer satisfaction and support, ensuring that our products and services exceed expectations.",
                delay: 0.2
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: value.delay }}
                className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Leadership</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Meet the team behind K&S Enterprises. Our leadership brings decades of experience in the industry.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Kiran Kumar",
                position: "Founder & CEO",
                bio: "With over 25 years of experience in the industry, Kiran leads our company with vision and expertise.",
                delay: 0
              },
              {
                name: "Suresh Babu",
                position: "Technical Director",
                bio: "Suresh oversees our product development and quality control processes, ensuring excellence in every tool.",
                delay: 0.1
              },
              {
                name: "Priya Sharma",
                position: "Operations Manager",
                bio: "Priya manages our day-to-day operations and supply chain, keeping everything running smoothly.",
                delay: 0.2
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: member.delay }}
                className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-gray-400">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-red-600 font-medium mb-4">{member.position}</p>
                <p className="text-gray-600">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start">
              <MapPin className="h-6 w-6 text-red-600 mt-1 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Our Location</h3>
                <p className="text-gray-600">123 Main Street, Bangalore, Karnataka, India - 560001</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="h-6 w-6 text-red-600 mt-1 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Contact Us</h3>
                <p className="text-gray-600">Phone: 9845019069, 7760093353</p>
                <p className="text-gray-600 mt-1">Email: info@ksenterprises.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="h-6 w-6 text-red-600 mt-1 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Business Hours</h3>
                <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="text-gray-600 mt-1">Saturday: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
