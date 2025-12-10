-- Add storage policy for pharmacists to view prescription images
CREATE POLICY "Pharmacists can view all prescription images"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'prescriptions' 
  AND (
    public.has_role(auth.uid(), 'pharmacist') 
    OR public.has_role(auth.uid(), 'admin')
  )
);

-- Users can view their own prescription images
CREATE POLICY "Users can view their own prescription images"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'prescriptions' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can upload prescription images to their own folder
CREATE POLICY "Users can upload prescription images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'prescriptions' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);