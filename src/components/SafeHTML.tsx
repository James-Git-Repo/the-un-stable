import DOMPurify from 'dompurify';

interface SafeHTMLProps {
  html: string;
  className?: string;
}

export const SafeHTML = ({ html, className }: SafeHTMLProps) => {
  const sanitizedHTML = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'div', 'span', 'img', 'figure', 'figcaption'],
    ALLOWED_ATTR: ['class', 'href', 'target', 'rel', 'style', 'data-line-height', 'data-spacing', 'src', 'alt', 'width', 'height'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    ALLOW_DATA_ATTR: true,
  });
  
  return (
    <div 
      className={`prose prose-slate max-w-none text-justify ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }} 
    />
  );
};
