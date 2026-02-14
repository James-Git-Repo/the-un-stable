import { Link } from "react-router-dom";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import genieLinkCover from "@/assets/cover-genielink.jpg";

const GenieLink = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative">
        <div className="aspect-[3/1] w-full overflow-hidden">
          <img
            src={genieLinkCover}
            alt="GenieLink cover"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold font-body mb-6 text-foreground">
          GenieLink
        </h1>

        <p className="text-lg text-muted-foreground font-body mb-6 leading-relaxed">
          GenieLink is a simple and professional link-in-bio platform that allows
          individuals and businesses to organize all their important links in one
          place. Whether you are a creator, freelancer, startup, or small
          business, GenieLink helps you present your online presence through a
          clean, mobile-friendly page that can be shared anywhere.
        </p>

        <p className="text-lg text-muted-foreground font-body mb-6 leading-relaxed">
          The goal of GenieLink is straightforward: make digital visibility
          accessible to everyone without complexity or cost barriers. Users can
          create a personalized page, add unlimited links, customize their
          layout, and publish in minutes.
        </p>

        <p className="text-lg text-muted-foreground font-body mb-6 leading-relaxed">
          Unlike many similar tools, GenieLink is completely free. There are no
          subscription tiers, no hidden upgrades, and no locked "premium"
          features. Everything the platform offers is available to every user.
        </p>

        <p className="text-lg text-muted-foreground font-body mb-8 leading-relaxed">
          GenieLink focuses on usability, transparency, and accessibility. The
          platform is designed to be intuitive, secure, and suitable for both
          personal and professional use. If you are looking for a practical way
          to centralize your online presence without paying for unnecessary
          extras, GenieLink provides a straightforward solution.
        </p>

        <a
          href="https://genielink.me"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="lg" className="gap-2 text-base">
            Visit GenieLink
            <ExternalLink className="w-5 h-5" />
          </Button>
        </a>
      </div>
    </main>
  );
};

export default GenieLink;
