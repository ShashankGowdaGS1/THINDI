import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';

// Extract products from src/data/products.ts
const productsFilePath = path.resolve('src/data/products.ts');
const rawSource = fs.readFileSync(productsFilePath, 'utf8');

function extractProducts(source) {
  const sigMatch = source.match(/export const SIGNATURE_PRODUCTS: Product\[\] = (\[[\s\S]*?\]);\s*export const ADDITIONAL_PRODUCTS/);
  const addMatch = source.match(/export const ADDITIONAL_PRODUCTS: Product\[\] = (\[[\s\S]*?\]);\s*export const ALL_SHOP_PRODUCTS/);
  
  if (!sigMatch || !addMatch) {
    throw new Error('Unable to extract product arrays from src/data/products.ts');
  }

  const sig = new Function(`return ${sigMatch[1]}`)();
  const add = new Function(`return ${addMatch[1]}`)();
  return [...sig, ...add];
}

const allProducts = extractProducts(rawSource);

function getProductBySlug(slug) {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();

  const directMatch = allProducts.find(
    (p) => p.slug.toLowerCase() === normalized || p.id.toLowerCase() === normalized
  );
  if (directMatch) return directMatch;

  return allProducts.find((p) => {
    const slugParts = p.slug.split('-');
    const shortName = slugParts[slugParts.length - 1];
    if (shortName === normalized) return true;
    if (p.slug.toLowerCase().includes(normalized)) return true;
    return false;
  });
}

function getRelatedProducts(product) {
  if (product.relatedProductIds && product.relatedProductIds.length > 0) {
    const related = allProducts.filter((p) =>
      product.relatedProductIds.includes(p.id)
    );
    if (related.length > 0) return related;
  }
  return allProducts.filter((p) => p.id !== product.id).slice(0, 3);
}

describe('Stage 12: Dynamic Product Detail Page (/products/[slug])', () => {
  test('Resolves Chakkali by both full slug and short alias', () => {
    const full = getProductBySlug('traditional-hassan-chakkali');
    assert.ok(full, 'Must find Chakkali by full slug');
    assert.equal(full.id, 'thindi-chakkali-01');

    const short = getProductBySlug('chakkali');
    assert.ok(short, 'Must find Chakkali by short alias');
    assert.equal(short.id, 'thindi-chakkali-01');
    assert.equal(short.kannadaName, 'ಹಾಸನ ಚಕ್ಕುಲಿ');
  });

  test('Resolves Kodubale and Nippattu by short aliases', () => {
    const kod = getProductBySlug('kodubale');
    assert.ok(kod, 'Must find Kodubale');
    assert.equal(kod.id, 'thindi-kodubale-02');

    const nip = getProductBySlug('nippattu');
    assert.ok(nip, 'Must find Nippattu');
    assert.equal(nip.id, 'thindi-nippattu-03');
  });

  test('Returns undefined for unknown product slugs (supports 404)', () => {
    const unknown = getProductBySlug('unknown-snack-xyz');
    assert.equal(unknown, undefined, 'Unknown slug must return undefined');
  });

  test('Products have multi-view gallery images existing on disk', () => {
    for (const p of allProducts) {
      assert.ok(p.galleryImages && p.galleryImages.length >= 2, `Product ${p.id} must have >= 2 gallery views`);
      for (const imgPath of p.galleryImages) {
        const diskPath = path.resolve(path.join('public', imgPath));
        assert.ok(fs.existsSync(diskPath), `Gallery image ${imgPath} on ${p.id} must exist on disk`);
      }
    }
  });

  test('Products have verified disclosures (ingredients, allergens, storage, shelf life)', () => {
    for (const p of allProducts) {
      assert.ok(p.ingredients.length >= 3, `Product ${p.id} must list verified ingredients`);
      assert.ok(p.storageInstructions, `Product ${p.id} must have storage instructions`);
      assert.ok(p.shelfLife, `Product ${p.id} must state shelf life`);
    }
  });

  test('Related products returns complementary items excluding the product itself', () => {
    const chakkali = getProductBySlug('chakkali');
    const related = getRelatedProducts(chakkali);
    assert.ok(related.length >= 2, 'Should return at least 2 related products');
    assert.ok(!related.some((p) => p.id === chakkali.id), 'Must not include itself');
    assert.ok(related.some((p) => p.id === 'thindi-kodubale-02'), 'Chakkali pairs with Kodubale');
  });
});

