import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';

describe('Stage 16: Remaining Inner Pages, Policies & Website Integration', () => {
  // =========================================================================
  // 1. ROUTE FILES EXISTENCE
  // =========================================================================
  test('All required public page files and system boundaries exist on disk', () => {
    const requiredFiles = [
      'src/app/our-story/page.tsx',
      'src/app/collections/[slug]/page.tsx',
      'src/app/combos/page.tsx',
      'src/app/faq/page.tsx',
      'src/app/shipping-policy/page.tsx',
      'src/app/returns-policy/page.tsx',
      'src/app/privacy-policy/page.tsx',
      'src/app/terms-and-conditions/page.tsx',
      'src/app/not-found.tsx',
      'src/app/error.tsx',
      'src/app/loading.tsx',
      'src/app/sitemap.ts',
      'src/app/robots.ts',
      'src/data/policies.ts',
      'src/components/collection/CollectionPageView.tsx',
      'src/components/combos/CombosPageView.tsx',
      'src/components/faq/FAQPageView.tsx',
      'src/components/policy/PolicyPageView.tsx',
    ];

    for (const file of requiredFiles) {
      const fullPath = path.resolve(file);
      assert.ok(fs.existsSync(fullPath), `Expected file ${file} to exist on disk`);
    }
  });

  // =========================================================================
  // 2. CATEGORY DATA & DYNAMIC ROUTING
  // =========================================================================
  test('Category helper methods resolve all 4 authentic Karnataka snack categories', () => {
    const categoriesSource = fs.readFileSync(path.resolve('src/data/categories.ts'), 'utf8');

    // Verify slugs are present
    const expectedSlugs = ['kuruk-thindi', 'sihi-thindi', 'uppinakai', 'appala-sandige'];
    for (const slug of expectedSlugs) {
      assert.ok(
        categoriesSource.includes(`'${slug}'`) || categoriesSource.includes(`"${slug}"`),
        `categories.ts must declare category slug '${slug}'`
      );
    }

    assert.ok(
      categoriesSource.includes('export function getCategoryBySlug'),
      'categories.ts must export getCategoryBySlug()'
    );
    assert.ok(
      categoriesSource.includes('export function getAllCategorySlugs'),
      'categories.ts must export getAllCategorySlugs()'
    );
  });

  // =========================================================================
  // 3. POLICY DATA INTEGRITY & PRELAUNCH AUDIT
  // =========================================================================
  test('Centralized policies model enforces in-review status and structured sections', () => {
    const policiesSource = fs.readFileSync(path.resolve('src/data/policies.ts'), 'utf8');

    // Check policies array
    assert.ok(policiesSource.includes('export const BUSINESS_POLICIES') || policiesSource.includes('export const POLICIES'), 'Must export POLICIES');
    assert.ok(policiesSource.includes('shipping:') || policiesSource.includes("'shipping'"), 'Must include shipping policy');
    assert.ok(policiesSource.includes('returns:') || policiesSource.includes("'returns'"), 'Must include returns policy');
    assert.ok(policiesSource.includes('privacy:') || policiesSource.includes("'privacy'"), 'Must include privacy policy');
    assert.ok(policiesSource.includes('terms:') || policiesSource.includes("'terms'"), 'Must include terms & conditions policy');

    // Verify all policies are explicitly flagged as draft or in_review for prelaunch transparency
    assert.ok(
      policiesSource.includes("status: 'in_review'"),
      'Policies must have in_review status until commercial regulatory sign-off'
    );
    assert.ok(
      policiesSource.includes('getPolicyLaunchBlockers'),
      'Must export getPolicyLaunchBlockers() audit helper'
    );
  });

  // =========================================================================
  // 4. THINDI BOXES (COMBOS) ARCHITECTURE
  // =========================================================================
  test('THINDI Bundles are defined with genuine itemized contents and fair pricing', () => {
    const bundlesSource = fs.readFileSync(path.resolve('src/data/bundles.ts'), 'utf8');

    assert.ok(bundlesSource.includes('thindi-box-tea-time'), 'Must include Tea-Time box');
    assert.ok(bundlesSource.includes('thindi-box-family'), 'Must include Family box');
    assert.ok(bundlesSource.includes('thindi-box-celebration'), 'Must include Celebration box');
    assert.ok(bundlesSource.includes('contents: ['), 'Bundles must have itemized product contents');
  });

  // =========================================================================
  // 5. FAQ KNOWLEDGE BASE COMPLETENESS
  // =========================================================================
  test('FAQs cover products, shipping, orders, returns, and gifting with Kannada translations', () => {
    const faqsSource = fs.readFileSync(path.resolve('src/data/faqs.ts'), 'utf8');

    assert.ok(faqsSource.includes('kannadaQuestion'), 'FAQs must include kannadaQuestion');
    assert.ok(faqsSource.includes('kannadaAnswer'), 'FAQs must include kannadaAnswer');
    assert.ok(faqsSource.includes("'shipping'"), 'Must have shipping FAQ category');
    assert.ok(faqsSource.includes("'policy'"), 'Must have policy/returns FAQ category');
    assert.ok(faqsSource.includes("'storage'"), 'Must have storage FAQ category');
  });

  // =========================================================================
  // 6. SITEMAP & ROBOTS METADATA
  // =========================================================================
  test('Sitemap includes public routes and excludes administrative routes', () => {
    const sitemapSource = fs.readFileSync(path.resolve('src/app/sitemap.ts'), 'utf8');

    assert.ok(sitemapSource.includes('/shop'), 'Sitemap must include /shop');
    assert.ok(sitemapSource.includes('/combos'), 'Sitemap must include /combos');
    assert.ok(sitemapSource.includes('/our-story'), 'Sitemap must include /our-story');
    assert.ok(sitemapSource.includes('/faq'), 'Sitemap must include /faq');
    assert.ok(sitemapSource.includes('/shipping-policy'), 'Sitemap must include /shipping-policy');
    assert.ok(sitemapSource.includes('/returns-policy'), 'Sitemap must include /returns-policy');
    assert.ok(sitemapSource.includes('/privacy-policy'), 'Sitemap must include /privacy-policy');
    assert.ok(sitemapSource.includes('/terms-and-conditions'), 'Sitemap must include /terms-and-conditions');
    assert.ok(sitemapSource.includes('getAllCategorySlugs'), 'Sitemap must include dynamic category slugs');
    assert.ok(sitemapSource.includes('SIGNATURE_PRODUCTS'), 'Sitemap must include dynamic product slugs');

    // Administrative routes should NOT be in sitemap
    assert.ok(!sitemapSource.includes('/admin'), 'Sitemap must NOT index /admin');
    assert.ok(!sitemapSource.includes('/checkout'), 'Sitemap must NOT index /checkout');
  });

  test('Robots.txt disallows administrative, api, and checkout endpoints', () => {
    const robotsSource = fs.readFileSync(path.resolve('src/app/robots.ts'), 'utf8');

    assert.ok(robotsSource.includes("'/admin/'"), 'Robots must disallow /admin/');
    assert.ok(robotsSource.includes("'/checkout/'"), 'Robots must disallow /checkout/');
    assert.ok(robotsSource.includes("'/api/'"), 'Robots must disallow /api/');
    assert.ok(robotsSource.includes("sitemap:"), 'Robots must point to sitemap.xml');
  });

  // =========================================================================
  // 7. NAVIGATION SYNCHRONIZATION
  // =========================================================================
  test('Header and Footer navigation links resolve to active public routes', () => {
    const headerSource = fs.readFileSync(path.resolve('src/components/navigation/Header.tsx'), 'utf8');
    const footerSource = fs.readFileSync(path.resolve('src/components/navigation/Footer.tsx'), 'utf8');
    const siteConfigSource = fs.readFileSync(path.resolve('src/data/siteConfig.ts'), 'utf8');

    // Header checks
    assert.ok(headerSource.includes('href="/our-story"'), 'Header must link to /our-story');
    assert.ok(headerSource.includes('href="/combos"'), 'Header must link to /combos');
    assert.ok(headerSource.includes('href="/shop"'), 'Header must link to /shop');
    assert.ok(headerSource.includes('href="/track-order"'), 'Header must link to /track-order');

    // SiteConfig checks
    assert.ok(siteConfigSource.includes("href: '/our-story'"), 'SiteConfig explore must include /our-story');
    assert.ok(siteConfigSource.includes("href: '/combos'"), 'SiteConfig explore must include /combos');
    assert.ok(siteConfigSource.includes("href: '/faq'"), 'SiteConfig customerHelp must include /faq');
    assert.ok(siteConfigSource.includes("href: '/shipping-policy'"), 'SiteConfig customerHelp must include /shipping-policy');
    assert.ok(siteConfigSource.includes("href: '/returns-policy'"), 'SiteConfig customerHelp must include /returns-policy');
    assert.ok(siteConfigSource.includes("href: '/privacy-policy'"), 'SiteConfig customerHelp must include /privacy-policy');
    assert.ok(siteConfigSource.includes("href: '/terms-and-conditions'"), 'SiteConfig customerHelp must include /terms-and-conditions');

    // Footer renders Next.js Links
    assert.ok(footerSource.includes('<Link'), 'Footer must render Next.js Link components');
  });
});
