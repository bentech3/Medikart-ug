import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total: number;
  delivery_fee: number;
  delivery_address: {
    fullName: string;
    phone: string;
    alternatePhone?: string;
    address: string;
    landmark?: string;
    city: string;
    notes?: string;
  };
  payment_method: string;
  payment_status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export const useOrders = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to match Order type
      return (data || []).map((order) => ({
        ...order,
        delivery_address: order.delivery_address as Order['delivery_address'],
        notes: order.notes as string | null,
        order_items: order.order_items as OrderItem[],
      })) as Order[];
    },
    enabled: !!user,
  });
};

export const useOrderById = (orderId: string | undefined) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('id', orderId)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      return {
        ...data,
        delivery_address: data.delivery_address as Order['delivery_address'],
        notes: data.notes as string | null,
        order_items: data.order_items as OrderItem[],
      } as Order;
    },
    enabled: !!user && !!orderId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: {
      items: Array<{
        productId: string;
        productName: string;
        quantity: number;
        price: number;
      }>;
      deliveryAddress: Order['delivery_address'];
      paymentMethod: string;
      deliveryFee: number;
      total: number;
      notes?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          total: data.total,
          delivery_fee: data.deliveryFee,
          delivery_address: data.deliveryAddress,
          payment_method: data.paymentMethod,
          payment_status: 'pending',
          notes: data.notes || null,
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = data.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        price: item.price,
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
