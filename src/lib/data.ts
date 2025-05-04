import type { Product, Category, BannerSlide } from './types';

export const categories: Category[] = [
  {
    id: "robotic-lawn-mower",
    name: "Robotic Lawn Mower",
    subcategories: [
      { id: "robotic-mowers", name: "Robotic Mowers", categoryId: "robotic-lawn-mower" },
      { id: "accessories", name: "Accessories & Parts", categoryId: "robotic-lawn-mower" },
      { id: "installation", name: "Installation Kits", categoryId: "robotic-lawn-mower" },
    ]
  },
  {
    id: "garden-tools",
    name: "Garden Tools",
    subcategories: [
      { id: "aerator-scarifier", name: "Cordless Aerator/Scarifier", categoryId: "garden-tools" },
      { id: "brush-cutter", name: "Cordless Brush Cutter", categoryId: "garden-tools" },
      { id: "chain-saw", name: "Cordless Chain Saw", categoryId: "garden-tools" },
      { id: "hedge-trimmer", name: "Cordless Hedge Trimmer", categoryId: "garden-tools" },
      { id: "hose-reels", name: "Cordless Hose Reels (Water)", categoryId: "garden-tools" },
      { id: "knife-shredder", name: "Cordless Knife Shredder", categoryId: "garden-tools" },
      { id: "lawn-mower", name: "Cordless Lawn Mower", categoryId: "garden-tools" },
      { id: "multi-tools", name: "Cordless Multifunctional Tools", categoryId: "garden-tools" },
      { id: "pruning-shears", name: "Cordless Pruning Shears", categoryId: "garden-tools" },
      { id: "push-sweeper", name: "Cordless Push Sweeper", categoryId: "garden-tools" },
      { id: "sprayer", name: "Cordless Sprayer", categoryId: "garden-tools" },
      { id: "vacuum", name: "Cordless Vacuum", categoryId: "garden-tools" },
    ]
  },
  {
    id: "forest-tools",
    name: "Forest Tools",
    subcategories: [
      { id: "chainsaws", name: "Professional Chainsaws", categoryId: "forest-tools" },
      { id: "brush-cutters", name: "Heavy-Duty Brush Cutters", categoryId: "forest-tools" },
      { id: "wood-chippers", name: "Wood Chippers & Shredders", categoryId: "forest-tools" },
      { id: "log-splitters", name: "Log Splitters", categoryId: "forest-tools" },
    ]
  },
  {
    id: "maintenance-division",
    name: "Maintenance Division",
    subcategories: [
      { id: "water-body", name: "Water Body Maintenance", categoryId: "maintenance-division" },
      { id: "bio-lake", name: "Bio Lake Solutions", categoryId: "maintenance-division" },
      { id: "pond-equipment", name: "Pond Equipment", categoryId: "maintenance-division" },
      { id: "water-filtration", name: "Water Filtration Systems", categoryId: "maintenance-division" },
    ]
  },
  {
    id: "einhell-hub",
    name: "Einhell Maintenance Hub",
    subcategories: [
      { id: "repair-services", name: "Repair Services", categoryId: "einhell-hub" },
      { id: "spare-parts", name: "Spare Parts", categoryId: "einhell-hub" },
      { id: "maintenance-kits", name: "Maintenance Kits", categoryId: "einhell-hub" },
      { id: "tool-upgrades", name: "Tool Upgrades", categoryId: "einhell-hub" },
    ]
  }
];

