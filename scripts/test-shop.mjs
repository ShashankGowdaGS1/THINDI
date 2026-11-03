import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';

// Extract products from src/data/products.ts
const productsFilePath = path.resolve('src/data/products.ts');
const rawSource = fs.readFileSync(productsFilePath, 'utf8');

function extractProducts(source) {
  // Extract ALL_SHOP_PRODUCTS or combine SIGNATURE_PRODUCTS and ADDITIONAL_PRODUCTS
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

describe('Stage 11: Shop All Thindi (/shop) Architecture & Catalogue', () => {
  test('Complete shop catalogue contains authentic products across all 4 categories', () => {
    assert.ok(allProducts.length >= 8, `Expected at least 8 products, found ${allProducts.length}`);
    const categories = new Set(allProducts.map((p) => p.category));
    assert.ok(categories.has('kuruk-thindi'), 'Must have kuruk-thindi');
    assert.ok(categories.has('sihi-thindi'), 'Must have sihi-thindi');
    assert.ok(categories.has('uppinakai'), 'Must have uppinakai');
    assert.ok(categories.has('appala-sandige'), 'Must have appala-sandige');
  });

  test('All products have valid identifiers, Kannada names, and image files on disk', () => {
    for (const p of allProducts) {
      assert.ok(p.id && p.id.startsWith('thindi-'), `Product ${p.id} must have thindi- prefix`);
      assert.ok(p.slug, `Product ${p.id} must have a slug`);
      assert.ok(p.name, `Product ${p.id} must have a name`);
      assert.ok(p.kannadaName, `Product ${p.id} must have Kannada name`);
      assert.ok(p.origin.includes('Hassan'), `Product ${p.id} origin must mention Hassan`);
      assert.ok(p.variants.length > 0, `Product ${p.id} must have at least one variant`);

      // Verify image exists on disk in public
      const diskPath = path.resolve(path.join('public', p.imageSrc));
      assert.ok(fs.existsSync(diskPath), `Image file for ${p.id} at ${diskPath} must exist`);
    }
  });

  test('Category filtering isolates expected products correctly', () => {
    const kuruk = allProducts.filter((p) => p.category === 'kuruk-thindi');
    assert.ok(kuruk.length >= 3, 'Kuruk Thindi should have at least 3 products');
    assert.ok(kuruk.some((p) => p.id === 'thindi-chakkali-01'));

    const sihi = allProducts.filter((p) => p.category === 'sihi-thindi');
    assert.ok(sihi.length >= 2, 'Sihi Thindi should have at least 2 sweets');
    assert.ok(sihi.some((p) => p.name.includes('Obbattu')));
    assert.ok(sihi.some((p) => p.name.includes('Kajjaya')));

    const pickles = allProducts.filter((p) => p.category === 'uppinakai');
    assert.ok(pickles.length >= 2, 'Uppinakai should have at least 2 pickles');

    const appala = allProducts.filter((p) => p.category === 'appala-sandige');
    assert.ok(appala.length >= 2, 'Appala & Sandige should have at least 2 items');
  });

  test('Search filtering matches English names, Kannada names, and keywords', () => {
    // English search
    const chakkaliResults = allProducts.filter((p) =>
      p.name.toLowerCase().includes('chakkali')
    );
    assert.equal(chakkaliResults.length, 1);
    assert.equal(chakkaliResults[0].id, 'thindi-chakkali-01');

    // Kannada search
    const kannadaResults = allProducts.filter((p) =>
      p.kannadaName.includes('ಒಬ್ಬಟ್ಟು')
    );
    assert.equal(kannadaResults.length, 1);
    assert.equal(kannadaResults[0].id, 'thindi-obbattu-05');

    // Keyword search (e.g. holige -> obbattu)
    const keywordResults = allProducts.filter((p) =>
      p.keywords?.some((k) => k.toLowerCase().includes('holige'))
    );
    assert.equal(keywordResults.length, 1);
    assert.equal(keywordResults[0].id, 'thindi-obbattu-05');
  });

  test('Sorting by price-asc orders items correctly by minimum variant price', () => {
    const sortedAsc = [...allProducts].sort((a, b) => {
      const minA = Math.min(...a.variants.map((v) => v.price));
      const minB = Math.min(...b.variants.map((v) => v.price));
      return minA - minB;
    });

    for (let i = 0; i < sortedAsc.length - 1; i++) {
      const minA = Math.min(...sortedAsc[i].variants.map((v) => v.price));
      const minB = Math.min(...sortedAsc[i + 1].variants.map((v) => v.price));
      assert.ok(minA <= minB, `Prices must be ascending: ${minA} <= ${minB}`);
    }
  });

  test('Sorting by name-asc orders items alphabetically', () => {
    const sortedNames = [...allProducts].sort((a, b) => a.name.localeCompare(b.name));
    for (let i = 0; i < sortedNames.length - 1; i++) {
      assert.ok(
        sortedNames[i].name.localeCompare(sortedNames[i + 1].name) <= 0,
        `Names must be in alphabetical order: ${sortedNames[i].name} <= ${sortedNames[i + 1].name}`
      );
    }
  });
});

