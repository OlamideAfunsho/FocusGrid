"use client";

import React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Raw HTML stays disabled (react-markdown's default), so note text can never inject markup
const components: Components = {
  h1: ({ children }) => <h3 className="text-lg font-bold text-[#3E3A72] mt-4 mb-2 first:mt-0">{children}</h3>,
  h2: ({ children }) => <h4 className="text-base font-bold text-[#3E3A72] mt-4 mb-2 first:mt-0">{children}</h4>,
  h3: ({ children }) => <h5 className="text-sm font-semibold text-[#3E3A72] mt-3 mb-1.5 first:mt-0">{children}</h5>,
  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-[#3E3A72]">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="marker:text-[#8F98A3]">{children}</li>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#3399FF] underline">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-neutral-200 pl-3 italic text-[#6C7278] mb-3">{children}</blockquote>
  ),
  // Inline code is styled here; the `pre` rules below reset it inside code blocks
  code: ({ children }) => (
    <code className="bg-neutral-100 rounded px-1 py-0.5 font-mono text-xs">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="bg-neutral-100 rounded-lg p-3 mb-3 overflow-x-auto text-xs [&>code]:bg-transparent [&>code]:p-0">
      {children}
    </pre>
  ),
  hr: () => <hr className="border-neutral-200 my-4" />,
  table: ({ children }) => (
    <div className="overflow-x-auto mb-3">
      <table className="w-full text-xs border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-neutral-200 px-2 py-1 text-left font-semibold text-[#3E3A72]">{children}</th>
  ),
  td: ({ children }) => <td className="border border-neutral-200 px-2 py-1 align-top">{children}</td>,
  input: (props) => <input {...props} className="mr-1.5 align-middle accent-[#3399FF]" />,
};

// Markdown symbols removed, for card previews and other one-line summaries
export const stripMarkdown = (markdown: string) =>
  markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s*[-*+]\s+(\[[ xX]\]\s*)?/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^\s*([-*_]\s*){3,}$/gm, ' ')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

interface MarkdownContentProps {
  content: string;
  className?: string;
}

const MarkdownContent = ({ content, className = '' }: MarkdownContentProps) => (
  <div className={`text-sm text-neutral-700 leading-relaxed break-words ${className}`}>
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  </div>
);

export default MarkdownContent;
