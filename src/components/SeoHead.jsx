import { useEffect } from 'react';

/**
 * Helper to update or insert a meta tag by name or property
 */
function setMetaTag(attribute, key, content) {
  if (!content) return;
  let element = document.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Helper to update or insert canonical link
 */
function setCanonicalLink(url) {
  if (!url) return;
  let element = document.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
}

/**
 * Helper to update or insert JSON-LD script
 */
function setJsonLdScript(id, data) {
  let element = document.getElementById(id);
  if (!data) {
    if (element) element.remove();
    return;
  }
  if (!element) {
    element = document.createElement('script');
    element.id = id;
    element.type = 'application/ld+json';
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data, null, 2);
}

/**
 * SeoHead Component
 * Manages head title, meta descriptions, canonical links, social tags,
 * and Schema.org JSON-LD scripts dynamically for React pages.
 */
export default function SeoHead({
  title,
  description,
  keywords = [],
  canonicalUrl,
  openGraph = {},
  twitter = {},
  productJsonLd = null,
  breadcrumbJsonLd = null
}) {
  useEffect(() => {
    // 1. Document Title
    const originalTitle = document.title;
    if (title) {
      document.title = title;
    }

    // 2. Standard Search Meta
    if (description) {
      setMetaTag('name', 'description', description);
    }
    if (keywords && keywords.length > 0) {
      setMetaTag('name', 'keywords', Array.isArray(keywords) ? keywords.join(', ') : keywords);
    }
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large');

    // 3. Canonical URL
    if (canonicalUrl) {
      setCanonicalLink(canonicalUrl);
    }

    // 4. Open Graph Tags
    if (openGraph) {
      setMetaTag('property', 'og:title', openGraph.title || title);
      setMetaTag('property', 'og:description', openGraph.description || description);
      setMetaTag('property', 'og:url', openGraph.url || canonicalUrl);
      setMetaTag('property', 'og:image', openGraph.image);
      if (openGraph.image) {
        setMetaTag('property', 'og:image:secure_url', openGraph.image);
        setMetaTag('property', 'og:image:width', '800');
        setMetaTag('property', 'og:image:height', '800');
        setMetaTag('property', 'og:image:alt', openGraph.title || title);
      }
      setMetaTag('property', 'og:type', openGraph.type || 'website');
      setMetaTag('property', 'og:site_name', openGraph.site_name || 'Dharani Herbals');
      if (openGraph.locale) {
        setMetaTag('property', 'og:locale', openGraph.locale);
      }
      if (openGraph.priceAmount) {
        setMetaTag('property', 'product:price:amount', openGraph.priceAmount);
        setMetaTag('property', 'og:price:amount', openGraph.priceAmount);
      }
      if (openGraph.priceCurrency) {
        setMetaTag('property', 'product:price:currency', openGraph.priceCurrency);
        setMetaTag('property', 'og:price:currency', openGraph.priceCurrency);
      }
    }

    // 5. Twitter Card Tags
    if (twitter) {
      setMetaTag('name', 'twitter:card', twitter.card || 'summary_large_image');
      setMetaTag('name', 'twitter:title', twitter.title || title);
      setMetaTag('name', 'twitter:description', twitter.description || description);
      if (twitter.image) {
        setMetaTag('name', 'twitter:image', twitter.image);
      }
    }

    // 6. Schema.org JSON-LD Structured Data
    if (productJsonLd) {
      setJsonLdScript('dh-schema-product', productJsonLd);
    } else {
      setJsonLdScript('dh-schema-product', null);
    }

    if (breadcrumbJsonLd) {
      setJsonLdScript('dh-schema-breadcrumb', breadcrumbJsonLd);
    } else {
      setJsonLdScript('dh-schema-breadcrumb', null);
    }

    return () => {
      // Revert JSON-LD scripts on route unmount
      setJsonLdScript('dh-schema-product', null);
      setJsonLdScript('dh-schema-breadcrumb', null);
      document.title = originalTitle || 'Dharani Herbbals';
    };
  }, [title, description, keywords, canonicalUrl, openGraph, twitter, productJsonLd, breadcrumbJsonLd]);

  return null;
}
