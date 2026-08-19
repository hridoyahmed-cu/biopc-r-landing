import Image from 'next/image';
import { courseMenus, siteConfig } from '@/lib/site-config';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[rgb(var(--border))] bg-[rgb(var(--bg-subtle))] py-12">
      <div className="container-tight">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt={`${siteConfig.org} logo`} width={36} height={36} className="rounded-full" />
              <span className="font-display text-lg font-bold">{siteConfig.org} Academy</span>
            </div>
            <p className="mt-3 text-sm text-muted">{siteConfig.orgTagline}. {siteConfig.courseShort}</p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm">
            <div>
              <p className="mb-3 font-semibold">Courses</p>
              <ul className="space-y-2 text-muted">
                {courseMenus.flatMap((menu) =>
                  menu.items.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className="hover:text-accent-600"
                      >
                        {item.label}
                      </a>
                    </li>
                  )),
                )}
              </ul>
            </div>
            <div>
              <p className="mb-3 font-semibold">Connect</p>
              <ul className="space-y-2 text-muted">
                <li><a href={siteConfig.social.facebookPage} target="_blank" rel="noopener noreferrer" className="hover:text-accent-600">Facebook</a></li>
                <li><a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent-600">LinkedIn</a></li>
                <li><a href={siteConfig.social.website} target="_blank" rel="noopener noreferrer" className="hover:text-accent-600">biopc.org</a></li>
                <li><a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-accent-600">{siteConfig.contactEmail}</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[rgb(var(--border))] pt-6 text-xs text-muted">
          © {year} {siteConfig.org} — {siteConfig.orgTagline}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
