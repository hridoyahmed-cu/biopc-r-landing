'use client';

import { useEffect, useRef } from 'react';
import { siteConfig } from '@/lib/site-config';

interface WhatsappModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Post-registration prompt to join the cohort WhatsApp group.
 * Registrants who miss this lose the channel where class links and materials
 * are shared, so it is a modal rather than an inline note — but it stays
 * dismissible (Escape, backdrop, or the close button).
 */
export function WhatsappModal({ open, onClose }: WhatsappModalProps) {
  const joinRef = useRef<HTMLAnchorElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    // Move focus to the primary action, and keep Tab inside the dialog.
    joinRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // Stop the page behind the dialog from scrolling.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-modal-title"
    >
      <div
        className="absolute inset-0 bg-[rgb(8_11_26/0.6)] backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        ref={dialogRef}
        className="surface relative w-full max-w-md rounded-3xl p-7 text-center shadow-card sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted transition hover:bg-[rgb(var(--bg-subtle))] hover:text-[rgb(var(--fg))]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden="true"
            className="h-4 w-4"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366]/15 text-[#128C7E] dark:text-[#25D366]">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-7 w-7">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.15h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 01-1.25-4.38c0-4.54 3.7-8.24 8.24-8.24a8.19 8.19 0 015.82 2.42 8.18 8.18 0 012.41 5.83c0 4.54-3.69 8.23-8.25 8.23zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29z" />
          </svg>
        </div>

        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-accent-600">
          Important — one more step
        </p>
        <h2 id="whatsapp-modal-title" className="mt-2 font-display text-2xl font-bold leading-tight">
          Join the WhatsApp group
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Class links, schedule changes, materials and announcements are shared
          <strong className="text-[rgb(var(--fg))]"> only in the WhatsApp group</strong>. Your
          registration is not complete until you join.
        </p>

        <a
          ref={joinRef}
          href={siteConfig.social.whatsappGroup}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-6 w-full text-base"
        >
          Join the WhatsApp group
        </a>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full text-sm font-medium text-muted transition hover:text-accent-600"
        >
          I&apos;ll join later
        </button>
      </div>
    </div>
  );
}
