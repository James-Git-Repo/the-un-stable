import { Helmet } from "react-helmet-async";

const SITE = "https://the-un-stable.net";
const DEFAULT_DESCRIPTION =
  "Weekly briefs on European equities, macro signals, technology and AI — clear, actionable analysis with no noise.";

interface SEOProps {
  title: string;
  description?: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image,
  type = "website",
  publishedTime,
  author,
  jsonLd,
}: SEOProps) {
  const url = `${SITE}${path}`;
  const absImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE}${image}`
    : undefined;

  const schemas = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      {absImage && <meta property="og:image" content={absImage} />}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {absImage && <meta name="twitter:image" content={absImage} />}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}