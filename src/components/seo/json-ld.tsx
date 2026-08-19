import { siteConfig } from '@/lib/site-config';
import { faqs } from '@/lib/content';

/** Structured data (JSON-LD) for rich results: Course, Organization, and FAQ. */
export function JsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://courses.biopc.org';

  const graph = [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}#org`,
      name: `${siteConfig.org} — ${siteConfig.orgTagline}`,
      url: siteConfig.social.website,
      sameAs: [siteConfig.social.facebookPage, siteConfig.social.linkedin],
      email: siteConfig.contactEmail,
    },
    {
      '@type': 'Course',
      name: siteConfig.courseName,
      description: `${siteConfig.courseSubtitle}. ${siteConfig.courseShort}`,
      provider: { '@id': `${siteUrl}#org` },
      inLanguage: 'en',
      offers: {
        '@type': 'Offer',
        category: 'Paid',
        price: siteConfig.price.amount,
        priceCurrency: siteConfig.price.currency,
        availability: 'https://schema.org/InStock',
        url: `${siteUrl}/r-programming#register`,
      },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'Online',
        startDate: siteConfig.courseStartDate,
        courseWorkload: siteConfig.format.duration,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  const json = { '@context': 'https://schema.org', '@graph': graph };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  );
}
