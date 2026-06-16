import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useEditor } from "@/contexts/EditorContext";
import { Navbar } from "@/components/Navbar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Podcast, BookOpen, Link2, Plus, Edit, Trash } from "lucide-react";
import { SEO } from "@/components/SEO";

interface Resource {
  id: number;
  category: string;
  title: string;
  description: string | null;
  metadata: string | null;
  url: string | null;
  icon: string | null;
  sort_order: number;
}

export default function Resources() {
  const { isEditorMode } = useEditor();
  const [resources, setResources] = useState<Resource[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    category: "podcasts",
    title: "",
    description: "",
    metadata: "",
    url: "",
    icon: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from("Resources")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingResource) {
        const { error } = await supabase
          .from("Resources")
          .update(formData)
          .eq("id", editingResource.id);

        if (error) throw error;

        toast({
          title: "Resource updated successfully",
        });
      } else {
        const { error } = await supabase.from("Resources").insert([formData]);

        if (error) throw error;

        toast({
          title: "Resource added successfully",
        });
      }

      setDialogOpen(false);
      setEditingResource(null);
      setFormData({
        category: "podcasts",
        title: "",
        description: "",
        metadata: "",
        url: "",
        icon: "",
      });
      fetchResources();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save resource",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("Resources").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Resource deleted successfully",
      });
      fetchResources();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      category: resource.category,
      title: resource.title,
      description: resource.description || "",
      metadata: resource.metadata || "",
      url: resource.url || "",
      icon: resource.icon || "",
    });
    setDialogOpen(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "podcasts":
        return <Podcast className="w-8 h-8" />;
      case "articles":
        return <BookOpen className="w-8 h-8" />;
      case "tools":
        return <Link2 className="w-8 h-8" />;
      default:
        return <BookOpen className="w-8 h-8" />;
    }
  };

  const podcasts = resources.filter((r) => r.category === "podcasts");
  const articles = resources.filter((r) => r.category === "articles");
  const tools = resources.filter((r) => r.category === "tools");

  return (
    <main className="min-h-screen bg-background">
      <SEO title={"Resources — The (un)Stable Net"} description={"Curated books, articles and tools on European markets, technology and AI."} path={"/resources"} />
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 font-body">
          Dive deeper into markets
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-body">
          Quick, vetted picks to get smart fast
        </p>
      </div>

      {/* Podcasts Section */}
      {podcasts.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 font-body">Podcasts</h2>
          <div className="space-y-4">
            {podcasts.map((resource) => (
              <a
                key={resource.id}
                href={resource.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`block bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow relative group ${!resource.url ? 'pointer-events-none' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary flex-shrink-0">
                    {getCategoryIcon(resource.category)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 font-body">{resource.title}</h3>
                    {resource.description && (
                      <p className="text-muted-foreground font-body">{resource.description}</p>
                    )}
                  </div>
                  {resource.metadata && (
                    <div className="text-right text-muted-foreground font-medium flex-shrink-0">
                      {resource.metadata}
                    </div>
                  )}
                  {isEditorMode && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                      <Button aria-label="Edit resource" 
                        size="sm" 
                        variant="outline" 
                        onClick={(e) => {
                          e.preventDefault();
                          openEditDialog(resource);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button aria-label="Delete resource"
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(resource.id);
                        }}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Articles Section */}
      {articles.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 font-body">Articles</h2>
          <div className="space-y-4">
            {articles.map((resource) => (
              <a
                key={resource.id}
                href={resource.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`block bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow relative group ${!resource.url ? 'pointer-events-none' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary flex-shrink-0">
                    {getCategoryIcon(resource.category)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 font-body">{resource.title}</h3>
                    {resource.description && (
                      <p className="text-muted-foreground font-body">{resource.description}</p>
                    )}
                  </div>
                  {resource.metadata && (
                    <div className="text-right text-muted-foreground font-medium flex-shrink-0">
                      {resource.metadata}
                    </div>
                  )}
                  {isEditorMode && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                      <Button aria-label="Edit resource" 
                        size="sm" 
                        variant="outline" 
                        onClick={(e) => {
                          e.preventDefault();
                          openEditDialog(resource);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button aria-label="Delete resource"
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(resource.id);
                        }}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Tools & Links Section */}
      {tools.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 font-body">Tools & Links</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {tools.map((resource) => (
              <a
                key={resource.id}
                href={resource.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`block bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow relative group ${!resource.url ? 'pointer-events-none' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary flex-shrink-0">
                    {getCategoryIcon(resource.category)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold font-body">{resource.title}</h3>
                  </div>
                  {isEditorMode && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                      <Button aria-label="Edit resource" 
                        size="sm" 
                        variant="outline" 
                        onClick={(e) => {
                          e.preventDefault();
                          openEditDialog(resource);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button aria-label="Delete resource"
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(resource.id);
                        }}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Add Resource Button (Editor Mode) */}
      {isEditorMode && (
        <div className="fixed bottom-8 right-8">
          <Button
            size="lg"
            onClick={() => {
              setEditingResource(null);
              setFormData({
                category: "podcasts",
                title: "",
                description: "",
                metadata: "",
                url: "",
                icon: "",
              });
              setDialogOpen(true);
            }}
            className="rounded-full shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Resource
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingResource ? "Edit Resource" : "Add New Resource"}</DialogTitle>
            <DialogDescription>
              Fill in the details for the resource you want to share with the community.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="podcasts">Podcasts</SelectItem>
                  <SelectItem value="articles">Articles</SelectItem>
                  <SelectItem value="tools">Tools & Links</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metadata">Metadata (duration/read time)</Label>
              <Input
                id="metadata"
                value={formData.metadata}
                onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
                placeholder="e.g., 45 min, 15 min read"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL (optional)</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">
              {editingResource ? "Update Resource" : "Add Resource"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
