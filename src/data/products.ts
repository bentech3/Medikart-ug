export interface Product {
  id: string;
  name: string;
  genericName: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  dosage: string;
  manufacturer: string;
  inStock: boolean;
  requiresPrescription: boolean;
  image: string;
  rating: number;
  reviews: number;
}

export const categories = [
  {
    id: "pain-fever",
    name: "Pain & Fever",
    icon: "🌡️",
    color: "from-red-400 to-orange-400",
    description: "Relief from pain and fever",
  },
  {
    id: "antibiotics",
    name: "Antibiotics",
    icon: "💊",
    color: "from-blue-400 to-cyan-400",
    description: "Fight bacterial infections",
  },
  {
    id: "baby-care",
    name: "Baby Care",
    icon: "👶",
    color: "from-pink-400 to-rose-400",
    description: "Care for your little ones",
  },
  {
    id: "supplements",
    name: "Supplements",
    icon: "💪",
    color: "from-green-400 to-emerald-400",
    description: "Vitamins & minerals",
  },
  {
    id: "cosmetics",
    name: "Cosmetics",
    icon: "✨",
    color: "from-purple-400 to-violet-400",
    description: "Beauty & skincare",
  },
  {
    id: "first-aid",
    name: "First Aid",
    icon: "🩹",
    color: "from-amber-400 to-yellow-400",
    description: "Emergency essentials",
  },
];

