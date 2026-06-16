const Privacy = () => {
import { SEO } from "@/components/SEO";
  return (
    <main className="container mx-auto px-4 py-16">
      <SEO title={"Privacy Policy — The (un)Stable Net"} description={"Privacy policy for The (un)Stable Net."} path={"/legal/privacy"} />
      <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
        <h1>Privacy Policy</h1>
        
        <p className="text-muted-foreground">Last updated: October 2025</p>

        <h2>1. Information We Collect</h2>
        <p>
          When you subscribe to The (un)Stable Net newsletter or submit a contribution, we collect:
        </p>
        <ul>
          <li>Email address</li>
          <li>Name (if provided)</li>
          <li>Submitted content and communications</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Deliver our newsletter to subscribers</li>
          <li>Respond to inquiries and contributions</li>
          <li>Improve our content and service</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>3. Data Storage and Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal
          information against unauthorized access, alteration, or destruction.
        </p>

        <h2>4. Cookies and Tracking</h2>
        <p>
          We use minimal cookies and tracking technologies to improve user experience and analyze
          website traffic. You can control cookie settings through your browser.
        </p>

        <h2>5. Third-Party Services</h2>
        <p>
          We may use third-party services for email delivery and analytics. These services have
          their own privacy policies governing the use of your information.
        </p>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Unsubscribe from communications at any time</li>
          <li>Object to processing of your data</li>
        </ul>

        <h2>7. Data Retention</h2>
        <p>
          We retain your personal information only as long as necessary to fulfill the purposes
          outlined in this policy or as required by law.
        </p>

        <h2>8. International Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than your country
          of residence. We ensure appropriate safeguards are in place for such transfers.
        </p>

        <h2>9. Children's Privacy</h2>
        <p>
          Our service is not directed to individuals under 18. We do not knowingly collect personal
          information from children.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy periodically. We will notify subscribers of material
          changes via email.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          For privacy-related questions or to exercise your rights, please contact us through
          our contribution form or at the email address in our newsletter.
        </p>
      </div>
    </main>
  );
};

export default Privacy;
