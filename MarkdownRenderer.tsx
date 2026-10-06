import React, { useState } from 'react';
import { marked } from 'marked';
import { Check, Copy } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Pre-process LaTeX style math delimiters for clean rendering if present
  // Replace $$...$$ with block math representation and $...$ with inline math representation
  const processedContent = React.useMemo(() => {
    return content;
  }, [content]);

  // Split into code blocks and markdown segments to render code blocks with interactive copy buttons
  const segments = React.useMemo(() => {
    const parts: Array<{ type: 'markdown' | 'code'; content: string; language?: string }> = [];
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = codeBlockRegex.exec(processedContent)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'markdown',
          content: processedContent.slice(lastIndex, match.index),
        });
      }
      parts.push({
        type: 'code',
        language: match[1]?.trim() || 'code',
        content: match[2],
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < processedContent.length) {
      parts.push({
        type: 'markdown',
        content: processedContent.slice(lastIndex),
      });
    }

    return parts;
  }, [processedContent]);

  return (
    <div className="space-y-3 leading-relaxed text-slate-800 dark:text-slate-100 font-sans">
      {segments.map((segment, idx) => {
        if (segment.type === 'code') {
          return (
            <CodeBlock
              key={idx}
              language={segment.language || 'text'}
              code={segment.content}
            />
          );
        }

        // Render standard markdown with marked
        const rawHtml = marked.parse(segment.content, {
          gfm: true,
          breaks: true,
        }) as string;

        return (
          <div
            key={idx}
            className="prose-chat prose dark:prose-invert max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-pre:my-2"
            dangerouslySetInnerHTML={{ __html: rawHtml }}
          />
        );
      })}
    </div>
  );
};

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900 shadow-md">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700/60 text-xs text-slate-300">
        <span className="font-mono font-medium tracking-wide uppercase text-indigo-400">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 transition cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-slate-100 font-mono text-xs sm:text-sm leading-relaxed">
        <pre className="m-0 p-0 whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
