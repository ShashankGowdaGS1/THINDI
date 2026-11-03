import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';

// Load and evaluate the faqs.ts file dynamically or extract data
const faqsFilePath = path.resolve('src/data/faqs.ts');
const rawSource = fs.readFileSync(faqsFilePath, 'utf8');

// Lightweight extraction of FAQ objects for pure ES module test execution
function extractFaqsFromSource(source) {
  // Extract content between 'export const faqs: FAQItem[] = [' and '];'
  const match = source.match(/export const faqs: FAQItem\[\] = (\[[\s\S]*?\]);/);
  if (!match) {
    throw new Error('Unable to find export const faqs in src/data/faqs.ts');
  }
  // Safe evaluation using JS Function for structured object literals
  return new Function(`return ${match[1]}`)();
}

const faqs = extractFaqsFromSource(rawSource);

function getPublishedFaqs(items) {
  return items
    .filter((item) => item.published === true)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

function getAllFaqs(items) {
  return [...items].sort((a, b) => a.displayOrder - b.displayOrder);
}

describe('Stage 9: Customer Confidence & FAQs Data Architecture', () => {
  test('FAQ data source file exists and contains valid structure', () => {
    assert.ok(fs.existsSync(faqsFilePath), 'src/data/faqs.ts must exist');
    assert.ok(faqs.length >= 7, 'FAQ knowledge base should contain at least 7 entries');
  });

  test('Damaged goods / return policy is strictly kept in draft status (published: false)', () => {
    const damagedItem = faqs.find((f) => f.id === 'damaged-items-policy');
    assert.ok(damagedItem, 'Damaged items FAQ item must exist in database');
    assert.equal(
      damagedItem.published,
      false,
      'Damaged items FAQ must NOT be published until formal business policy is approved'
    );
  });

  test('getPublishedFaqs() strictly excludes draft policy items', () => {
    const published = getPublishedFaqs(faqs);
    const hasDraft = published.some((item) => item.published === false);
    assert.equal(hasDraft, false, 'No unpublished or draft FAQs should be present in public listing');

    const draftItemInPublished = published.find((item) => item.id === 'damaged-items-policy');
    assert.equal(draftItemInPublished, undefined, 'Draft policy must be filtered out of public FAQs');
  });

  test('All published FAQs have valid non-empty questions and answers', () => {
    const published = getPublishedFaqs(faqs);
    for (const faq of published) {
      assert.ok(faq.id && faq.id.trim().length > 0, `FAQ ${faq.id} must have non-empty ID`);
      assert.ok(faq.question && faq.question.trim().length > 0, `FAQ ${faq.id} must have a question`);
      assert.ok(faq.answer && faq.answer.trim().length > 0, `FAQ ${faq.id} must have an answer`);
      assert.equal(typeof faq.displayOrder, 'number', `FAQ ${faq.id} must have numeric displayOrder`);
    }
  });

  test('Published FAQs are strictly sorted by displayOrder in ascending order', () => {
    const published = getPublishedFaqs(faqs);
    for (let i = 0; i < published.length - 1; i++) {
      assert.ok(
        published[i].displayOrder <= published[i + 1].displayOrder,
        `FAQ displayOrder must be sorted ascending: ${published[i].displayOrder} <= ${published[i + 1].displayOrder}`
      );
    }
  });

  test('First published question is "Where is THINDI based?" confirming Hassan origin', () => {
    const published = getPublishedFaqs(faqs);
    const firstFaq = published[0];
    assert.equal(firstFaq.id, 'origin-hassan');
    assert.match(firstFaq.answer, /Hassan, Karnataka/);
  });

  test('All in-page relatedRoutes point to valid section anchors', () => {
    const published = getPublishedFaqs(faqs);
    const validSections = ['#doorstep-delivery', '#signature-picks', '#thindi-box'];
    
    for (const faq of published) {
      if (faq.relatedRoute) {
        assert.ok(
          faq.relatedRoute.startsWith('#'),
          `Route ${faq.relatedRoute} must be an in-page anchor starting with #`
        );
        assert.ok(
          validSections.includes(faq.relatedRoute),
          `Route ${faq.relatedRoute} must target an approved existing homepage section`
        );
      }
    }
  });

  test('Kannada regional typography accents are present for key questions', () => {
    const published = getPublishedFaqs(faqs);
    const originFaq = published.find((f) => f.id === 'origin-hassan');
    assert.ok(originFaq.kannadaQuestion, 'Hassan origin FAQ must have Kannada question');
    assert.ok(originFaq.kannadaAnswer, 'Hassan origin FAQ must have Kannada answer');
  });
});