export const products: Product[] = [
  {
    id: "knife-shredder-1",
    name: "Knife Shredder",
    description: "With the Einhell electric blade shredder GC-KS 2540, chopped material can be shredded quickly and reliably. The two robust and durable reversible blades, which are made of special steel and are driven by a powerful motor with 2,500 Watts and an idle speed of 4,500 rpm, ensure effective work.",
    price: 12000,
    images: [
      "https://ext.same-assets.com/797113633/1965852873.png",
      "https://ext.same-assets.com/797113633/3916371749.png"
    ],
    category: "Garden Tools",
    subcategory: "Cordless Knife Shredder",
    features: [
      "Powerful 2,500 Watts motor",
      "4,500 rpm idle speed",
      "Special steel reversible blades",
      "Large hopper opening",
      "Robust chassis with wheels",
      "50 litre chopped material sack"
    ],
    specifications: {
      "Power": "2,500 Watts",
      "Speed": "4,500 rpm",
      "Material Capacity": "50 litre",
      "Branch Diameter": "up to 40 mm",
      "Weight": "12.8 kg"
    },
    inStock: true
  },
  {
    id: "multi-tool-1",
    name: "Multifunctional Tool (Trimmer/Chain Saw/Scythe)",
    description: "The Einhell Professional cordless multi-tool GP-HC 18/5020 Li T BL-Solo is an indispensable member of the Einhell Power XChange family for cordless tree and hedge care. As a 2-in-1 device, it comes with a high-quality hedge trimmer attachment and a chainsaw attachment for professional all-round use.",
    price: 15000,
    images: [
      "https://ext.same-assets.com/797113633/825332054.png"
    ],
    category: "Garden Tools",
    subcategory: "Cordless Multifunctional Tools",
    features: [
      "2-in-1 device",
      "High-quality hedge trimmer attachment",
      "Chainsaw attachment",
      "Brushless motor",
      "Telescopic pole",
      "8-way tiltable"
    ],
    specifications: {
      "Length (Hedge Trimmer)": "220-290 cm",
      "Length (Pole Pruner)": "174-250 cm",
      "Cutting Length": "50 cm",
      "Tooth Spacing": "25 mm",
      "Chain Speed": "7 m/s"
    },
    inStock: true
  },
  {
    id: "chain-saw-1",
    name: "Chain Saw",
    description: "The Einhell GP-LC 36/35 Li-Solo cordless chainsaw features impressive attributes: flexibility, power and user-friendliness. As a member of the Power X-Change family the chainsaw is supplied with power from two high-performance 18 V batteries.",
    price: 18000,
    images: [
      "https://ext.same-assets.com/797113633/595163696.png"
    ],
    category: "Garden Tools",
    subcategory: "Cordless Chain Saw",
    features: [
      "High-performance dual 18V batteries",
      "Einhell PurePOWER brushless motor",
      "OREGON guide bar and chain",
      "Tool-less chain changing",
      "Automatic chain lubrication"
    ],
    specifications: {
      "Battery": "2x 18 V",
      "Cutter Rail Length": "350 mm",
      "Cutting Speed": "15 m/s",
      "Oil Tank Capacity": "120 ml"
    },
    inStock: true
  },
  {
    id: "brush-cutter-1",
    name: "Brush Cutter",
    description: "With the Einhell Professional cordless lawn trimmer GP-CT 36/35 Li BL-Solo, every gardener has a practical and proven helper in the tool shed. Whether trimming edge strips or shaping the lawn, the cordless lawn trimmer works quickly and powerfully thanks to 2-stage speed control.",
    price: 13500,
    images: [
      "https://ext.same-assets.com/797113633/1456128059.png"
    ],
    category: "Garden Tools",
    subcategory: "Cordless Brush Cutter",
    features: [
      "2-stage speed control",
      "Brushless motor",
      "Double-bent aluminium guide bar",
      "Divisible guide bar",
      "Automatic jogging mechanism"
    ],
    specifications: {
      "Battery": "2x 18 V",
      "Cutting Width": "35 cm",
      "Thread Diameter": "2.0 mm",
      "Thread Length": "8 m",
      "Weight": "3.5 kg"
    },
    inStock: true
  },
  {
    id: "hose-reels-1",
    name: "Hose Reels (Water)",
    description: "The Einhell cordless hose reel GE-HR 18/30 Li-Solo waters the garden like never before. Putting the hose away manually is a thing of the past thanks to the powerful 18 V Power X-Change battery.",
    price: 9800,
    images: [
      "https://ext.same-assets.com/797113633/2748826700.png"
    ],
    category: "Garden Tools",
    subcategory: "Cordless Hose Reels (Water)",
    features: [
      "Automatic winding",
      "30m long hose",
      "UV-resistant garden hose",
      "Built-in hose guide",
      "Cleaning brushes"
    ],
    specifications: {
      "Battery": "18 V",
      "Hose Length": "30 m",
      "Hose Diameter": "12.5 mm (1/2\")",
      "Connection Hose": "1.5 m"
    },
    inStock: true
  },
  {
    id: "sprayer-1",
    name: "Sprayer",
    description: "The cordless pressure sprayer GE-WS 18/150 Li Solo is part of the powerful Power X-Change series, the high-quality lithium-ion battery system that can be flexibly combined. The pressure sprayer is ideal for gardeners who value plant protection, want to apply fertilisers evenly or chemically attack the weeds.",
    price: 8500,
    images: [
      "https://ext.same-assets.com/797113633/2039255254.png"
    ],
    category: "Garden Tools",
    subcategory: "Cordless Sprayer",
    features: [
      "Automatic pump operation",
      "Transparent tank with scale",
      "Large filling opening",
      "Adjustable brass nozzle",
      "Stainless steel spray lance"
    ],
    specifications: {
      "Battery": "18 V",
      "Tank Capacity": "15 liters",
      "Spray Pressure": "Variable"
    },
    inStock: true
  },
  {
    id: "push-sweeper-1",
    name: "Push Sweeper",
    description: "The Einhell TE-SW 18/610 Li-Solo cordless mechanical sweeper, as a member of the flexible Power X-Change family, is powerful, reliable and flexible. Every high-quality PXC rechargeable battery from the series can be combined with every system device.",
    price: 11000,
    images: [
      "https://ext.same-assets.com/797113633/705837461.png"
    ],
    category: "Garden Tools",
    subcategory: "Cordless Push Sweeper",
    features: [
      "Cordless operation",
      "Flexible PXC battery system",
      "Effortless sweeping",
      "Ergonomic design"
    ],
    specifications: {
      "Battery": "18 V",
      "Sweeping Width": "610 mm"
    },
    inStock: true
  },
  {
    id: "aerator-scarifier-1",
    name: "Aerator/Scarifier",
    description: "The Einhell cordless aerator and scarifier brings new life to your lawn. It effectively removes moss, weeds, and thatch to allow your grass to breathe and grow healthier.",
    price: 14500,
    images: [
      "https://ext.same-assets.com/797113633/3405095966.png"
    ],
    category: "Garden Tools",
    subcategory: "Cordless Aerator/Scarifier",
    features: [
      "Dual-function aerator and scarifier",
      "Adjustable working depth",
      "45L collection bag",
      "Foldable handle for storage"
    ],
    specifications: {
      "Battery": "2x 18 V",
      "Working Width": "33 cm",
      "Depth Adjustment": "3 levels",
      "Collection Bag Capacity": "45 L"
    },
    inStock: true
  }
];

