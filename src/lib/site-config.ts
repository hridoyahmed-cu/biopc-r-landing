/**
 * Central content + configuration for the landing page.
 * Editing this file changes the whole page — no component edits required.
 * Everything here is safe to expose to the browser.
 */

export const siteConfig = {
  org: 'BioPC',
  orgTagline: 'A Bioinformatics Lab of Research and Training',
  courseName: 'R Programming for Biologists',
  courseSubtitle: 'Learn Data Analysis, Statistics and Bioinformatics with R',
  courseShort: 'A hands-on, beginner-friendly live course that takes biologists from zero coding to confident data analysis in R.',

  // Registration deadline (ISO 8601, with timezone). Batch starts 1 Aug 2026,
  // so registration closes end of 31 Jul 2026. Bangladesh Standard Time is UTC+6.
  registrationDeadline: '2026-08-13T23:59:59+06:00',

  // Batch start date.
  courseStartDate: '2026-08-15',

  // Pricing (shown on the page + payment section).
  price: {
    amount: 1550,
    currency: 'BDT',
    original: 4000,
  },

  format: {
    duration: '6 weeks',
    mode: 'Live online (Google Meet / Zoom)',
    sessions: '3 live classes/wk - Tue, Fri & Sat, 9:30–10:30 PM',
    schedule: [
      { day: 'Tuesday', time: '9:30 – 10:30 PM' },
      { day: 'Friday', time: '9:30 – 10:30 PM' },
      { day: 'Saturday', time: '9:30 – 10:30 PM' },
    ],
    seats: 60,
  },

  contactEmail: 'biopc.research@gmail.com',
  altEmail: 'research@biopc.org',
  whatsapp: '+8801855310554', // e.g. '+8801XXXXXXXXX' — shown as a support contact if set.

  social: {
    facebookPage: 'https://www.facebook.com/BioPcLab/',
    facebookGroup: 'https://facebook.com/groups/5659344424181576/',
    linkedin: 'https://www.linkedin.com/company/biopc-a-bioinformatics-lab',
    website: 'https://biopc.org',
    // Cohort group shown in the post-registration popup.
    whatsappGroup: 'https://chat.whatsapp.com/JMlvfDf3KpE0gh96PUZoza?s=cl&p=i&mlu=0&ilr=0',
  },

  // Payment channels shown in the registration section.
  payments: [
    { method: 'bKash', type: 'Personal', number: '01855310554', instruction: 'Send Money to this bKash number, then enter the Transaction ID below.' },
    { method: 'bKash / Nagad / Rocket', type: 'Personal', number: '01622488559', instruction: 'Send Money via bKash, Nagad, or Rocket to this number, then enter the Transaction ID below.' },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

/** Where each course site lives under courses.biopc.org. */
export const routes = {
  rProgramming: '/r-programming',
  internship: '/internship',
} as const;

/** In-page section links, shown in the navbar only on the R Programming page. */
export const courseSections = [
  { href: '#benefits', label: 'Benefits' },
  { href: '#curriculum', label: 'Curriculum' },
  { href: '#instructor', label: 'Instructor' },
  { href: '#faq', label: 'FAQ' },
];

/** A dropdown in the navbar: a group label plus the courses under it. */
export type NavMenu = {
  label: string;
  items: { label: string; href: string; external?: boolean }[];
};

/**
 * Course submenus shown in the navbar.
 * Add a course by dropping an entry into the right group - no component edits.
 */
export const courseMenus: NavMenu[] = [
  {
    label: 'Running Courses',
    items: [
      { label: 'Bioinformatics Research Internship 4.0', href: routes.internship },
    ],
  },
  {
    label: 'Previous Courses',
    items: [
      { label: siteConfig.courseName, href: routes.rProgramming },
    ],
  },
];

/** Cards rendered on the academy homepage, one per course. */
export const courseCatalog = [
  {
    group: 'Running',
    name: 'Bioinformatics Research Internship 4.0',
    blurb:
      'A 4-month online cohort: CADD, network pharmacology, DFT, vaccine design, cancer bioinformatics and manuscript writing - with real deliverables and a pathway to TA/RA roles.',
    meta: ['4 months', '7 modules', 'Online cohort'],
    href: routes.internship,
    cta: 'View course',
    open: true,
  },
  {
    group: 'Previous',
    name: siteConfig.courseName,
    blurb: siteConfig.courseShort,
    meta: [siteConfig.format.duration, 'Live online', 'Certificate'],
    href: routes.rProgramming,
    cta: 'View course page',
    open: false,
  },
];
