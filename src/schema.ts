/**
 * Caribbean Business Schema Generator
 * Maintained by Webitt Digital Agency (https://thewebitt.com)
 * License: MIT
 */

export interface CaribbeanAddress {
  streetAddress: string;
  addressLocality: string; // City, Borough, or Town (e.g., "Port of Spain", "San Fernando", "Kingston")
  addressRegion?: string;   // Parish, Corporation, or County (e.g., "Diego Martin", "St. George", "St. Andrew")
  postalCode?: string;      // Optional: omitted gracefully if not applicable
  addressCountry: 'TT' | 'JM' | 'BB' | 'GY' | 'BS' | 'LC' | string; // ISO 3166-1 alpha-2
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface CaribbeanBusinessConfig {
  name: string;
  businessType?: string; // Default: 'LocalBusiness', 'ProfessionalService', 'LegalService', 'Store', etc.
  url: string;
  telephone: string;
  whatsapp?: string;     // WhatsApp number with country code for direct DM ordering/inquiries
  currenciesAccepted?: string[]; // e.g., ['TTD', 'USD'] or ['JMD', 'USD']
  address: CaribbeanAddress;
  geo?: GeoCoordinates;
  openingHours?: string[];
  image?: string;
  priceRange?: string;   // e.g., '$$'
}

export function generateCaribbeanLocalBusiness(config: CaribbeanBusinessConfig) {
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": config.businessType || "LocalBusiness",
    "name": config.name,
    "url": config.url,
    "telephone": config.telephone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": config.address.streetAddress,
      "addressLocality": config.address.addressLocality,
      ...(config.address.addressRegion && { "addressRegion": config.address.addressRegion }),
      ...(config.address.postalCode && { "postalCode": config.address.postalCode }),
      "addressCountry": config.address.addressCountry,
    },
    ...(config.currenciesAccepted && config.currenciesAccepted.length > 0 && {
      "currenciesAccepted": config.currenciesAccepted.join(", "),
    }),
    ...(config.openingHours && config.openingHours.length > 0 && {
      "openingHours": config.openingHours,
    }),
  };

  if (config.priceRange) {
    schema["priceRange"] = config.priceRange;
  }

  if (config.image) {
    schema["image"] = config.image;
  }

  if (config.geo) {
    schema["geo"] = {
      "@type": "GeoCoordinates",
      "latitude": config.geo.latitude,
      "longitude": config.geo.longitude,
    };
  }

  if (config.whatsapp) {
    schema["contactPoint"] = {
      "@type": "ContactPoint",
      "telephone": config.whatsapp,
      "contactType": "customer service",
      "availableLanguage": ["English"],
    };
  }

  return schema;
}
