import type { Metadata } from 'next';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { Hero } from '@/components/sections/hero';
import { WhyBiopc } from '@/components/sections/why-biopc';
import { Benefits } from '@/components/sections/benefits';
import { Audience } from '@/components/sections/audience';
import { Curriculum } from '@/components/sections/curriculum';
import { Instructor } from '@/components/sections/instructor';
import { Testimonials } from '@/components/sections/testimonials';
import { Faq } from '@/components/sections/faq';
import { Registration } from '@/components/sections/registration';
import { FinalCta } from '@/components/sections/final-cta';
import { JsonLd } from '@/components/seo/json-ld';
import { siteConfig, courseSections } from '@/lib/site-config';

const title = `${siteConfig.courseName} — ${siteConfig.org} Live Course`;
const description = `${siteConfig.courseSubtitle}. ${siteConfig.courseShort} Live online, beginner-friendly, with certificate.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'R programming for biologists',
    'R for biology',
    'bioinformatics course',
    'data analysis in R',
    'ggplot2',
    'RStudio course',
    'biostatistics',
    'BioPC',
    'R programming course Bangladesh',
    'learn R online',
  ],
  alternates: { canonical: '/r-programming' },
  openGraph: {
    type: 'website',
    url: '/r-programming',
    siteName: `${siteConfig.org} Academy`,
    title,
    description,
    images: [{ url: '/r-programming/opengraph-image', width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/r-programming/opengraph-image'] },
};

export default function RProgrammingPage() {
  return (
    <>
      <JsonLd />
      <Navbar sections={courseSections} cta={{ href: '#register', label: 'Register Now', track: true }} />
      <main>
        <Hero />
        <WhyBiopc />
        <Benefits />
        <Audience />
        <Curriculum />
        <Instructor />
        <Testimonials />
        <Faq />
        <Registration />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
