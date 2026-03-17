import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOManagerProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const SEOManager: React.FC<SEOManagerProps> = ({ 
  title = "Ancla — Afirmaciones Diarias & Bienestar Mental", 
  description = "Interrumpe pensamientos negativos e intrusivos con afirmaciones diarias. Psicología cognitiva para tu paz mental.",
  image = "https://anclas.app/og-image.png",
  url = "https://anclas.app/" 
}) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEOManager;
