import test from 'node:test';
import assert from 'node:assert/strict';
import { getTranslation, translations } from './translations';

test('getTranslation returns English text by default', () => {
  const result = getTranslation('nav.home', 'en');
  assert.equal(result, 'Home');
});

test('getTranslation returns Hindi text for "hi"', () => {
  const result = getTranslation('nav.home', 'hi');
  assert.equal(result, 'होम');
});

test('getTranslation falls back to English if Hindi key is missing', () => {
  const result = getTranslation('hero.badge', 'hi');
  assert.equal(result, 'एआई-संचालित सॉफ्टवेयर एवं डिजिटल ट्रांसफॉर्मेशन');
});

test('getTranslation returns custom fallback or key if translation is missing', () => {
  const resultWithFallback = getTranslation('non.existent.key', 'en', 'Fallback Text');
  assert.equal(resultWithFallback, 'Fallback Text');

  const resultWithoutFallback = getTranslation('non.existent.key', 'en');
  assert.equal(resultWithoutFallback, 'non.existent.key');
});

test('all translations have both en and hi keys non-empty', () => {
  for (const [key, value] of Object.entries(translations)) {
    assert.ok(value.en && value.en.length > 0, `Missing en translation for ${key}`);
    assert.ok(value.hi && value.hi.length > 0, `Missing hi translation for ${key}`);
  }
});
