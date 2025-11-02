import { useEffect, useState } from "react";

const Sitemap = () => {
  const [sitemapXml, setSitemapXml] = useState<string>("");

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const response = await fetch(
          "https://ivlsawrcootiarfzlbcv.supabase.co/functions/v1/sitemap"
        );
        const xmlText = await response.text();
        setSitemapXml(xmlText);
      } catch (error) {
        console.error("Error fetching sitemap:", error);
      }
    };

    fetchSitemap();
  }, []);

  // Render raw XML
  return (
    <div
      style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}
      dangerouslySetInnerHTML={{ __html: sitemapXml }}
    />
  );
};

export default Sitemap;
