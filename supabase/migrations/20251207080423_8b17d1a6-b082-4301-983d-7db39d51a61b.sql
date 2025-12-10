-- Fix the update_updated_at_column function with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Insert seed products data
INSERT INTO public.products (name, description, price, original_price, image, category, brand, dosage, stock, requires_prescription, is_featured) VALUES
('Panadol Extra', 'Fast-acting pain relief for headaches, muscle pain, and fever. Contains paracetamol and caffeine for enhanced effectiveness.', 8500, 10000, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', 'pain-fever', 'GSK', '500mg', 150, false, true),
('Hedex Extra', 'Effective relief from headaches, migraines, and body aches. Trusted formula for quick relief.', 7500, NULL, 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400', 'pain-fever', 'Hedex', '500mg', 200, false, false),
('Ibuprofen', 'Anti-inflammatory pain reliever for muscle pain, dental pain, and menstrual cramps.', 12000, NULL, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400', 'pain-fever', 'Generic', '400mg', 100, false, true),
('Aspirin', 'Classic pain reliever and fever reducer. Also used for heart health prevention.', 6500, NULL, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400', 'pain-fever', 'Bayer', '300mg', 180, false, false),
('Amoxicillin', 'Broad-spectrum antibiotic for bacterial infections. Requires prescription from a licensed physician.', 25000, NULL, 'https://images.unsplash.com/photo-1559757175-7cb057fba93c?w=400', 'antibiotics', 'Generic', '500mg', 50, true, true),
('Azithromycin', 'Antibiotic for respiratory and skin infections. 3-day treatment course.', 35000, 40000, 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400', 'antibiotics', 'Zithromax', '250mg', 40, true, false),
('Ciprofloxacin', 'Fluoroquinolone antibiotic for urinary tract and respiratory infections.', 28000, NULL, 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400', 'antibiotics', 'Generic', '500mg', 60, true, false),
('Metronidazole', 'Antibiotic for bacterial and parasitic infections including giardia and amoebiasis.', 15000, NULL, 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400', 'antibiotics', 'Flagyl', '400mg', 80, true, false),
('Calpol Infant Drops', 'Gentle paracetamol drops for babies 2+ months. Sugar-free formula for fever and pain relief.', 18000, NULL, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', 'baby-care', 'Calpol', '100mg/ml', 75, false, true),
('Gripe Water', 'Natural relief for baby colic, gas, and stomach discomfort. Gentle herbal formula.', 12000, NULL, 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400', 'baby-care', 'Woodwards', '150ml', 100, false, false),
('Baby Zinc Syrup', 'Essential zinc supplement for healthy growth and immune system support in children.', 22000, 25000, 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400', 'baby-care', 'Generic', '20mg/5ml', 60, false, false),
('Vitamin C 1000mg', 'High-strength vitamin C for immune support and antioxidant protection.', 35000, 42000, 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400', 'supplements', 'Nature Made', '1000mg', 90, false, true),
('Omega-3 Fish Oil', 'Premium fish oil for heart, brain, and joint health. High EPA and DHA content.', 55000, NULL, 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=400', 'supplements', 'Nordic Naturals', '1000mg', 45, false, false),
('Multivitamin Complete', 'Daily multivitamin with essential vitamins and minerals for overall health.', 48000, NULL, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', 'supplements', 'Centrum', 'Daily', 120, false, true),
('Zinc Tablets', 'Immune-boosting zinc supplement. Helps with wound healing and metabolism.', 28000, NULL, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400', 'supplements', 'Generic', '50mg', 100, false, false),
('Nivea Body Lotion', 'Deep moisturizing body lotion for soft, smooth skin. 48-hour hydration.', 25000, 30000, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', 'cosmetics', 'Nivea', '400ml', 80, false, true),
('Vaseline Petroleum Jelly', 'Multi-purpose skin protectant for dry skin, minor cuts, and lip care.', 8500, NULL, 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400', 'cosmetics', 'Vaseline', '250g', 150, false, false);