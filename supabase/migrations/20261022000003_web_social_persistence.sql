-- Web social persistence: post metadata, comments, likes, and saved posts.
-- Apply after 20261019000001_initial_schema.sql and 20261022000002_profile_privacy.sql.

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS visibility VARCHAR(30) NOT NULL DEFAULT 'CAMPUS_COMMUNITY',
  ADD COLUMN IF NOT EXISTS comments_disabled BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS media_urls TEXT[] NOT NULL DEFAULT '{}';

-- Keep the browser's post action tables protected by row-level security.
DROP POLICY IF EXISTS "Authenticated users can read post likes" ON public.post_likes;
CREATE POLICY "Authenticated users can read post likes"
  ON public.post_likes FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can like posts as themselves" ON public.post_likes;
CREATE POLICY "Users can like posts as themselves"
  ON public.post_likes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove their own likes" ON public.post_likes;
CREATE POLICY "Users can remove their own likes"
  ON public.post_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can read comments" ON public.comments;
CREATE POLICY "Authenticated users can read comments"
  ON public.comments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can create comments as themselves" ON public.comments;
CREATE POLICY "Users can create comments as themselves"
  ON public.comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id AND EXISTS (
    SELECT 1 FROM public.posts p
    WHERE p.id = post_id AND p.comments_disabled = FALSE
  ));

DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE TO authenticated USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can read their saved posts" ON public.saved_posts;
CREATE POLICY "Users can read their saved posts"
  ON public.saved_posts FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can save posts as themselves" ON public.saved_posts;
CREATE POLICY "Users can save posts as themselves"
  ON public.saved_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unsave their own posts" ON public.saved_posts;
CREATE POLICY "Users can unsave their own posts"
  ON public.saved_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Maintain counters atomically in the database rather than trusting browser counts.
CREATE OR REPLACE FUNCTION public.refresh_post_like_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_post UUID;
BEGIN
  target_post := COALESCE(NEW.post_id, OLD.post_id);
  UPDATE public.posts
  SET likes_count = (SELECT COUNT(*)::INT FROM public.post_likes WHERE post_id = target_post)
  WHERE id = target_post;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$;

DROP TRIGGER IF EXISTS post_likes_refresh_count ON public.post_likes;
CREATE TRIGGER post_likes_refresh_count
AFTER INSERT OR DELETE ON public.post_likes
FOR EACH ROW EXECUTE FUNCTION public.refresh_post_like_count();

CREATE OR REPLACE FUNCTION public.refresh_post_comment_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_post UUID;
BEGIN
  target_post := COALESCE(NEW.post_id, OLD.post_id);
  UPDATE public.posts
  SET comments_count = (SELECT COUNT(*)::INT FROM public.comments WHERE post_id = target_post)
  WHERE id = target_post;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS comments_refresh_count ON public.comments;
CREATE TRIGGER comments_refresh_count
AFTER INSERT OR DELETE ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.refresh_post_comment_count();

-- Publish the social tables to Supabase Realtime if they are not already included.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'posts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'comments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'post_likes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.post_likes;
  END IF;
END $$;