export const bannerSlides: BannerSlide[] = [
  {
    id: "slide-1",
    title: "Professional Garden Tools",
    description: "Discover our range of cordless garden tools designed for professional performance and convenience.",
    imageUrl: "https://ext.same-assets.com/3095408095/926472817.jpeg",
    buttonText: "Explore Products",
    buttonUrl: "/products"
  },
  {
    id: "slide-2",
    title: "Robotic Lawn Mower Division",
    description: "Advanced robotic mowers for perfectly maintained lawns with minimal effort. Experience the future of lawn care.",
    imageUrl: "https://ext.same-assets.com/797113633/3405095966.png",
    buttonText: "Discover Robotic Mowers",
    buttonUrl: "/category/robotic-lawn-mower"
  },
  {
    id: "slide-3",
    title: "Forest Tools Division",
    description: "Professional-grade tools for forestry and heavy-duty garden maintenance. Power and reliability for challenging tasks.",
    imageUrl: "https://ext.same-assets.com/797113633/595163696.png",
    buttonText: "Explore Forest Tools",
    buttonUrl: "/category/forest-tools"
  },
  {
    id: "slide-4",
    title: "Water Body & Bio Lake Maintenance",
    description: "Specialized solutions for maintaining water bodies and bio lakes with eco-friendly technologies.",
    imageUrl: "https://ext.same-assets.com/797113633/2748826700.png",
    buttonText: "View Maintenance Solutions",
    buttonUrl: "/category/maintenance-division"
  },
  {
    id: "slide-5",
    title: "Einhell Maintenance Hub",
    description: "Your one-stop solution for Einhell tool maintenance, repairs, and upgrades to keep your equipment in top condition.",
    imageUrl: "https://ext.same-assets.com/797113633/1456128059.png",
    buttonText: "Visit Maintenance Hub",
    buttonUrl: "/category/einhell-hub"
  }
];
