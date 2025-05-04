"use client";

import { motion } from "framer-motion";
import { Leaf, Zap, TreePine, Droplet, Wrench } from "lucide-react";

const features = [
  {
    id: "robotic-mowers",
    title: "Robotic Lawn Mower",
    description: "Cutting-edge robotic technology for effortless lawn maintenance with precise results.",
    icon: Zap,
  },
  {
    id: "garden-tools",
    title: "Garden Tools",
    description: "Professional garden tools for all your landscaping and maintenance needs.",
    icon: Leaf,
  },
  {
    id: "forest-tools",
    title: "Forest Tools",
    description: "Heavy-duty equipment for forestry work and challenging landscape management.",
    icon: TreePine,
  },
  {
    id: "maintenance",
    title: "Water & Bio Lake",
    description: "Specialized solutions for water body maintenance and eco-friendly bio lake systems.",
    icon: Droplet,
  },
  {
    id: "einhell-hub",
    title: "Einhell Maintenance Hub",
    description: "Complete service center for repairs, maintenance and upgrades of your tools.",
    icon: Wrench,
  },
];

export function FeatureSection() {
  return (
    <section className="py-16 bg-red-600 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold">Our Specialized Divisions</h2>
          <p className="mt-2 max-w-2xl mx-auto text-red-100">
            K&S Enterprises offers comprehensive solutions across five specialized divisions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-red-100 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
