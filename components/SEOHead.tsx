import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
  schemaType?: 'InsuranceAgency' | 'WebPage';
}

const AGENCY = {
  name: 'ReduceMyInsurance.Net',
  url: 'https://www.reducemyinsurance.net',
  logo: 'https://www.reducemyinsurance.net/carrier-logos/kbk-logo-home-page-2.png',
  phone: '+1-615-900-0288',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1500 Medical Center Pkwy STE 3A-26',
    addressLocality: 'Murfreesboro',
    addressRegion: 'TN',
    postalCode: '37129',
    addressCountry: 'US',
  },
};

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl,
  keywords = [],
  ogImage = 'https://www.reducemyinsurance.net/carrier-logos/kbk-logo-home-page-2.png',
  ogType = 'website',
  noIndex = false,
  schemaType = 'InsuranceAgency',
}) => {
  const siteName = 'ReduceMyInsurance.Net';
  const fullTitle = `${title} | ${siteName}`;

  const schema =
    schemaType === 'InsuranceAgency'
      ? {
          '@context': 'https://schema.org',
          '@type': 'InsuranceAgency',
          name: AGENCY.name,
          url: AGENCY.url,
          logo: AGENCY.logo,
          description,
          address: AGENCY.address,
          telephone: AGENCY.phone,
          priceRange: '$$',
          sameAs: [
            'https://www.facebook.com/ReduceMyInsurance',
            'https://www.linkedin.com/company/reducemyinsurance',
          ],
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: fullTitle,
          description,
          url: canonicalUrl,
          publisher: {
            '@type': 'InsuranceAgency',
            name: AGENCY.name,
            url: AGENCY.url,
            logo: AGENCY.logo,
            telephone: AGENCY.phone,
            address: AGENCY.address,
          },
        };

  return (
    <Helmet>
      {/* Standard metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />

      {/* Open Graph */}
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
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default SEOHead;
