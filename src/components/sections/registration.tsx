'use client';

import { useRef, useState } from 'react';
import { SectionHeading } from '@/components/ui/section-heading';
import { WhatsappModal } from '@/components/ui/whatsapp-modal';
import { Icon } from '@/components/ui/icon';
import { siteConfig } from '@/lib/site-config';
import { formatPrice } from '@/lib/utils';
import { track, trackPixel } from '@/lib/pixel';
import {
  academicLevels,
  paymentMethods,
  skillLevels,
  validateRegistration,
  type FieldErrors,
  type RegistrationPayload,
} from '@/lib/registration';

const MAX_SCREENSHOT_BYTES = 10 * 1024 * 1024; // 10 MB raw input cap
const MAX_IMAGE_DIMENSION = 1400; // px — screenshots are downscaled to this

/**
 * Downscale + re-encode an image in the browser to a compact JPEG data URL.
 * Keeps the upload small (well under serverless body limits) regardless of the
 * original photo size. Falls back to the raw data URL if canvas isn't available.
 */
async function compressImage(file: File): Promise<string> {
  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('read_failed'));
    reader.readAsDataURL(file);
  });

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('decode_failed'));
      image.src = rawDataUrl;
    });

    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.width, img.height));
    const width = Math.round(img.width * scale);
    const height = Math.round(img.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return rawDataUrl;
    // White background so transparent PNGs don't turn black as JPEG.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.82);
  } catch {
    return rawDataUrl;
  }
}

