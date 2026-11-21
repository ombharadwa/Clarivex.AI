import test from 'node:test';
import assert from 'node:assert/strict';
import { Clarivex1, ChatTurn } from './clarivex1';

const model = Clarivex1.load();

test('buildPrompt keeps only the latest user turn', () => {
  const turns: ChatTurn[] = [
    { role: 'user', content: 'What services do you offer?' },
    { role: 'assistant', content: 'We deliver ten core capabilities.' },
    { role: 'user', content: 'What are your pricing tiers?' },
  ];

  assert.equal(model.buildPrompt(turns), '<|user|>What are your pricing tiers?<|assistant|>');
});

test('buildPrompt preserves newlines inside a user turn', () => {
  const turns: ChatTurn[] = [{ role: 'user', content: 'first line\nsecond line' }];
  assert.equal(model.buildPrompt(turns), '<|user|>first line\nsecond line<|assistant|>');
});

test('generate keeps the question when maxNewTokens exceeds the context window', () => {
  // Regression: maxNewTokens > block_size used to collapse the prompt budget to
  // 8 tokens, silently discarding the user's question.
  const turns: ChatTurn[] = [{ role: 'user', content: 'What are your pricing tiers?' }];
  const result = model.generate(turns, { maxNewTokens: 260, temperature: 0.2, topK: 5 });

  assert.ok(
    result.promptTokens >= 6,
    `prompt should keep the full question, got ${result.promptTokens} tokens`
  );
  assert.match(result.text, /4,999/);
});

test('generate answers the latest question in a multi-turn conversation', () => {
  const turns: ChatTurn[] = [
    { role: 'user', content: 'What services does Clarivex.AI offer?' },
    { role: 'assistant', content: 'We deliver ten core capabilities across AI and software.' },
    { role: 'user', content: 'Which industries do you serve?' },
  ];
  const result = model.generate(turns, { maxNewTokens: 120, temperature: 0.2, topK: 5 });

  assert.match(result.text, /Healthcare/);
});
