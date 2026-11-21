import React from 'react';

/**
 * Minimal markdown renderer for Clarivex-1 output.
 * Handles the subset the model actually emits: bold, italic, inline code,
 * links, headings, bullet lists, ordered lists and paragraphs.
 * Builds React elements directly â€” no HTML injection.
 */

type InlineToken = { type: 'text' | 'bold' | 'italic' | 'code' | 'link'; value: string; href?: string };

const INLINE_PATTERN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*\n]+\*)/g;

function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(INLINE_PATTERN)) {
    const raw = match[0];
    const start = match.index ?? 0;

    if (start > lastIndex) {
      tokens.push({ type: 'text', value: text.slice(lastIndex, start) });
    }

    if (raw.startsWith('**')) {
      tokens.push({ type: 'bold', value: raw.slice(2, -2) });
    } else if (raw.startsWith('`')) {
      tokens.push({ type: 'code', value: raw.slice(1, -1) });
    } else if (raw.startsWith('[')) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(raw);
      if (linkMatch) {
        tokens.push({ type: 'link', value: linkMatch[1], href: linkMatch[2] });
      } else {
        tokens.push({ type: 'text', value: raw });
      }
    } else {
      tokens.push({ type: 'italic', value: raw.slice(1, -1) });
    }

    lastIndex = start + raw.length;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return tokens;
}

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  return parseInline(text).map((token, i) => {
    const key = `${keyPrefix}-${i}`;
    switch (token.type) {
      case 'bold':
        return (
          <strong key={key} className="font-semibold text-strong">
            {token.value}
          </strong>
        );
      case 'italic':
        return (
          <em key={key} className="italic">
            {token.value}
          </em>
        );
      case 'code':
        return (
          <code
            key={key}
            className="px-1 py-0.5 rounded bg-surface2 text-[12px] font-mono text-accent2"
          >
            {token.value}
          </code>
        );
      case 'link':
        return (
          <a
            key={key}
            href={token.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent2 underline underline-offset-2 hover:text-strong"
          >
            {token.value}
          </a>
        );
      default:
        return <React.Fragment key={key}>{token.value}</React.Fragment>;
    }
  });
}

type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'p'; text: string };

const BULLET = /^\s*[-*+]\s+(.*)$/;
const ORDERED = /^\s*\d+[.)]\s+(.*)$/;
const HEADING = /^\s*(#{1,6})\s+(.*)$/;

function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: 'p', text: paragraph.join('\n') });
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };

  for (const line of lines) {
    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = HEADING.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] });
      continue;
    }

    const bullet = BULLET.exec(line);
    if (bullet) {
      flushParagraph();
      if (list?.type !== 'ul') {
        flushList();
        list = { type: 'ul', items: [] };
      }
      list.items.push(bullet[1]);
      continue;
    }

    const ordered = ORDERED.exec(line);
    if (ordered) {
      flushParagraph();
      if (list?.type !== 'ol') {
        flushList();
        list = { type: 'ol', items: [] };
      }
      list.items.push(ordered[1]);
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

interface MarkdownProps {
  content: string;
  className?: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ content, className = '' }) => {
  const blocks = parseBlocks(content);

  return (
    <div className={`space-y-2 ${className}`}>
      {blocks.map((block, i) => {
        const key = `b-${i}`;

        if (block.type === 'heading') {
          const size =
            block.level <= 2 ? 'text-[15px]' : block.level === 3 ? 'text-[14px]' : 'text-[13px]';
          return (
            <p key={key} className={`${size} font-semibold text-strong pt-1`}>
              {renderInline(block.text, key)}
            </p>
          );
        }

        if (block.type === 'ul') {
          return (
            <ul key={key} className="space-y-1 pl-1">
              {block.items.map((item, j) => (
                <li key={`${key}-${j}`} className="flex gap-2">
                  <span className="text-accent2 shrink-0 select-none">•</span>
                  <span className="flex-1">{renderInline(item, `${key}-${j}`)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'ol') {
          return (
            <ol key={key} className="space-y-1 pl-1">
              {block.items.map((item, j) => (
                <li key={`${key}-${j}`} className="flex gap-2">
                  <span className="text-accent2 shrink-0 select-none tabular-nums">
                    {j + 1}.
                  </span>
                  <span className="flex-1">{renderInline(item, `${key}-${j}`)}</span>
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={key} className="whitespace-pre-wrap">
            {renderInline(block.text, key)}
          </p>
        );
      })}
    </div>
  );
};
