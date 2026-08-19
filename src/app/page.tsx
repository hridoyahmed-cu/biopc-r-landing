import type { Metadata } from 'next';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { siteConfig, courseCatalog } from '@/lib/site-config';

const title = `${siteConfig.org} Academy — Bioinformatics Courses & Training`;
const description = `${siteConfig.orgTagline}. Live, mentor-led bioinformatics and data-analysis courses for biologists — see what is running now and what has run before.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: `${siteConfig.org} Academy`,
    title,
    description,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image'] },
};

/** Groups rendered in order on the homepage. */
const groups = [
  {
    key: 'Running',
    eyebrow: 'Running Courses',
    heading: 'Running now',
    subtitle: 'Open cohorts you can join today.',
    highlight: true,
  },
  {
    key: 'Previous',
    eyebrow: 'Previous Courses',
    heading: 'Previously run',
    subtitle: 'Past cohorts — the course pages stay online for reference.',
  },
];

function CourseCard({
  course,
  highlight = false,
}: {
  course: (typeof courseCatalog)[number];
  highlight?: boolean;
}) {
  return (
    <a
      href={course.href}
      className={`surface group flex w-full flex-col rounded-3xl p-7 transition-all duration-200 hover:-translate-y-1 hover:border-accent-400 hover:shadow-card ${
        highlight ? 'border-accent-400 animate-glow-pulse' : ''
      }`}
    >
      <span
        className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
          course.open
            ? 'bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-300'
            : 'bg-[rgb(var(--bg-subtle))] text-muted'
        }`}
      >
        <span
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full ${
            course.open ? 'bg-accent-500 animate-pulse' : 'bg-[rgb(var(--fg-muted))]'
          }`}
        />
        {course.open ? 'Enrolling' : 'Completed'}
      </span>

      <h3 className="mt-4 font-display text-xl font-bold leading-snug tracking-tight sm:text-2xl">
        {course.name}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{course.blurb}</p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {course.meta.map((m) => (
          <li
            key={m}
            className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs font-medium text-muted"
          >
            {m}
          </li>
        ))}
      </ul>

      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
        {course.cta}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 ${
            highlight ? 'animate-nudge-x' : ''
          }`}
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </a>
  );
}

export default function AcademyHomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section id="top" className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-16">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-brand-radial" />
          <div className="container-tight text-center">
            <Reveal>
              <span className="eyebrow">🧬 {siteConfig.org} · {siteConfig.orgTagline}</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                <span className="text-gradient">{siteConfig.org} Academy</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
                Hands-on, mentor-led training that takes biologists from zero coding to
                publication-ready research.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Course groups */}
        {groups.map((group) => {
          const courses = courseCatalog.filter((c) => c.group === group.key);
          if (courses.length === 0) return null;
          return (
            <section key={group.key} id={group.key.toLowerCase()} className="py-14 sm:py-16">
              <div className="container-tight">
                <SectionHeading eyebrow={group.eyebrow} title={group.heading} subtitle={group.subtitle} />
                {group.highlight ? (
                  <Reveal delay={0.1} className="mt-8 flex flex-col items-center">
                    <span className="rounded-full bg-brand-gradient px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-glow">
                      Start here
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="mt-1 h-6 w-6 animate-bob-down text-accent-600"
                    >
                      <path d="M12 5v14M6 13l6 6 6-6" />
                    </svg>
                  </Reveal>
                ) : null}

                {/* A lone course would sit in a half-empty 2-col grid, so narrow and centre it. */}
                <div
                  className={`mx-auto grid gap-6 ${group.highlight ? 'mt-4' : 'mt-10'} ${
                    courses.length === 1 ? 'max-w-xl' : 'max-w-4xl sm:grid-cols-2'
                  }`}
                >
                  {courses.map((course, i) => (
                    <Reveal key={course.href} delay={i * 0.07} className="flex">
                      <CourseCard course={course} highlight={group.highlight ?? false} />
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </>
  );
}
