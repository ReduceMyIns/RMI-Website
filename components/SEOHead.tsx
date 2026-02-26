import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
}

const SEOHead: React.FC<SEOHeadProps> = ({ 
  title, 
  description, 
  canonicalUrl, 
  keywords = [], 
  ogImage = 'https://www.reducemyinsurance.net/og-image.jpg', // Default OG image
  ogType = 'website' 
}) => {
  const siteName = 'ReduceMyInsurance.Net';
  const fullTitle = `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "InsuranceAgency",
          "name": siteName,
          "url": "https://www.reducemyinsurance.net",
          "logo": "https://www.reducemyinsurance.net/logo.png",
          "description": description,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "1500 Medical Center Pkwy STE 3A-26",
            "addressLocality": "Murfreesboro",
            "addressRegion": "TN",
            "postalCode": "37129",
            "addressCountry": "US"
          },
          "telephone": "+1-615-900-0288",
          "priceRange": "$$"
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
