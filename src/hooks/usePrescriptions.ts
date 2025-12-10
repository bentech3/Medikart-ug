import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface Prescription {
  id: string;
  user_id: string;
  image_url: string;
  patient_name: string;
  patient_age: number | null;
  notes: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

// Helper to get signed URL for private prescription images
export const getPrescriptionImageUrl = async (imagePath: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('prescriptions')
    .createSignedUrl(imagePath, 3600); // 1 hour expiry
  
  if (error) throw error;
  return data.signedUrl;
};

export const usePrescriptions = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['prescriptions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Prescription[];
    },
    enabled: !!user,
  });
};

export const useSubmitPrescription = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: {
      imageFile: File;
      patientName: string;
      patientAge?: number;
      notes?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      // Upload image to storage
      const fileExt = data.imageFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('prescriptions')
        .upload(fileName, data.imageFile);
      
      if (uploadError) throw uploadError;
      
      // Store the path reference (bucket is private, use signed URLs when viewing)
      const imageUrl = fileName;
      
      // Create prescription record
      const { data: prescription, error } = await supabase
        .from('prescriptions')
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          patient_name: data.patientName,
          patient_age: data.patientAge || null,
          notes: data.notes || null,
          status: 'pending',
        })
        .select()
        .single();
      
      if (error) throw error;
      return prescription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });
};

export const useUpdatePrescriptionStatus = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: {
      id: string;
      status: 'approved' | 'rejected';
      rejectionReason?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('prescriptions')
        .update({
          status: data.status,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          rejection_reason: data.rejectionReason || null,
        })
        .eq('id', data.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });
};
