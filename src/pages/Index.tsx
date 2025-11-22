import { Link } from "react-router-dom";
import { Linkedin, Github, Youtube, Upload, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { useEditor } from "@/contexts/EditorContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Index = () => {
  const { isEditorMode } = useEditor();
  const { toast } = useToast();
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [projectCovers, setProjectCovers] = useState<{
    newsletter: { id: number | null; imageUrl: string };
    "million-slots": { id: number | null; imageUrl: string };
    "coming-soon": { id: number | null; imageUrl: string };
  }>({
    newsletter: { id: null, imageUrl: "" },
    "million-slots": { id: null, imageUrl: "" },
    "coming-soon": { id: null, imageUrl: "" },
  });
  const [uploading, setUploading] = useState(false);

  // Fetch project covers from Supabase on mount
  useEffect(() => {
    const fetchCovers = async () => {
      try {
        const { data, error } = await supabase.from("Covers").select("*").eq("category", "project");

        if (error) throw error;

        if (data) {
          const newsletter = data.find((cover) => cover.name === "newsletter");
          const millionSlots = data.find((cover) => cover.name === "million-slots");
          const comingSoon = data.find((cover) => cover.name === "coming-soon");

          setProjectCovers({
            newsletter: { id: newsletter?.id || null, imageUrl: newsletter?.image || "" },
            "million-slots": { id: millionSlots?.id || null, imageUrl: millionSlots?.image || "" },
            "coming-soon": { id: comingSoon?.id || null, imageUrl: comingSoon?.image || "" },
          });
        }
      } catch (error) {
        console.error("Error fetching covers:", error);
      }
    };

    fetchCovers();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, projectId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${projectId}-${Math.random()}.${fileExt}`;
      const filePath = `project-covers/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("article-images").upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("article-images").getPublicUrl(filePath);

      // Update Supabase Covers table
      const coverId = projectCovers[projectId as keyof typeof projectCovers]?.id;

      if (coverId) {
        // Update existing record
        const { error: updateError } = await supabase.from("Covers").update({ image: publicUrl }).eq("id", coverId);

        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { data: newCover, error: insertError } = await supabase
          .from("Covers")
          .insert({
            category: "project",
            name: projectId,
            image: publicUrl,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        if (newCover) {
          setProjectCovers((prev) => ({
            ...prev,
            [projectId]: { id: newCover.id, imageUrl: publicUrl },
          }));
        }
      }

      setProjectCovers((prev) => ({
        ...prev,
        [projectId]: { ...prev[projectId as keyof typeof projectCovers], imageUrl: publicUrl },
      }));

      toast({
        title: "Image uploaded",
        description: "Project cover image updated and saved successfully.",
      });

      setEditingProject(null);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Circuit board animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D4A574] via-[#C89B68] to-[#B8865A] dark:from-[#2a1f15] dark:via-[#3d2a1a] dark:to-[#1f1812]" />

      {/* Circuit board pattern overlay - inspired by tech aesthetics */}
      <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA94D" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FFBE7B" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FFD6A5" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Vertical circuit lines descending from top */}
        <g className="animate-pulse-slow">
          <line x1="10%" y1="0" x2="10%" y2="100%" stroke="url(#circuitGrad)" strokeWidth="2" />
          <circle cx="10%" cy="15%" r="5" fill="url(#circuitGrad)" />
          <circle cx="10%" cy="45%" r="5" fill="url(#circuitGrad)" />
          <circle cx="10%" cy="75%" r="5" fill="url(#circuitGrad)" />

          <line x1="25%" y1="0" x2="25%" y2="85%" stroke="url(#circuitGrad)" strokeWidth="2" />
          <circle cx="25%" cy="20%" r="5" fill="url(#circuitGrad)" />
          <circle cx="25%" cy="55%" r="5" fill="url(#circuitGrad)" />

          <line x1="40%" y1="0" x2="40%" y2="100%" stroke="url(#circuitGrad)" strokeWidth="2" />
          <circle cx="40%" cy="25%" r="5" fill="url(#circuitGrad)" />
          <circle cx="40%" cy="60%" r="5" fill="url(#circuitGrad)" />
          <circle cx="40%" cy="90%" r="5" fill="url(#circuitGrad)" />

          <line x1="55%" y1="0" x2="55%" y2="80%" stroke="url(#circuitGrad)" strokeWidth="2" />
          <circle cx="55%" cy="18%" r="5" fill="url(#circuitGrad)" />
          <circle cx="55%" cy="50%" r="5" fill="url(#circuitGrad)" />

          <line x1="70%" y1="0" x2="70%" y2="100%" stroke="url(#circuitGrad)" strokeWidth="2" />
          <circle cx="70%" cy="30%" r="5" fill="url(#circuitGrad)" />
          <circle cx="70%" cy="65%" r="5" fill="url(#circuitGrad)" />

          <line x1="85%" y1="0" x2="85%" y2="90%" stroke="url(#circuitGrad)" strokeWidth="2" />
          <circle cx="85%" cy="22%" r="5" fill="url(#circuitGrad)" />
          <circle cx="85%" cy="58%" r="5" fill="url(#circuitGrad)" />
        </g>

        {/* Horizontal connecting lines */}
        <g className="animate-pulse-slow" style={{ animationDelay: "0.5s" }}>
          <line x1="0" y1="20%" x2="100%" y2="20%" stroke="url(#circuitGrad)" strokeWidth="2" />
          <line x1="15%" y1="50%" x2="95%" y2="50%" stroke="url(#circuitGrad)" strokeWidth="2" />
          <line x1="0" y1="75%" x2="85%" y2="75%" stroke="url(#circuitGrad)" strokeWidth="2" />
          <line x1="20%" y1="90%" x2="100%" y2="90%" stroke="url(#circuitGrad)" strokeWidth="2" />
        </g>

        {/* Hexagon shapes scattered */}
        <g className="animate-float">
          <polygon
            points="150,100 175,115 175,145 150,160 125,145 125,115"
            fill="none"
            stroke="url(#circuitGrad)"
            strokeWidth="2.5"
          />
          <polygon
            points="450,250 485,272 485,316 450,338 415,316 415,272"
            fill="none"
            stroke="url(#circuitGrad)"
            strokeWidth="2.5"
          />
          <polygon
            points="800,150 830,167 830,201 800,218 770,201 770,167"
            fill="none"
            stroke="url(#circuitGrad)"
            strokeWidth="2.5"
          />
          <polygon
            points="300,450 320,463 320,489 300,502 280,489 280,463"
            fill="none"
            stroke="url(#circuitGrad)"
            strokeWidth="2.5"
          />
          <polygon
            points="650,400 680,420 680,460 650,480 620,460 620,420"
            fill="none"
            stroke="url(#circuitGrad)"
            strokeWidth="2.5"
          />
        </g>

        {/* Diagonal circuit paths */}
        <g className="animate-pulse-slow" style={{ animationDelay: "1s" }}>
          <path d="M 0 100 L 100 130 L 200 120 L 300 145" stroke="url(#circuitGrad)" strokeWidth="2" fill="none" />
          <path d="M 200 250 L 350 270 L 500 265 L 650 280" stroke="url(#circuitGrad)" strokeWidth="2" fill="none" />
          <path d="M 400 350 L 550 330 L 700 340 L 850 325" stroke="url(#circuitGrad)" strokeWidth="2" fill="none" />
        </g>

        {/* Additional connection nodes */}
        <g className="animate-pulse-slow" style={{ animationDelay: "1.5s" }}>
          <circle cx="5%" cy="35%" r="4" fill="url(#circuitGrad)" />
          <circle cx="20%" cy="40%" r="4" fill="url(#circuitGrad)" />
          <circle cx="35%" cy="28%" r="4" fill="url(#circuitGrad)" />
          <circle cx="50%" cy="42%" r="4" fill="url(#circuitGrad)" />
          <circle cx="65%" cy="38%" r="4" fill="url(#circuitGrad)" />
          <circle cx="80%" cy="45%" r="4" fill="url(#circuitGrad)" />
          <circle cx="95%" cy="32%" r="4" fill="url(#circuitGrad)" />
        </g>
      </svg>

      {/* Subtle dot grid overlay */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `radial-gradient(circle at center, #FFA94D 1.5px, transparent 1.5px)`,
          backgroundSize: "35px 35px",
          animation: "grid-move 25s linear infinite",
        }}
      />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold font-body mb-6 bg-gradient-to-r from-[#FFA94D] via-[#FF8C3D] to-[#FF6B2B] bg-clip-text text-transparent">
          The (un)Stable Net
        </h1>
        <p className="text-xl md:text-2xl font-body text-foreground max-w-3xl">
          A blog about financial markets, tech & AI and content creation
        </p>
      </section>

      {/* Projects Section */}
      <section className="container mx-auto px-4 pb-20 relative z-10">
        <h2 className="text-4xl font-bold font-body text-foreground mb-12">Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card A - Newsletter Project - Links to Newsletter */}
          <Link to="/newsletter" className="block group">
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 h-full hover:shadow-xl transition-all duration-300 border border-border hover:scale-105 transform relative">
              {isEditorMode && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    setEditingProject("newsletter");
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
              <h3 className="text-2xl font-bold font-body mb-3">Newsletter project</h3>
              <p className="text-muted-foreground font-body mb-6">
                European Market Movers: weekly macro & market signals
              </p>
              {projectCovers.newsletter.imageUrl ? (
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={projectCovers.newsletter.imageUrl}
                    alt="Newsletter cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  <svg className="w-full h-full" viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,150 Q100,100 200,120 T400,100 L400,250 L0,250 Z" fill="url(#grad1)" opacity="0.6" />
                    <path d="M0,170 Q100,130 200,150 T400,140 L400,250 L0,250 Z" fill="url(#grad2)" opacity="0.4" />
                    <defs>
                      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} />
                      </linearGradient>
                      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}
            </div>
          </Link>

          {/* Card B - Million Slots Card - Links to Million Slots */}
          <Link to="/million-slots" className="block group">
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 h-full border border-border hover:scale-105 hover:shadow-xl transition-all duration-300 transform relative">
              {isEditorMode && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => {
                    setEditingProject("million-slots");
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
              <h3 className="text-2xl font-bold font-body mb-3">The Million Slots AI Billboard</h3>
              <p className="text-muted-foreground font-body mb-6">A 1,000,000-tile digital mosaic of AI micro-videos</p>
              {projectCovers["million-slots"].imageUrl ? (
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={projectCovers["million-slots"].imageUrl}
                    alt="Million Slots cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-primary/30 to-secondary/30 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  <div className="w-full h-full grid grid-cols-10 grid-rows-10 gap-0.5 p-2">
                    {Array.from({ length: 100 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-br from-primary to-accent rounded-sm opacity-70"
                        style={{
                          animationDelay: `${i * 0.02}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Link>

          {/* Card C - Coming Soon - Not Clickable */}
          <div
            className="bg-background/60 backdrop-blur-sm rounded-lg p-6 h-full border border-border opacity-50 saturate-50 pointer-events-none relative"
            aria-disabled="true"
          >
            {isEditorMode && (
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2 z-10"
                onClick={() => {
                  setEditingProject("coming-soon");
                }}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
            <h3 className="text-2xl font-bold font-body mb-3">Coming soon</h3>
            <p className="text-muted-foreground font-body mb-6">New projects and deep dives are landing shortly.</p>
            {projectCovers["coming-soon"].imageUrl ? (
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={projectCovers["coming-soon"].imageUrl}
                  alt="Coming soon cover"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-secondary/20 to-primary/20 rounded-lg overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent opacity-40 animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project Cover</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cover-upload">Upload Cover Image</Label>
              <Input
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={(e) => editingProject && handleImageUpload(e, editingProject)}
                disabled={uploading}
                className="mt-1"
              />
              {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
            </div>
            {editingProject && projectCovers[editingProject as keyof typeof projectCovers]?.imageUrl && (
              <div>
                <Label>Current Cover</Label>
                <img
                  src={projectCovers[editingProject as keyof typeof projectCovers].imageUrl}
                  alt="Cover preview"
                  className="w-full h-40 object-cover rounded-lg mt-2"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
