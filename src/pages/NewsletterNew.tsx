import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Upload, ImagePlus, Loader2 } from "lucide-react";

const NewsletterNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [author, setAuthor] = useState("Editorial Team");
  const [readTime, setReadTime] = useState("5 min read");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);
  const inlineFileRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleInlineImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingInline(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `inline-${Date.now()}.${fileExt}`;
      const filePath = `inline/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(filePath);
      const imgTag = `<img src="${publicUrl}" alt="Article image" style="max-width:100%; border-radius:8px; margin:16px 0;" />`;
      const textarea = contentRef.current;
      const pos = textarea?.selectionStart ?? content.length;
      const newContent = content.slice(0, pos) + imgTag + content.slice(pos);
      setContent(newContent);
      toast({ title: "Immagine inserita", description: "L'immagine è stata caricata e inserita nel contenuto." });
    } catch (err: any) {
      toast({ title: "Errore", description: err.message || "Upload fallito.", variant: "destructive" });
    } finally {
      setUploadingInline(false);
      e.target.value = '';
    }
  };

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
      const { data: newArticle, error: insertError } = await supabase
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
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      // Send notifications to subscribers
      try {
        await supabase.functions.invoke('notify-subscribers', {
          body: {
            articleId: newArticle.id,
            articleTitle: title,
            articleSubtitle: subtitle,
            articleSlug: slug,
          },
        });
      } catch (notifyError) {
        console.error('Error sending notifications:', notifyError);
        // Don't fail the article creation if notifications fail
      }

      toast({
        title: "Articolo creato",
        description: "L'articolo è stato pubblicato con successo.",
      });

      navigate('/newsletter');
    } catch (error: any) {
      console.error('Error creating article:', error);
      toast({
        title: "Errore",
        description: error.message || "Impossibile creare l'articolo. Riprova.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/newsletter')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Torna alla Newsletter
      </Button>

      <h1 className="text-3xl md:text-4xl font-bold mb-8">Crea Nuovo Articolo</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Titolo *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1"
            placeholder="Inserisci il titolo dell'articolo"
          />
        </div>

        <div>
          <Label htmlFor="subtitle">Sottotitolo</Label>
          <Input
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="mt-1"
            placeholder="Inserisci il sottotitolo (opzionale)"
          />
        </div>

        <div>
          <Label htmlFor="tag">Tag *</Label>
          <Input
            id="tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="es: Banks, Energy, Tech"
            required
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="author">Autore</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="readTime">Tempo di Lettura</Label>
            <Input
              id="readTime"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="cover">Immagine di Copertina</Label>
          <div className="mt-1">
            <label htmlFor="cover" className="cursor-pointer">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                {coverPreview ? (
                  <img src={coverPreview} alt="Anteprima copertina" className="max-h-64 mx-auto rounded-lg" />
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Clicca per caricare l'immagine di copertina</p>
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
          <Label htmlFor="content">Contenuto * (HTML supportato)</Label>
          <div className="flex items-center gap-2 mt-1 mb-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadingInline}
              onClick={() => inlineFileRef.current?.click()}
            >
              {uploadingInline ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <ImagePlus className="w-4 h-4 mr-1" />}
              Inserisci Immagine
            </Button>
            <input ref={inlineFileRef} type="file" accept="image/*" onChange={handleInlineImage} className="hidden" />
          </div>
          <Textarea
            ref={contentRef}
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="mt-1 min-h-[400px] font-mono text-sm"
            placeholder="Scrivi il contenuto dell'articolo qui. Puoi usare HTML per la formattazione."
          />
          <p className="text-xs text-muted-foreground mt-2">
            Puoi usare tag HTML come &lt;p&gt;, &lt;h2&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, ecc.
          </p>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? "Pubblicazione..." : "Pubblica Articolo"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/newsletter')}>
            Annulla
          </Button>
        </div>
      </form>
    </main>
  );
};

export default NewsletterNew;
