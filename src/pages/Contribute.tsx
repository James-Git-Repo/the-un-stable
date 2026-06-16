import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Newspaper } from "lucide-react";
import { SEO } from "@/components/SEO";

const Contribute = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    content: "",
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consent) {
      toast({
        title: "Consent required",
        description: "Please agree to our submission terms.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // TODO: Wire to actual submission handler
    setTimeout(() => {
      toast({
        title: "Submission received!",
        description: "We'll review your contribution and get back to you soon.",
      });
      setFormData({
        name: "",
        email: "",
        topic: "",
        content: "",
        consent: false,
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <main className="container mx-auto px-4 py-16">
      <SEO title={"Contribute — The (un)Stable Net"} description={"Pitch a guest article or contribute to The (un)Stable Net — markets, technology, AI and craft."} path={"/contribute"} />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Newspaper className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contribute to TSN
          </h1>
          <p className="text-xl text-muted-foreground">
            Share your insights and analysis with our community.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submit Your Article</CardTitle>
            <CardDescription>
              We're looking for data-driven market analysis and actionable insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="topic" className="block text-sm font-medium mb-2">
                  Article Topic
                </label>
                <Input
                  id="topic"
                  type="text"
                  placeholder="e.g., ECB Policy Impact on EU Banks"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-2">
                  Article Summary / Pitch
                </label>
                <Textarea
                  id="content"
                  placeholder="Provide a brief summary of your article idea, key insights, and why it matters..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={8}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Minimum 200 characters. We'll follow up for the full article if approved.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, consent: checked as boolean })
                  }
                />
                <label
                  htmlFor="consent"
                  className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                >
                  I agree that my submission may be published on The (un)Stable Net and that
                  I hold the rights to this content. I understand that editorial changes may be made.
                </label>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit for Review"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold">Contribution Guidelines</h2>
          <div className="grid gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">What We're Looking For</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Original analysis backed by data</li>
                  <li>• Clear investment or policy implications</li>
                  <li>• Focus on European markets</li>
                  <li>• Actionable insights, not generic commentary</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Editorial Process</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Initial review within 5 business days</li>
                  <li>• Collaborative editing if accepted</li>
                  <li>• Full byline attribution</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contribute;
