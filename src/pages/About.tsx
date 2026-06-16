import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useEditor } from "@/contexts/EditorContext";
import { Upload } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Linkedin, Youtube, Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";

export default function About() {
  const { isEditorMode } = useEditor();
  const [askQuestionsOpen, setAskQuestionsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [gridImage, setGridImage] = useState("");
  const [communityImage, setCommunityImage] = useState("");
  const [photo1, setPhoto1] = useState("");
  const [photo2, setPhoto2] = useState("");
  const [photo3, setPhoto3] = useState("");
  const [heroImageId, setHeroImageId] = useState<number | null>(null);
  const [gridImageId, setGridImageId] = useState<number | null>(null);
  const [communityImageId, setCommunityImageId] = useState<number | null>(null);
  const [photo1Id, setPhoto1Id] = useState<number | null>(null);
  const [photo2Id, setPhoto2Id] = useState<number | null>(null);
  const [photo3Id, setPhoto3Id] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch images from Supabase on mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase.from("Covers").select("*").eq("category", "about");

        if (error) throw error;

        if (data) {
          const heroData = data.find((img) => img.name === "hero-photo");
          const gridData = data.find((img) => img.name === "grid-photo");
          const communityData = data.find((img) => img.name === "community-photo");
          const photo1Data = data.find((img) => img.name === "photo1");
          const photo2Data = data.find((img) => img.name === "photo2");
          const photo3Data = data.find((img) => img.name === "photo3");

          if (heroData) {
            setHeroImage(heroData.image || "");
            setHeroImageId(heroData.id);
          }
          if (gridData) {
            setGridImage(gridData.image || "");
            setGridImageId(gridData.id);
          }
          if (communityData) {
            setCommunityImage(communityData.image || "");
            setCommunityImageId(communityData.id);
          }
          if (photo1Data) {
            setPhoto1(photo1Data.image || "");
            setPhoto1Id(photo1Data.id);
          }
          if (photo2Data) {
            setPhoto2(photo2Data.image || "");
            setPhoto2Id(photo2Data.id);
          }
          if (photo3Data) {
            setPhoto3(photo3Data.image || "");
            setPhoto3Id(photo3Data.id);
          }
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: "hero" | "grid" | "community" | "photo1" | "photo2" | "photo3",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `about-${imageType}-${Date.now()}.${fileExt}`;
      const filePath = `about-images/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage.from("article-images").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("article-images").getPublicUrl(filePath);

      console.log("Public URL:", publicUrl);

      // Determine cover name and ID - match database naming convention
      const coverName =
        imageType === "hero"
          ? "hero-photo"
          : imageType === "grid"
            ? "grid-photo"
            : imageType === "community"
              ? "community-photo"
              : imageType;
      const coverId =
        imageType === "hero"
          ? heroImageId
          : imageType === "grid"
            ? gridImageId
            : imageType === "community"
              ? communityImageId
              : imageType === "photo1"
                ? photo1Id
                : imageType === "photo2"
                  ? photo2Id
                  : photo3Id;

      if (coverId) {
        // Update existing record
        console.log("Updating existing cover:", coverId);
        const { error: updateError } = await supabase.from("Covers").update({ image: publicUrl }).eq("id", coverId);

        if (updateError) {
          console.error("Update error:", updateError);
          throw updateError;
        }
      } else {
        // Insert new record
        console.log("Inserting new cover");
        const { data: newCover, error: insertError } = await supabase
          .from("Covers")
          .insert({
            category: "about",
            name: coverName,
            image: publicUrl,
          })
          .select()
          .single();

        if (insertError) {
          console.error("Insert error:", insertError);
          throw insertError;
        }

        if (newCover) {
          console.log("New cover created:", newCover);
          if (imageType === "hero") setHeroImageId(newCover.id);
          else if (imageType === "grid") setGridImageId(newCover.id);
          else if (imageType === "community") setCommunityImageId(newCover.id);
          else if (imageType === "photo1") setPhoto1Id(newCover.id);
          else if (imageType === "photo2") setPhoto2Id(newCover.id);
          else if (imageType === "photo3") setPhoto3Id(newCover.id);
        }
      }

      // Update local state
      if (imageType === "hero") setHeroImage(publicUrl);
      else if (imageType === "grid") setGridImage(publicUrl);
      else if (imageType === "community") setCommunityImage(publicUrl);
      else if (imageType === "photo1") setPhoto1(publicUrl);
      else if (imageType === "photo2") setPhoto2(publicUrl);
      else if (imageType === "photo3") setPhoto3(publicUrl);

      toast({
        title: "Image uploaded",
        description: "Your photo has been uploaded and saved successfully.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from("Questions").insert({
        name: name,
        email: email,
        question: question,
      });

      if (error) throw error;

      toast({
        title: "Question submitted!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      setName("");
      setEmail("");
      setQuestion("");
      setAskQuestionsOpen(false);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <SEO
        title="About Jacopo and The (un)Stable Net"
        description="Meet Jacopo Berton — Swiss–Italian writer behind The (un)Stable Net, a project at the intersection of European markets, technology, AI and craft."
        path="/about"
      />
      {/* Main Content */}
      <main className="flex-1">
        {/* Split Hero Section - Half Text, Half Photo */}
        <div className="relative py-12 md:py-20 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Left: Title Text */}
                <div className="order-1">
                  <h1 className="text-3xl md:text-5xl font-bold font-body mb-6 bg-gradient-to-r from-[#FFA94D] via-[#FF8C3D] to-[#FF6B2B] bg-clip-text text-transparent leading-tight">
                    About Jacopo and The (un)Stable Net
                  </h1>
                  <p className="text-xl md:text-2xl font-body text-foreground/90 italic">
                    In the end it always comes down to the same old tradeoff: what's more valuable for you, time or money?
                  </p>
                </div>

                {/* Right: Hero Photo */}
                <div className="order-2 relative">
                  <div className="relative aspect-square transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    {isEditorMode ? (
                      <label className="cursor-pointer block w-full h-full">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "hero")}
                          className="hidden"
                        />
                        {heroImage ? (
                          <img src={heroImage} alt="Profile" className="w-full h-full object-cover shadow-2xl" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#D4A574]/30 via-[#C89B68]/20 to-[#B8865A]/30 flex items-center justify-center shadow-2xl">
                            <span className="text-muted-foreground text-lg font-body">Click to Upload Hero Photo</span>
                          </div>
                        )}
                      </label>
                    ) : (
                      <>
                        {heroImage ? (
                          <img src={heroImage} alt="Profile" className="w-full h-full object-cover shadow-2xl" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#D4A574]/30 via-[#C89B68]/20 to-[#B8865A]/30 flex items-center justify-center shadow-2xl">
                            <span className="text-muted-foreground text-lg font-body">Hero Photo</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Introduction */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-4xl font-bold font-body mb-8 text-center">
                  Welcome to the TSN project: the space where I channel my passions and skills into meaningful outputs.
                </h2>

                <div className="prose prose-lg max-w-none text-foreground/80">
                  <p className="leading-relaxed mb-6 text-justify">
                    Hi I'm Jacopo, Swiss–Italian and endlessly curious. I love the moment an idea clicks; the scribble
                    that turns into a plan, the first draft that suddenly breathes. I'm happiest building small things
                    that make bigger things possible: a tidy workflow, a clear brief, a tool that quietly does its job.
                    What pulls me forward: well-crafted design, honest conversations, and teams that care about the
                    details. I like rooms where people listen, events that actually create serendipity, and dashboards
                    that tell a story at a glance. I enjoy tinkering with AI and finance not for the buzz but for the
                    craft; turning data into something you can feel and use.
                  </p>
                </div>
              </div>

              {/* Photo Grid Section - Angled, No Frames */}
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                {[
                  { image: photo1, id: photo1Id, type: "photo1" as const, rotation: "-rotate-2" },
                  { image: photo2, id: photo2Id, type: "photo2" as const, rotation: "rotate-3" },
                  { image: photo3, id: photo3Id, type: "photo3" as const, rotation: "-rotate-1" },
                ].map((photo) => (
                  <div key={photo.type} className="relative">
                    <div
                      className={`aspect-[4/5] overflow-hidden shadow-2xl transform ${photo.rotation} hover:rotate-0 transition-all duration-300 hover:scale-105`}
                    >
                      {isEditorMode ? (
                        <label className="cursor-pointer block w-full h-full">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, photo.type)}
                            className="hidden"
                          />
                          {photo.image ? (
                            <img src={photo.image} alt={`Photo ${photo.type}`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                              <span className="text-muted-foreground text-sm font-body">Click to Upload Photo</span>
                            </div>
                          )}
                        </label>
                      ) : (
                        <>
                          {photo.image ? (
                            <img src={photo.image} alt={`Photo ${photo.type}`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                              <span className="text-muted-foreground text-sm font-body">Photo</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Text Section */}
              <div className="mb-16 prose prose-lg max-w-none text-foreground/80">
                <p className="leading-relaxed text-justify">
                  A life between languages and borders taught me to build bridges; between Italy and Switzerland,
                  between ideas and execution, between vision and everyday habits. I care about clarity, momentum, and
                  kindness. If what I create helps you take the next step, quicker or clearer, I'm happy.
                </p>
                <p className="leading-relaxed text-justify">
                  Outside work you'll usually find me in the mountains, hiking when the trails are open and skiing all
                  winter. I grew up crisscrossing the Alps, so I'm biased toward early starts, long ridgelines, and the
                  kind of clear air that resets your head. Those days feed the writing here. If you're into thoughtful
                  tools, better workflows, and work that respects people's time, you'll feel at home here.
                </p>
              </div>

              {/* Community Section with Cover Image */}
              <div className="mb-16 space-y-8">
                <div className="relative overflow-hidden h-64 md:h-96 shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                  {isEditorMode ? (
                    <label className="cursor-pointer block w-full h-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "community")}
                        className="hidden"
                      />
                      {communityImage ? (
                        <img src={communityImage} alt="Community" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#D4A574]/30 via-[#C89B68]/20 to-[#B8865A]/30 flex items-center justify-center">
                          <span className="text-muted-foreground text-lg font-body">
                            Click to Upload Community Cover
                          </span>
                        </div>
                      )}
                    </label>
                  ) : (
                    <>
                      {communityImage ? (
                        <img src={communityImage} alt="Community" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#D4A574]/30 via-[#C89B68]/20 to-[#B8865A]/30 flex items-center justify-center">
                          <span className="text-muted-foreground text-lg font-body">Community Cover Image</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="prose prose-lg max-w-none text-foreground/80 animate-fade-in">
                  <h2 className="text-3xl md:text-4xl font-bold font-body mb-6 bg-gradient-to-r from-[#FFA94D] via-[#FF8C3D] to-[#FF6B2B] bg-clip-text text-transparent">
                    Join the community. Let's grow together.
                  </h2>
                  <p className="leading-relaxed text-justify mb-6">
                    Join the community. Let's grow together and become more knowledgeable innovators, entrepreneurs,
                    professionals and, first of all, better people. The (un)Stable Net is a collaborative project shaped
                    by my long running curiosity for innovation and finance. I use it to make sense of markets,
                    technology and the ways we work, not with hype but with patient curiosity, clear sources and notes
                    you can actually use.
                  </p>
                  <p className="leading-relaxed text-justify mb-6">
                    This is a living project. I ship small improvements often: new briefs, tighter frameworks, practical
                    AI workflows to try, and occasional deep dives from a European perspective, mostly Switzerland and
                    Italy. Expect short, readable pieces that cut through noise, simple tools you can reuse with your
                    team, and reflections that stay close to real world constraints and the next step. The goal is
                    always the same: turn scattered signals into something helpful you can apply this week.
                  </p>
                  <p className="leading-relaxed text-justify mb-6">
                    If that resonates, follow along, ask questions, challenge assumptions and share what you are
                    learning. Your feedback, corrections and ideas shape what comes next: features, formats and topics.
                    I will keep it practical, collaborative and kind, so we can make the work better together.
                  </p>
                </div>

                {/* Contribution and Resources Buttons */}
                <div className="flex flex-wrap gap-4 justify-center pt-4">
                  <Button
                    size="lg"
                    className="shadow-lg hover:shadow-xl transition-shadow"
                    onClick={() => (window.location.href = "/contribute")}
                  >
                    Contribute Your Ideas
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="shadow-lg hover:shadow-xl transition-shadow"
                    onClick={() => (window.location.href = "/resources")}
                  >
                    Browse Resources
                  </Button>
                </div>
              </div>

              {/* Social Links Section */}
              <div className="bg-gradient-to-br from-[#D4A574]/20 via-[#C89B68]/10 to-[#B8865A]/20 dark:from-[#2a1f15]/50 dark:via-[#3d2a1a]/30 dark:to-[#1f1812]/50 rounded-2xl p-8 md:p-12">
                <h3 className="text-2xl font-bold font-body mb-8 text-center">Connect with me</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <a
                    href="https://www.linkedin.com/in/jacopo-berton-16a69424b/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 p-6 bg-background/60 backdrop-blur-sm rounded-xl hover:bg-background/80 transition-all hover:scale-105"
                  >
                    <Linkedin className="w-10 h-10 text-primary" />
                    <span className="text-sm font-body text-foreground">LinkedIn</span>
                  </a>
                  <a
                    href="https://github.com/James-Git-Repo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 p-6 bg-background/60 backdrop-blur-sm rounded-xl hover:bg-background/80 transition-all hover:scale-105"
                  >
                    <Github className="w-10 h-10 text-primary" />
                    <span className="text-sm font-body text-foreground">GitHub</span>
                  </a>
                  <a
                    href="https://x.com/JacopoBerton"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 p-6 bg-background/60 backdrop-blur-sm rounded-xl hover:bg-background/80 transition-all hover:scale-105"
                  >
                    <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="text-sm font-body text-foreground">X (Twitter)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Ask Questions Dialog */}
      <Dialog open={askQuestionsOpen} onOpenChange={setAskQuestionsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ask a Question</DialogTitle>
            <DialogDescription>Have a question? I'd love to hear from you.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitQuestion} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                placeholder="What would you like to know?"
                className="mt-1 min-h-32"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Send Question
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
