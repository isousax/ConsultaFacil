import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
  noindex?: boolean;
  author?: string;
}

const DEFAULT_SEO = {
  title: 'ConsultaFácil - Acompanhe suas Consultas Médicas',
  description: 'Gerencie e acompanhe suas consultas médicas de forma fácil e organizada. Sistema completo para controle de autorizações e procedimentos.',
  keywords: [
    'consultas médicas',
    'autorização médica',
    'gestão de consultas',
    'saúde',
    'agendamento médico',
    'controle de procedimentos',
    'sistema de saúde',
  ],
  ogImage: '/og-image.png',
  siteUrl: 'https://consultafacil.com',
};

export function SEO({
  title,
  description = DEFAULT_SEO.description,
  keywords = DEFAULT_SEO.keywords,
  ogImage = DEFAULT_SEO.ogImage,
  ogType = 'website',
  canonical,
  noindex = false,
  author = 'ConsultaFácil',
}: SEOProps) {
  const fullTitle = title 
    ? `${title} | ConsultaFácil` 
    : DEFAULT_SEO.title;

  const canonicalUrl = canonical || window.location.href;
  const imageUrl = ogImage.startsWith('http') 
    ? ogImage 
    : `${DEFAULT_SEO.siteUrl}${ogImage}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <meta name="author" content={author} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="ConsultaFácil" />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Additional SEO */}
      <meta name="language" content="Portuguese" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'ConsultaFácil',
          description: DEFAULT_SEO.description,
          url: DEFAULT_SEO.siteUrl,
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'BRL',
          },
          author: {
            '@type': 'Organization',
            name: 'ConsultaFácil',
          },
        })}
      </script>
    </Helmet>
  );
}
