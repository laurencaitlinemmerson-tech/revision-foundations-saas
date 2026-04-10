-- Add image support to Q&A tables
-- Run this in your Supabase SQL editor

-- Add image_url column to questions table
ALTER TABLE questions ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add image_url column to answers table  
ALTER TABLE answers ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create storage bucket for Q&A images (run this in Storage section or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('qa-images', 'qa-images', true);

-- Storage policies (run these after creating the bucket)
-- Allow anyone to view images
-- CREATE POLICY "Anyone can view qa images" ON storage.objects FOR SELECT USING (bucket_id = 'qa-images');

-- Allow authenticated users to upload images
-- CREATE POLICY "Authenticated users can upload qa images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'qa-images');
