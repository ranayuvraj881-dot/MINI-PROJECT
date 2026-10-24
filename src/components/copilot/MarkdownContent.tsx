import React, { useState } from 'react';
import { Copy, Check, Info, Lightbulb } from 'lucide-react';

interface MarkdownContentProps {
  content: string;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper to parse inline formatting: **bold**, `code`, etc.
  const renderInline = (text: string) => {
    const parts = [];
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const matchText = match[0];
      if (matchText.startsWith('**') && matchText.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-bold text-slate-900">
            {matchText.slice(2, -2)}
          </strong>
        );
      } else if (matchText.startsWith('`') && matchText.endsWith('`')) {
        parts.push(
          <code
            key={match.index}
            className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 text-blue-700 font-semibold border border-slate-200"
          >
            {matchText.slice(1, -1)}
          </code>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Split into paragraphs / blocks
  const blocks = content.split('\n\n');

  return (
    <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-slate-800">
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();

        // 1. Code Block ``` ... ```
        if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
          const firstLineEnd = trimmed.indexOf('\n');
          const lang = firstLineEnd > 3 ? trimmed.slice(3, firstLineEnd).trim() : 'code';
          const codeBody = trimmed.slice(firstLineEnd + 1, -3);

          return (
            <div key={bIdx} className="my-2 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 text-slate-100 shadow-sm">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/90 border-b border-slate-700 text-[11px] font-mono text-slate-400">
                <span>{lang || 'code'}</span>
                <button
                  onClick={() => handleCopy(codeBody, bIdx)}
                  className="flex items-center gap-1 hover:text-white transition-colors p-1"
                  title="Copy code"
                >
                  {copiedIndex === bIdx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 text-xs font-mono overflow-x-auto leading-relaxed">
                <code>{codeBody}</code>
              </pre>
            </div>
          );
        }

        // 2. Markdown Table
        if (trimmed.startsWith('|') && trimmed.includes('\n|')) {
          const lines = trimmed.split('\n').filter((l) => l.trim().startsWith('|'));
          if (lines.length >= 2) {
            const headerCols = lines[0]
              .split('|')
              .map((c) => c.trim())
              .filter((c) => c.length > 0);
            const dataRows = lines.slice(2).map((l) =>
              l
                .split('|')
                .map((c) => c.trim())
                .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
            );

            return (
              <div key={bIdx} className="my-3 overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      {headerCols.map((col, idx) => (
                        <th key={idx} className="p-2.5 font-bold text-slate-800">
                          {renderInline(col)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {dataRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-2.5 text-slate-700">
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
        }

        // 3. Blockquotes / Alerts
        if (trimmed.startsWith('>')) {
          const isTip = trimmed.includes('[!TIP]');
          const isNote = trimmed.includes('[!NOTE]');
          const cleanText = trimmed
            .replace(/>\s*\[!(NOTE|TIP|IMPORTANT|WARNING)\]\s*/g, '')
            .replace(/>\s*/g, ' ')
            .trim();

          return (
            <div
              key={bIdx}
              className={`my-2 p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                isTip
                  ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                  : isNote
                  ? 'bg-blue-50/80 border-blue-200 text-blue-900'
                  : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              {isTip ? (
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed font-medium">{renderInline(cleanText)}</div>
            </div>
          );
        }

        // 4. Headers
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={bIdx} className="text-sm sm:text-base font-extrabold text-slate-900 border-b border-slate-100 pb-1 pt-1 tracking-tight">
              {renderInline(trimmed.replace('### ', ''))}
            </h3>
          );
        }

        if (trimmed.startsWith('#### ')) {
          return (
            <h4 key={bIdx} className="text-xs sm:text-sm font-bold text-slate-900 pt-1 tracking-tight">
              {renderInline(trimmed.replace('#### ', ''))}
            </h4>
          );
        }

        // 5. Bullet / Numbered Lists inside a block
        const lines = trimmed.split('\n');
        if (lines.length > 1 && lines.every((l) => l.trim().startsWith('- ') || l.trim().startsWith('* ') || /^\d+\.\s/.test(l.trim()))) {
          return (
            <ul key={bIdx} className="space-y-1.5 my-1.5 pl-1">
              {lines.map((line, lIdx) => {
                const isNum = /^\d+\.\s/.test(line.trim());
                const clean = line.replace(/^(-\s|\*\s|\d+\.\s)/, '').trim();
                return (
                  <li key={lIdx} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold shrink-0 mt-0.5">
                      {isNum ? `${lIdx + 1}.` : '•'}
                    </span>
                    <span>{renderInline(clean)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // 6. Standard paragraph
        return (
          <p key={bIdx} className="whitespace-pre-line leading-relaxed">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};
