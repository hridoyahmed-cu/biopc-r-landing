'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { courseMenus, siteConfig, type NavMenu } from '@/lib/site-config';
import { track } from '@/lib/pixel';

interface NavbarProps {
  /** In-page anchors for the current page. The academy homepage passes none. */
  sections?: { href: string; label: string }[];
  /** Right-hand call to action. `track` fires the checkout pixel event. */
  cta?: { href: string; label: string; track?: boolean };
}

function CourseMenu({ menu }: { menu: NavMenu }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hovered = useRef(false);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  // Close on outside click / Escape so the dropdown never gets stuck open.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => cancelClose, []);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        hovered.current = true;
        setOpen(true);
      }}
      onMouseLeave={() => {
        cancelClose();
        hovered.current = false;
        closeTimer.current = setTimeout(() => setOpen(false), 150);
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        // Hover already opened it for mouse users, so a click there must not toggle it shut;
        // touch and keyboard never hover, so those still get a plain toggle.
        onClick={() => setOpen((v) => (hovered.current ? true : !v))}
        className="flex items-center gap-1 text-sm font-medium text-muted transition hover:text-accent-600"
      >
        {menu.label}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* pt-3 keeps a hover bridge between the trigger and the panel */}
      <div className={`absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 ${open ? 'block' : 'hidden'}`}>
        <ul className="surface min-w-[17rem] rounded-2xl p-2 shadow-card">
          {menu.items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[rgb(var(--fg))] transition hover:bg-[rgb(var(--bg-subtle))] hover:text-accent-600"
              >
                <span>{item.label}</span>
                {item.external && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-3.5 w-3.5 shrink-0 text-muted"
                  >
                    <path d="M14 5h5v5M19 5l-7.5 7.5M17 14v4a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h4" />
                  </svg>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Navbar({
  sections = [],
  cta = { href: '/internship', label: 'Running Course' },
}: NavbarProps = {}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-card' : 'bg-transparent'
      }`}
    >
      <nav className="container-tight flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2.5" aria-label={`${siteConfig.org} Academy home`}>
          <Image src="/logo.png" alt={`${siteConfig.org} logo`} width={36} height={36} className="rounded-full" priority />
          <span className="font-display text-lg font-bold tracking-tight">
            {siteConfig.org} <span className="text-muted font-medium">Academy</span>
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {sections.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted transition hover:text-accent-600">
              {l.label}
            </a>
          ))}
          {courseMenus.map((menu) => (
            <CourseMenu key={menu.label} menu={menu} />
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <a
            href={cta.href}
            onClick={cta.track ? () => track('InitiateCheckout', 'cta_click', { location: 'navbar' }) : undefined}
            className="btn-primary hidden px-5 py-2.5 sm:inline-flex"
          >
            {cta.label}
          </a>
        </div>
      </nav>
    </header>
  );
}
