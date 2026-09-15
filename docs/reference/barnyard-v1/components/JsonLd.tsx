import { cafe, fact, siteUrl } from "@/lib/cafe";

/**
 * Restaurant / LocalBusiness structured data from cafe.json only. Hours that
 * cross midnight are one specification (schema.org: closes < opens spans the
 * next day). geo is omitted while unknown.
 */
export function JsonLd() {
  const { meta, menu } = cafe;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: meta.name,
    url: siteUrl,
    telephone: meta.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${meta.address.line1}, ${meta.address.line2}, ${meta.address.landmark}`,
      addressLocality: `${meta.address.area}, ${meta.city}`,
      addressRegion: meta.address.state,
      postalCode: meta.address.postalCode,
      addressCountry: meta.address.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        opens: meta.hours.open,
        closes: meta.hours.close,
      },
    ],
    servesCuisine: menu.cuisines,
    sameAs: [meta.instagram],
  };
  if (fact(meta.geo)) data.geo = meta.geo;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
