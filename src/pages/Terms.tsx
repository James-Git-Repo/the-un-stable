const Terms = () => {
import { SEO } from "@/components/SEO";
  return (
    <main className="container mx-auto px-4 py-16">
      <SEO title={"Terms & Conditions — The (un)Stable Net"} description={"Terms and conditions for using The (un)Stable Net."} path={"/legal/terms"} />
      <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
        <h1>Terms & Conditions</h1>
        
        <p className="text-muted-foreground">Last updated: October 2025</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using The (un)Stable Net website and newsletter, you accept and agree
          to be bound by these Terms and Conditions.
        </p>

        <h2>2. Use of Service</h2>
        <p>
          The (un)Stable Net provides financial market analysis and commentary for informational
          purposes only. This content does not constitute financial advice.
        </p>

        <h2>3. Intellectual Property</h2>
        <p>
          All content published on The (un)Stable Net, including text, graphics, logos, and images,
          is the property of The (un)Stable Net or its content suppliers and is protected by
          international copyright laws.
        </p>

        <h2>4. Disclaimer</h2>
        <p>
          The information provided on this website is for general informational purposes only.
          While we strive to keep the information accurate and up to date, we make no
          representations or warranties of any kind about the completeness, accuracy, reliability,
          or availability of the information.
        </p>

        <h2>5. Investment Risk</h2>
        <p>
          Any reliance you place on market analysis or commentary from The (un)Stable Net is
          strictly at your own risk. Past performance is not indicative of future results.
          All investments carry risk, including potential loss of principal.
        </p>

        <h2>6. User Contributions</h2>
        <p>
          By submitting content to The (un)Stable Net, you grant us a non-exclusive, worldwide,
          royalty-free license to use, reproduce, and publish your contribution.
        </p>

        <h2>7. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use of the service
          after changes constitutes acceptance of the modified terms.
        </p>

        <h2>8. Contact</h2>
        <p>
          For questions about these Terms, please contact us through our contribution form.
        </p>
      </div>
    </main>
  );
};

export default Terms;
