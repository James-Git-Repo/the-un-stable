
REVOKE SELECT (user_email) ON public.comments FROM anon, authenticated;

DROP POLICY IF EXISTS "Authenticated users can upload article images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update article images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete article images" ON storage.objects;

DROP POLICY IF EXISTS "Anyone can submit contributions" ON public."Contributions";
CREATE POLICY "Anyone can submit contributions"
ON public."Contributions"
FOR INSERT
TO public
WITH CHECK (
  char_length(coalesce(name, '')) BETWEEN 1 AND 200
  AND char_length(coalesce(email, '')) BETWEEN 3 AND 320
  AND char_length(coalesce(article_topic, '')) BETWEEN 1 AND 500
  AND char_length(coalesce(article_summary, '')) BETWEEN 1 AND 5000
);

DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public."Newsletter Sub";
CREATE POLICY "Anyone can subscribe to newsletter"
ON public."Newsletter Sub"
FOR INSERT
TO public
WITH CHECK (char_length(coalesce(email, '')) BETWEEN 3 AND 320);

DROP POLICY IF EXISTS "Anyone can submit questions" ON public."Questions";
CREATE POLICY "Anyone can submit questions"
ON public."Questions"
FOR INSERT
TO public
WITH CHECK (
  char_length(coalesce(name, '')) BETWEEN 1 AND 200
  AND char_length(coalesce(email, '')) BETWEEN 3 AND 320
  AND char_length(coalesce(question, '')) BETWEEN 1 AND 5000
);

DROP POLICY IF EXISTS "Anyone can create comments" ON public.comments;
CREATE POLICY "Anyone can create comments"
ON public.comments
FOR INSERT
TO public
WITH CHECK (
  char_length(coalesce(user_name, '')) BETWEEN 1 AND 100
  AND char_length(coalesce(user_email, '')) BETWEEN 3 AND 320
  AND char_length(coalesce(content, '')) BETWEEN 1 AND 5000
);

REVOKE EXECUTE ON FUNCTION public.auto_create_cover_category() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.auto_delete_cover_category() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
