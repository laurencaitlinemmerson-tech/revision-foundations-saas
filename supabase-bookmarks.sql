-- Bookmarks and folders for The Nurse Lab
-- Run this in the Supabase SQL editor after your core schema.
--
-- Note:
-- This project currently authenticates through Clerk in the app layer.
-- `user_id` is stored as TEXT so it can safely hold the authenticated subject
-- from Clerk today or a Supabase Auth UUID later if you migrate.

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.folders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id TEXT NOT NULL,
  name VARCHAR(50) NOT NULL,
  emoji VARCHAR(16) NOT NULL DEFAULT '📚',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bookmarks (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id TEXT NOT NULL,
  folder_id BIGINT NOT NULL REFERENCES public.folders(id) ON DELETE CASCADE,
  hub_item_id VARCHAR(120) NOT NULL,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS folders_user_name_unique_idx
  ON public.folders (user_id, LOWER(name));

CREATE UNIQUE INDEX IF NOT EXISTS bookmarks_folder_item_unique_idx
  ON public.bookmarks (folder_id, hub_item_id);

CREATE INDEX IF NOT EXISTS idx_folders_user_id
  ON public.folders (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id
  ON public.bookmarks (user_id, saved_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookmarks_folder_id
  ON public.bookmarks (folder_id, saved_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookmarks_hub_item_id
  ON public.bookmarks (hub_item_id);

DROP TRIGGER IF EXISTS update_folders_updated_at ON public.folders;
CREATE TRIGGER update_folders_updated_at
  BEFORE UPDATE ON public.folders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "folders_select_own" ON public.folders;
CREATE POLICY "folders_select_own"
  ON public.folders
  FOR SELECT
  USING (
    COALESCE(auth.jwt() ->> 'sub', auth.uid()::text) = user_id
  );

DROP POLICY IF EXISTS "folders_insert_own" ON public.folders;
CREATE POLICY "folders_insert_own"
  ON public.folders
  FOR INSERT
  WITH CHECK (
    COALESCE(auth.jwt() ->> 'sub', auth.uid()::text) = user_id
  );

DROP POLICY IF EXISTS "folders_update_own" ON public.folders;
CREATE POLICY "folders_update_own"
  ON public.folders
  FOR UPDATE
  USING (
    COALESCE(auth.jwt() ->> 'sub', auth.uid()::text) = user_id
  )
  WITH CHECK (
    COALESCE(auth.jwt() ->> 'sub', auth.uid()::text) = user_id
  );

DROP POLICY IF EXISTS "folders_delete_own" ON public.folders;
CREATE POLICY "folders_delete_own"
  ON public.folders
  FOR DELETE
  USING (
    COALESCE(auth.jwt() ->> 'sub', auth.uid()::text) = user_id
  );

DROP POLICY IF EXISTS "bookmarks_select_own" ON public.bookmarks;
CREATE POLICY "bookmarks_select_own"
  ON public.bookmarks
  FOR SELECT
  USING (
    COALESCE(auth.jwt() ->> 'sub', auth.uid()::text) = user_id
  );

DROP POLICY IF EXISTS "bookmarks_insert_own" ON public.bookmarks;
CREATE POLICY "bookmarks_insert_own"
  ON public.bookmarks
  FOR INSERT
  WITH CHECK (
    COALESCE(auth.jwt() ->> 'sub', auth.uid()::text) = user_id
    AND EXISTS (
      SELECT 1
      FROM public.folders
      WHERE folders.id = bookmarks.folder_id
      AND folders.user_id = COALESCE(auth.jwt() ->> 'sub', auth.uid()::text)
    )
  );

DROP POLICY IF EXISTS "bookmarks_delete_own" ON public.bookmarks;
CREATE POLICY "bookmarks_delete_own"
  ON public.bookmarks
  FOR DELETE
  USING (
    COALESCE(auth.jwt() ->> 'sub', auth.uid()::text) = user_id
  );

GRANT ALL ON public.folders TO service_role;
GRANT ALL ON public.bookmarks TO service_role;
