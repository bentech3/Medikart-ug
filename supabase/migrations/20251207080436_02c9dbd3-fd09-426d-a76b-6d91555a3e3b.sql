-- Create storage bucket for prescription images
INSERT INTO storage.buckets (id, name, public)
VALUES ('prescriptions', 'prescriptions', false);

-- RLS policies for prescription uploads
CREATE POLICY "Users can upload their own prescriptions"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'prescriptions' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own prescriptions"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'prescriptions' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Pharmacists can view all prescriptions"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'prescriptions' 
    AND (public.has_role(auth.uid(), 'pharmacist') OR public.has_role(auth.uid(), 'admin'))
);