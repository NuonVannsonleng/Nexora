import type { Page } from '@playwright/test';

/**
 * Scrolls the page top to bottom and back.
 *
 * Sections reveal themselves on intersection, so anything below the fold stays at
 * opacity 0 until it has been scrolled past. Smooth scrolling has to be suspended
 * first or the programmatic jumps never land.
 */
export async function revealAll(page: Page) {
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    const total = document.documentElement.scrollHeight;
    for (let y = 0; y <= total; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 40)));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 150));
  });

  await settleAnimations(page);
}

/**
 * Waits for every running animation to finish.
 *
 * A colour-contrast scan taken mid-fade measures the blended colour rather than
 * the final one and reports failures that do not exist, so any axe run has to
 * wait for the reveals to settle first.
 */
export async function settleAnimations(page: Page) {
  await page.evaluate(() =>
    Promise.all(
      document.getAnimations().map((a) => a.finished.catch(() => undefined)),
    ).then(() => undefined),
  );
  await page.waitForTimeout(120);
}

/** True when the document itself scrolls sideways. */
export const hasHorizontalOverflow = (page: Page) =>
  page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );

/** Sources of every image that finished loading with no pixels. */
export const brokenImages = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('img')]
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src),
  );

/**
 * Opts every image out of lazy loading, so a test can assert that all of them
 * decode rather than only the ones that happened to enter the viewport.
 */
export async function loadLazyImages(page: Page) {
  await page.evaluate(() => {
    for (const img of document.querySelectorAll('img')) {
      if (img.loading === 'lazy') img.loading = 'eager';
    }
  });
}

/** Waits until every <img> on the page has settled. */
export async function waitForImages(page: Page) {
  await page.waitForFunction(
    () => [...document.querySelectorAll('img')].every((img) => img.complete),
    undefined,
    { timeout: 15_000 },
  );
}

/** Collects console errors and uncaught exceptions for the life of the page. */
export function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  return errors;
}