export const products: Product[] = [
  // Pain & Fever
  {
    id: "1",
    name: "Panadol Extra",
    genericName: "Paracetamol + Caffeine",
    category: "pain-fever",
    price: 8500,
    originalPrice: 10000,
    description: "Fast-acting pain relief for headaches, toothaches, and fever. Contains caffeine for enhanced effectiveness.",
    dosage: "500mg + 65mg",
    manufacturer: "GSK Uganda",
    inStock: true,
    requiresPrescription: false,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 234,
  },
  {
    id: "2",
    name: "Ibuprofen 400mg",
    genericName: "Ibuprofen",
    category: "pain-fever",
    price: 12000,
    description: "Anti-inflammatory pain reliever for muscle pain, arthritis, and menstrual cramps.",
    dosage: "400mg",
    manufacturer: "Cipla Quality Chemicals",
    inStock: true,
    requiresPrescription: false,
    image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 156,
  },
  {
    id: "3",
    name: "Aspirin",
    genericName: "Acetylsalicylic Acid",
    category: "pain-fever",
    price: 6000,
    description: "Classic pain reliever and blood thinner. Good for headaches and heart health.",
    dosage: "300mg",
    manufacturer: "Bayer East Africa",
    inStock: true,
    requiresPrescription: false,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 189,
  },

  // Antibiotics
  {
    id: "4",
    name: "Amoxicillin Capsules",
    genericName: "Amoxicillin",
    category: "antibiotics",
    price: 25000,
    description: "Broad-spectrum antibiotic for bacterial infections including respiratory and urinary tract infections.",
    dosage: "500mg",
    manufacturer: "Quality Chemicals Industries",
    inStock: true,
    requiresPrescription: true,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 312,
  },
  {
    id: "5",
    name: "Azithromycin",
    genericName: "Azithromycin",
    category: "antibiotics",
    price: 35000,
    description: "Powerful antibiotic for treating various bacterial infections. Complete course in just 3 days.",
    dosage: "500mg",
    manufacturer: "Abacus Pharma",
    inStock: true,
    requiresPrescription: true,
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 278,
  },
  {
    id: "6",
    name: "Ciprofloxacin",
    genericName: "Ciprofloxacin",
    category: "antibiotics",
    price: 28000,
    description: "Fluoroquinolone antibiotic for treating serious bacterial infections.",
    dosage: "500mg",
    manufacturer: "Cipla Uganda",
    inStock: false,
    requiresPrescription: true,
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 145,
  },

  // Baby Care
  {
    id: "7",
    name: "Calpol Infant Drops",
    genericName: "Paracetamol Suspension",
    category: "baby-care",
    price: 15000,
    description: "Gentle fever and pain relief for babies from 2 months. Sugar-free and strawberry flavored.",
    dosage: "120mg/5ml",
    manufacturer: "GSK Uganda",
    inStock: true,
    requiresPrescription: false,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 456,
  },
  {
    id: "8",
    name: "Gripe Water",
    genericName: "Herbal Digestive Aid",
    category: "baby-care",
    price: 12000,
    description: "Natural relief from colic, gas, and digestive discomfort in infants.",
    dosage: "150ml",
    manufacturer: "Woodwards",
    inStock: true,
    requiresPrescription: false,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 323,
  },
  {
    id: "9",
    name: "Baby Zinc Syrup",
    genericName: "Zinc Sulfate",
    category: "baby-care",
    price: 18000,
    description: "Zinc supplement for treating diarrhea in children and boosting immunity.",
    dosage: "20mg/5ml",
    manufacturer: "Quality Chemicals",
    inStock: true,
    requiresPrescription: false,
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 198,
  },

  // Supplements
  {
    id: "10",
    name: "Vitamin C 1000mg",
    genericName: "Ascorbic Acid",
    category: "supplements",
    price: 22000,
    description: "High-potency vitamin C for immune support and antioxidant protection.",
    dosage: "1000mg",
    manufacturer: "Nature Made",
    inStock: true,
    requiresPrescription: false,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 567,
  },
  {
    id: "11",
    name: "Multivitamin Plus",
    genericName: "Multivitamin & Minerals",
    category: "supplements",
    price: 45000,
    originalPrice: 55000,
    description: "Complete daily nutrition with essential vitamins and minerals for adults.",
    dosage: "1 tablet daily",
    manufacturer: "Centrum",
    inStock: true,
    requiresPrescription: false,
    image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 789,
  },
  {
    id: "12",
    name: "Omega-3 Fish Oil",
    genericName: "Fish Oil EPA/DHA",
    category: "supplements",
    price: 38000,
    description: "Heart-healthy omega-3 fatty acids for brain and cardiovascular support.",
    dosage: "1000mg",
    manufacturer: "Seven Seas",
    inStock: true,
    requiresPrescription: false,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 432,
  },

  // Cosmetics
  {
    id: "13",
    name: "Nivea Moisturizing Cream",
    genericName: "Skin Moisturizer",
    category: "cosmetics",
    price: 28000,
    description: "Deep moisturizing cream for soft, smooth skin. Suitable for all skin types.",
    dosage: "200ml",
    manufacturer: "Beiersdorf",
    inStock: true,
    requiresPrescription: false,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 654,
  },
  {
    id: "14",
    name: "Sunscreen SPF 50",
    genericName: "UV Protection",
    category: "cosmetics",
    price: 35000,
    description: "High protection sunscreen for the Ugandan sun. Water-resistant formula.",
    dosage: "100ml",
    manufacturer: "Nivea Sun",
    inStock: true,
    requiresPrescription: false,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 321,
  },
  {
    id: "15",
    name: "Vaseline Petroleum Jelly",
    genericName: "White Petrolatum",
    category: "cosmetics",
    price: 8000,
    description: "Multi-purpose skin protectant for dry, cracked skin and minor burns.",
    dosage: "250g",
    manufacturer: "Unilever",
    inStock: true,
    requiresPrescription: false,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 876,
  },

  // First Aid
  {
    id: "16",
    name: "First Aid Kit",
    genericName: "Emergency Kit",
    category: "first-aid",
    price: 65000,
    description: "Complete first aid kit with bandages, antiseptic, and essential medical supplies.",
    dosage: "50 pieces",
    manufacturer: "Red Cross Uganda",
    inStock: true,
    requiresPrescription: false,
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 234,
  },
  {
    id: "17",
    name: "Dettol Antiseptic",
    genericName: "Chloroxylenol",
    category: "first-aid",
    price: 18000,
    description: "Trusted antiseptic liquid for wound cleaning and infection prevention.",
    dosage: "250ml",
    manufacturer: "Reckitt",
    inStock: true,
    requiresPrescription: false,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 543,
  },
];

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter((product) => product.category === categoryId);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.genericName.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      product.manufacturer.toLowerCase().includes(lowerQuery)
  );
};

export const formatPrice = (price: number): string => {
  return `UGX ${price.toLocaleString()}`;
};
