
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

DROP POLICY IF EXISTS "Article images are publicly accessible" ON storage.objects;
CREATE POLICY "Editors can list article images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'article-images'
  AND (public.has_role(auth.uid(), 'editor'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role))
);
