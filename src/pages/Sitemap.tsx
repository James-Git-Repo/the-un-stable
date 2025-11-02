import { useEffect } from "react";

const Sitemap = () => {
  useEffect(() => {
    // Fetch and redirect to the actual XML
    const fetchSitemap = async () => {
      try {
        const response = await fetch(
          "https://ivlsawrcootiarfzlbcv.supabase.co/functions/v1/sitemap"
        );
        const xmlText = await response.text();
        
        // Replace the entire page with raw XML
        document.open();
        document.write(xmlText);
        document.close();
      } catch (error) {
        console.error("Error fetching sitemap:", error);
        document.body.innerHTML = "<h1>Error loading sitemap</h1>";
      }
    };

    fetchSitemap();
  }, []);

  return <div>Loading sitemap...</div>;
};

export default Sitemap;
