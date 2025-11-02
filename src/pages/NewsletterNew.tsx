import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Upload, Lock } from "lucide-react";
import { useEditor } from "@/contexts/EditorContext";

const NewsletterNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isEditorMode } = useEditor();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [author, setAuthor] = useState("Editorial Team");
  const [readTime, setReadTime] = useState("5 min read");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = "";

      // Upload cover image if provided
      if (coverImage) {
        const fileExt = coverImage.name.split('.').pop();
        const fileName = `article-${Date.now()}.${fileExt}`;
        const filePath = `article-covers/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('article-images')
          .upload(filePath, coverImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('article-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // Create unique slug from title with timestamp
      const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const slug = `${baseSlug}-${Date.now()}`;

      // Insert article
      const { error: insertError } = await supabase
        .from('Articles')
        .insert({
          title,
          subtitle,
          content,
          tag,
          author,
          read_time: readTime,
          image_url: imageUrl,
          slug,
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      toast({
        title: "Article created",
        description: "Your article has been published successfully.",
      });

      navigate('/newsletter');
    } catch (error: any) {
      console.error('Error creating article:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isEditorMode) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/newsletter')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Newsletter
        </Button>

        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Lock className="w-16 h-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Editor Access Required</h1>
          <p className="text-muted-foreground text-center max-w-md">
            You need to be logged in as an editor to create new articles. Please sign in with your editor account.
          </p>
          <Button onClick={() => navigate('/newsletter')} variant="outline">
            Go Back to Newsletter
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/newsletter')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Newsletter
      </Button>

      <h1 className="text-3xl md:text-4xl font-bold mb-8">Create New Article</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="tag">Tag *</Label>
          <Input
            id="tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="e.g., Banks, Energy, Tech"
            required
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="readTime">Read Time</Label>
            <Input
              id="readTime"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="cover">Cover Image</Label>
          <div className="mt-1">
            <label htmlFor="cover" className="cursor-pointer">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover preview" className="max-h-64 mx-auto rounded-lg" />
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload cover image</p>
                  </div>
                )}
              </div>
              <input
                id="cover"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div>
          <Label>Content *</Label>
          <div className="mt-1">
            <RichTextEditor content={content} onChange={setContent} />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? "Publishing..." : "Publish Article"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/newsletter')}>
            Cancel
          </Button>
        </div>
      </form>
    </main>
  );
};

export default NewsletterNew;
