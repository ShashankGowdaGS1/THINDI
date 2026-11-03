import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';

const siteConfigPath = path.resolve('src/data/siteConfig.ts');
const rawSource = fs.readFileSync(siteConfigPath, 'utf8');

// Lightweight extraction of siteConfig object for pure ES module test execution
function extractSiteConfig(source) {
  const match = source.match(/export const siteConfig: SiteConfig = ({[\s\S]*?});/);
  if (!match) {
    throw new Error('Unable to find export const siteConfig in src/data/siteConfig.ts');
  }
  return new Function(`return ${match[1]}`)();
}

const siteConfig = extractSiteConfig(rawSource);

describe('Stage 10: Closing CTA, Footer and Site Settings Audit', () => {
  test('siteConfig file exists and exports brand information correctly', () => {
    assert.ok(fs.existsSync(siteConfigPath), 'src/data/siteConfig.ts must exist');
    assert.equal(siteConfig.brand.name, 'THINDI');
    assert.equal(siteConfig.brand.kannadaName, 'ತಿಂಡಿ');
    assert.equal(siteConfig.brand.location, 'Hassan, Karnataka');
    assert.match(siteConfig.brand.tagline, /Traditional Karnataka flavours/);
  });

  test('Strictly zero fake social handles or unverified phone numbers in site settings', () => {
    assert.ok(Array.isArray(siteConfig.socialLinks), 'socialLinks must be an array');
    assert.equal(
      siteConfig.socialLinks.length,
      0,
      'socialLinks must remain empty until official verified brand handles are configured'
    );
  });

  test('All footer Explore navigation links resolve to valid implemented anchors or routes', () => {
    const validDestinations = [
      '/',
      '/shop',
      '#signature-picks',
      '#shop-by-craving',
      '/#shop-by-craving',
      '#thindi-box',
      '/#thindi-box',
      '#our-story',
      '/#our-story',
      '/collections/kuruk-thindi',
      '/combos',
      '/our-story',
      '/track-order',
    ];
    for (const item of siteConfig.navigation.explore) {
      assert.ok(item.href, `Navigation item ${item.label} must have href`);
      assert.ok(
        validDestinations.includes(item.href),
        `Destination ${item.href} for ${item.label} must be an approved valid in-page anchor or root`
      );
    }
  });

  test('Customer Care links have either valid href or modal action (no broken/empty pages)', () => {
    for (const item of siteConfig.navigation.customerHelp) {
      if (item.action) {
        assert.ok(
          ['contact', 'notice'].includes(item.action),
          `Action for ${item.label} must be either 'contact' or 'notice'`
        );
        if (item.action === 'notice') {
          assert.ok(item.noticeTitle, `${item.label} must define noticeTitle`);
          assert.ok(item.noticeDescription, `${item.label} must define noticeDescription`);
        }
      } else {
        assert.ok(
          item.href && (item.href.startsWith('#') || item.href.startsWith('/')),
          `${item.label} href must be an in-page anchor or route`
        );
      }
    }
  });

  test('Closing CTA photographic asset exists on disk', () => {
    const platterImgPath = path.resolve('public/images/closing/closing-platter.jpg');
    assert.ok(fs.existsSync(platterImgPath), 'public/images/closing/closing-platter.jpg must exist');
    const stats = fs.statSync(platterImgPath);
    assert.ok(stats.size > 10000, 'Closing platter image must be a valid non-empty file');
  });

  test('Footer displays Hassan, Karnataka as central brand origin', () => {
    assert.equal(siteConfig.legal.region, 'Hassan, Karnataka');
    assert.equal(siteConfig.legal.brandOwner, 'THINDI Foods');
  });
});

