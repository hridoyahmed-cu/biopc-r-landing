import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site-config';

export const runtime = 'edge';
export const alt = `${siteConfig.courseName} — ${siteConfig.org} live course`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Branded social-share card for the Facebook/Twitter link preview.
 * Satori rule: EVERY element with more than one child needs display:flex;
 * avoid emoji (they trigger an external glyph fetch at render time).
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(120deg, #1c2e6e 0%, #1f45d6 45%, #7521f7 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 16,
              marginRight: 18,
              background: 'rgba(255,255,255,0.16)',
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            R
          </div>
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 700 }}>
            {`${siteConfig.org} Academy`}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 36, opacity: 0.85, marginBottom: 12 }}>
            Live Online Course
          </div>
          <div style={{ display: 'flex', fontSize: 80, fontWeight: 800 }}>
            {siteConfig.courseName}
          </div>
          <div style={{ display: 'flex', fontSize: 34, opacity: 0.9, marginTop: 20 }}>
            {siteConfig.courseSubtitle}
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 26, opacity: 0.95 }}>
          No coding experience needed  ·  Certificate  ·  Lifetime recordings
        </div>
      </div>
    ),
    { ...size },
  );
}
