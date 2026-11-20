import test from 'node:test';
import assert from 'node:assert/strict';
import { getPageSeo, SEO_METADATA_EN, SEO_METADATA_HI } from './seo';
import { PageTab } from '../types';

const allTabs: PageTab[] = ['home', 'about', 'services', 'workspace', 'industries', 'careers', 'contact'];

test('SEO English metadata completeness and quality', () => {
  for (const tab of allTabs) {
    const meta = SEO_METADATA_EN[tab];
    assert.ok(meta, `Metadata should exist for tab: ${tab}`);
    assert.ok(meta.title, `Title should exist for tab: ${tab}`);
    assert.ok(meta.description, `Description should exist for tab: ${tab}`);

    // Title should be between 25 and 70 characters
    assert.ok(
      meta.title.length >= 25 && meta.title.length <= 70,
      `Title "${meta.title}" length (${meta.title.length}) should be within optimal range (25-70 chars) for tab: ${tab}`
    );

    // Title should contain brand name Clarivex
    assert.ok(meta.title.includes('Clarivex'), `Title "${meta.title}" should include brand name Clarivex`);

    // Description should be between 100 and 180 characters for optimal search snippet display
    assert.ok(
      meta.description.length >= 100 && meta.description.length <= 180,
      `Description "${meta.description}" length (${meta.description.length}) should be within 100-180 chars for tab: ${tab}`
    );
  }
});

test('SEO Hindi metadata completeness', () => {
  for (const tab of allTabs) {
    const meta = SEO_METADATA_HI[tab];
    assert.ok(meta, `Hindi metadata should exist for tab: ${tab}`);
    assert.ok(meta.title, `Hindi title should exist for tab: ${tab}`);
    assert.ok(meta.description, `Hindi description should exist for tab: ${tab}`);
    assert.ok(meta.title.includes('Clarivex'), `Hindi title should preserve brand name Clarivex`);
  }
});

test('getPageSeo handles valid tabs and defaults', () => {
  const homeMeta = getPageSeo('home', 'en');
  assert.equal(homeMeta.title, SEO_METADATA_EN.home.title);

  const servicesMeta = getPageSeo('services', 'en');
  assert.equal(servicesMeta.title, SEO_METADATA_EN.services.title);

  const workspaceMeta = getPageSeo('workspace', 'en');
  assert.equal(workspaceMeta.title, SEO_METADATA_EN.workspace.title);

  // Hindi retrieval
  const contactHindi = getPageSeo('contact', 'hi');
  assert.equal(contactHindi.title, SEO_METADATA_HI.contact.title);

  // Fallback for unknown tab
  // @ts-expect-error Testing invalid tab fallback
  const fallback = getPageSeo('unknown_tab_name', 'en');
  assert.equal(fallback.title, SEO_METADATA_EN.home.title);
});