const emptyForm: RegistrationPayload = {
  fullName: '',
  email: '',
  phone: '',
  whatsapp: '',
  university: '',
  department: '',
  country: 'Bangladesh',
  academicLevel: '',
  currentSkills: skillLevels[0],
  paymentMethod: '',
  transactionId: '',
  agreed: false,
  website: '',
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function Registration() {
  const [form, setForm] = useState<RegistrationPayload>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [showWhatsapp, setShowWhatsapp] = useState(false);
  const [message, setMessage] = useState('');
  const [screenshot, setScreenshot] = useState<{ name: string; data: string } | null>(null);
  const startedRef = useRef(false);

  function update<K extends keyof RegistrationPayload>(key: K, value: RegistrationPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    // Fire InitiateCheckout once, when the user first engages with the form.
    if (!startedRef.current) {
      startedRef.current = true;
      track('InitiateCheckout', 'registration_started');
    }
  }

  async function onFile(file: File | null) {
    if (!file) {
      setScreenshot(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setErrors((e) => ({ ...e, screenshot: 'Please upload an image file.' }));
      return;
    }
    if (file.size > MAX_SCREENSHOT_BYTES) {
      setErrors((e) => ({ ...e, screenshot: 'Image must be under 10 MB.' }));
      return;
    }
    setErrors((e) => ({ ...e, screenshot: undefined }));
    const data = await compressImage(file);
    setScreenshot({ name: file.name, data });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateRegistration(form);
    if (!screenshot) {
      validation.screenshot = 'Please upload your payment screenshot.';
    }
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      const first = document.querySelector('[data-error="true"]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setStatus('submitting');
    setMessage('');

    try {
      const payload: RegistrationPayload = {
        ...form,
        screenshotName: screenshot?.name,
        screenshotData: screenshot?.data,
      };

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };

      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'Something went wrong. Please try again.');
      }

      // Conversion events for the ad campaign.
      trackPixel('Lead', { content_name: siteConfig.courseName });
      track('CompleteRegistration', 'registration_completed', {
        content_name: siteConfig.courseName,
        value: siteConfig.price.amount,
        currency: siteConfig.price.currency,
      });

      setStatus('success');
      setShowWhatsapp(true);
      setForm(emptyForm);
      setScreenshot(null);
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Unexpected error.');
    }
  }

  if (status === 'success') {
    return (
      <section id="register" className="py-20 sm:py-24">
        <div className="container-tight">
          <div className="mx-auto max-w-xl surface rounded-4xl p-10 text-center shadow-card">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient text-white">
              <Icon name="check" className="h-8 w-8" />
            </div>
            <h2 className="font-display text-2xl font-bold">You’re registered! 🎉</h2>
            <p className="mt-3 text-muted">
              Thank you for registering for <strong>{siteConfig.courseName}</strong>. We’ve received your
              details and will confirm your seat by email at the address you provided. Please check your
              inbox (and spam folder) for a confirmation from{' '}
              <a href={`mailto:${siteConfig.contactEmail}`} className="text-accent-600">{siteConfig.contactEmail}</a>.
            </p>
            <a
              href={siteConfig.social.whatsappGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6"
            >
              Join the WhatsApp group
            </a>
            <p className="mt-4 text-sm text-muted">
              Prefer Facebook?{' '}
              <a
                href={siteConfig.social.facebookGroup}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent-600 hover:underline"
              >
                Join the community group
              </a>
              .
            </p>
          </div>
        </div>
        <WhatsappModal open={showWhatsapp} onClose={() => setShowWhatsapp(false)} />
      </section>
    );
  }

  return (
    <section id="register" className="scroll-mt-20 py-20 sm:py-24">
      <div className="container-tight">
        <SectionHeading
          eyebrow="Register"
          title="Reserve your seat"
          subtitle={`Only ${siteConfig.format.seats} seats per batch. Complete payment, then fill the form to confirm your registration.`}
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Payment instructions */}
          <div className="space-y-4">
            <div className="surface rounded-3xl p-6 shadow-card">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-lg font-semibold">Course fee</span>
                <span className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold text-gradient">
                    {formatPrice(siteConfig.price.amount, siteConfig.price.currency)}
                  </span>
                  <span className="text-sm text-muted line-through">
                    {formatPrice(siteConfig.price.original, siteConfig.price.currency)}
                  </span>
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">One-time payment. Includes all live classes, recordings, and certificate.</p>
            </div>

            <div className="surface rounded-3xl p-6 shadow-card">
              <h3 className="font-display text-base font-semibold">How to pay</h3>
              <ol className="mt-3 space-y-3 text-sm">
                {siteConfig.payments.map((p) => (
                  <li key={p.method} className="rounded-2xl bg-[rgb(var(--bg-subtle))] p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{p.method}</span>
                      <span className="rounded-full bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent-700 dark:bg-accent-950/40 dark:text-accent-300">
                        {p.type}
                      </span>
                    </div>
                    <div className="mt-1 font-mono text-sm">{p.number}</div>
                    <p className="mt-1 text-xs text-muted">{p.instruction}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs text-muted">
                After paying, enter your <strong>Transaction ID</strong> and upload a
                <strong> screenshot of the payment</strong> in the form. We verify and confirm your seat by email.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} noValidate className="surface rounded-3xl p-6 shadow-card sm:p-8">
            {/* Honeypot — hidden from users, visible to bots. */}
            <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden" tabIndex={-1}>
              <label htmlFor="website">Website</label>
              <input
                id="website"
                type="text"
                autoComplete="off"
                tabIndex={-1}
                value={form.website}
                onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name *" error={errors.fullName}>
                <input className="field-input" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} autoComplete="name" />
              </Field>
              <Field label="Email *" error={errors.email}>
                <input className="field-input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} autoComplete="email" />
              </Field>
              <Field label="Phone *" error={errors.phone}>
                <input className="field-input" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} autoComplete="tel" placeholder="01XXXXXXXXX" />
              </Field>
              <Field label="WhatsApp number" error={errors.whatsapp}>
                <input className="field-input" type="tel" value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} placeholder="Same as phone if applicable" />
              </Field>
              <Field label="University / Institution *" error={errors.university}>
                <input className="field-input" value={form.university} onChange={(e) => update('university', e.target.value)} />
              </Field>
              <Field label="Department / Subject" error={errors.department}>
                <input className="field-input" value={form.department} onChange={(e) => update('department', e.target.value)} />
              </Field>
              <Field label="Country" error={errors.country}>
                <input className="field-input" value={form.country} onChange={(e) => update('country', e.target.value)} autoComplete="country-name" />
              </Field>
              <Field label="Academic level *" error={errors.academicLevel}>
                <select className="field-input" value={form.academicLevel} onChange={(e) => update('academicLevel', e.target.value)}>
                  <option value="">Select…</option>
                  {academicLevels.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Current R / coding skills" error={errors.currentSkills} full>
                <select className="field-input" value={form.currentSkills} onChange={(e) => update('currentSkills', e.target.value)}>
                  {skillLevels.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
            </div>

            <div className="my-6 border-t border-[rgb(var(--border))]" />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Payment method *" error={errors.paymentMethod}>
                <select className="field-input" value={form.paymentMethod} onChange={(e) => update('paymentMethod', e.target.value)}>
                  <option value="">Select…</option>
                  {paymentMethods.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="Transaction ID *" error={errors.transactionId}>
                <input className="field-input" value={form.transactionId} onChange={(e) => update('transactionId', e.target.value)} placeholder="e.g. TXN123ABC" />
              </Field>
              <Field label="Payment screenshot *" error={errors.screenshot} full>
                <input
                  className="field-input file:mr-3 file:rounded-full file:border-0 file:bg-accent-50 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-accent-700"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                />
                {screenshot ? <p className="mt-1 text-xs text-accent-600">Attached: {screenshot.name}</p> : null}
              </Field>
            </div>

            <label className="mt-6 flex items-start gap-3 text-sm" data-error={errors.agreed ? 'true' : undefined}>
              <input
                type="checkbox"
                checked={form.agreed}
                onChange={(e) => update('agreed', e.target.checked)}
                className="mt-0.5 h-4 w-4 flex-none rounded border-[rgb(var(--border))] text-accent-600 focus:ring-accent-500"
              />
              <span className="text-muted">
                I confirm the information is accurate and I agree to receive course-related emails from {siteConfig.org}.
              </span>
            </label>
            {errors.agreed ? <p className="mt-1 text-xs text-red-500">{errors.agreed}</p> : null}

            {status === 'error' ? (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/40">{message}</p>
            ) : null}

            <button type="submit" disabled={status === 'submitting'} className="btn-primary mt-6 w-full text-base">
              {status === 'submitting' ? 'Submitting…' : 'Complete my registration'}
            </button>
            <p className="mt-3 text-center text-xs text-muted">
              Questions? Email <a href={`mailto:${siteConfig.contactEmail}`} className="text-accent-600">{siteConfig.contactEmail}</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
  full,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? 'sm:col-span-2' : ''} data-error={error ? 'true' : undefined}>
      <label className="field-label">{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
