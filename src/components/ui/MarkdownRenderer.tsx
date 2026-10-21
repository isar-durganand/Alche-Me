import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Alche-Me — High-Readability Scientific Markdown Renderer
 * Provides comfortable, readable font sizes (15-16px body, 20-24px headers),
 * chemical formula subscripts (H₂O, CO₂), bulleted lists, and callout blocks.
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
}) => {
  if (!content) return null;

  // Format chemical formulas and common subscripts automatically
  const formatChemicalText = (text: string): string => {
    return text
      .replace(/->/g, '→')
      .replace(/<->/g, '⇄')
      .replace(/H2O/g, 'H₂O')
      .replace(/CO2/g, 'CO₂')
      .replace(/O2/g, 'O₂')
      .replace(/H2/g, 'H₂')
      .replace(/N2/g, 'N₂')
      .replace(/Cl2/g, 'Cl₂')
      .replace(/CH4/g, 'CH₄')
      .replace(/SO4/g, 'SO₄²⁻')
      .replace(/NO3/g, 'NO₃⁻')
      .replace(/ZnCl2/g, 'ZnCl₂')
      .replace(/Cu2\(OH\)2CO3/g, 'Cu₂(OH)₂CO₃')
      .replace(/Fe2O3/g, 'Fe₂O₃')
      .replace(/KMnO4/g, 'KMnO₄')
      .replace(/H2SO4/g, 'H₂SO₄')
      .replace(/HCl/g, 'HCl')
      .replace(/degC/g, '°C');
  };

  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let currentListItems: string[] = [];
  let inNumberedList = false;

  const flushList = () => {
    if (currentListItems.length > 0) {
      if (inNumberedList) {
        renderedElements.push(
          <ol key={`ol-${renderedElements.length}`} className="my-3 space-y-2 list-none pl-1">
            {currentListItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-[#008E9B] text-xs font-montserrat font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
              </li>
            ))}
          </ol>
        );
      } else {
        renderedElements.push(
          <ul key={`ul-${renderedElements.length}`} className="my-3 space-y-2 list-none pl-1">
            {currentListItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-[#00C2D1] shrink-0 mt-2 shadow-xs" />
                <span dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
              </li>
            ))}
          </ul>
        );
      }
      currentListItems = [];
      inNumberedList = false;
    }
  };

  const renderInline = (str: string): string => {
    const formatted = formatChemicalText(str);
    return formatted
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-[#0B1F2A]">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-[#008E9B] font-mono text-xs font-bold">$1</code>');
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      return;
    }

    // Headings
    if (line.startsWith('### ')) {
      flushList();
      renderedElements.push(
        <h4 key={`h3-${idx}`} className="text-base sm:text-lg font-montserrat font-extrabold text-[#0B1F2A] mt-5 mb-2 flex items-center gap-2">
          <span className="w-2 h-4 rounded-full bg-[#00C2D1] inline-block" />
          {line.replace('### ', '')}
        </h4>
      );
      return;
    }

    if (line.startsWith('## ')) {
      flushList();
      renderedElements.push(
        <h3 key={`h2-${idx}`} className="text-lg sm:text-xl font-montserrat font-extrabold text-[#0B1F2A] mt-6 mb-2.5 pb-1 border-b border-slate-100">
          {line.replace('## ', '')}
        </h3>
      );
      return;
    }

    if (line.startsWith('# ')) {
      flushList();
      renderedElements.push(
        <h2 key={`h1-${idx}`} className="text-xl sm:text-2xl font-montserrat font-black text-[#0B1F2A] mt-6 mb-3">
          {line.replace('# ', '')}
        </h2>
      );
      return;
    }

    // Blockquote & Callouts
    if (line.startsWith('> ')) {
      flushList();
      const quoteText = line.replace(/^>\s*/, '');
      renderedElements.push(
        <div key={`quote-${idx}`} className="my-3 p-3.5 rounded-2xl border-l-4 border-[#00C2D1] bg-teal-50/60 text-sm sm:text-base text-slate-800 leading-relaxed shadow-xs">
          <span dangerouslySetInnerHTML={{ __html: renderInline(quoteText) }} />
        </div>
      );
      return;
    }

    // Unordered list
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (inNumberedList) flushList();
      currentListItems.push(line.substring(2));
      return;
    }

    // Numbered list (e.g. "1. ")
    const numMatch = line.match(/^\d+\.\s+(.*)/);
    if (numMatch) {
      if (!inNumberedList && currentListItems.length > 0) flushList();
      inNumberedList = true;
      currentListItems.push(numMatch[1]);
      return;
    }

    // Regular Paragraph
    flushList();
    renderedElements.push(
      <p
        key={`p-${idx}`}
        className="text-sm sm:text-base text-slate-700 leading-relaxed mb-3 font-normal"
        dangerouslySetInnerHTML={{ __html: renderInline(line) }}
      />
    );
  });

  flushList();

  return (
    <div className={`prose-alche space-y-1 select-text ${className}`}>
      {renderedElements}
    </div>
  );
};
