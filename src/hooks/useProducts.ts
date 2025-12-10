import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image: string | null;
  category: string;
  brand: string | null;
  dosage: string | null;
  stock: number;
  requires_prescription: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(8);
      
      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useProductById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Product | null;
    },
    enabled: !!id,
  });
};

export const useProductsByCategory = (category: string | undefined) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      if (!category) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('name');
      
      if (error) throw error;
      return data as Product[];
    },
    enabled: !!category,
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`)
        .order('name');
      
      if (error) throw error;
      return data as Product[];
    },
    enabled: query.trim().length > 0,
  });
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Categories data (static as it rarely changes)
export const categories = [
  {
    id: 'pain-fever',
    name: 'Pain & Fever',
    icon: '💊',
    description: 'Relief from headaches, body aches, and fever',
    color: 'bg-red-100 text-red-700',
  },
  {
    id: 'antibiotics',
    name: 'Antibiotics',
    icon: '💉',
    description: 'Prescription antibiotics for infections',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'baby-care',
    name: 'Baby Care',
    icon: '👶',
    description: 'Medicines and care products for infants',
    color: 'bg-pink-100 text-pink-700',
  },
  {
    id: 'supplements',
    name: 'Supplements',
    icon: '🌿',
    description: 'Vitamins, minerals, and health supplements',
    color: 'bg-green-100 text-green-700',
  },
  {
    id: 'cosmetics',
    name: 'Cosmetics',
    icon: '✨',
    description: 'Skincare and beauty products',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'first-aid',
    name: 'First Aid',
    icon: '🩹',
    description: 'Bandages, antiseptics, and emergency care',
    color: 'bg-orange-100 text-orange-700',
  },
];

export const getCategoryById = (id: string) => {
  return categories.find((c) => c.id === id);
};
