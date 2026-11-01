import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math?: string;
  block?: boolean;
  className?: string;
  children?: string;
}

/**
 * MathView renders LaTeX mathematics using KaTeX.
 * Can be used as <MathView math="a/b = c/d" /> or <MathView>{'نص مع $x = 5$'}</MathView>
 */
export const MathView: React.FC<MathViewProps> = ({
  math,
  block = false,
  className = '',
  children,
}) => {
  const content = math !== undefined ? math : children || '';

  const html = useMemo(() => {
    if (!content) return '';

    // If explicit math prop without delimiters, render directly
    if (math !== undefined) {
      try {
        return katex.renderToString(content, {
          displayMode: block,
          throwOnError: false,
          output: 'htmlAndMathml',
        });
      } catch (err) {
        return `<span class="text-amber-400 font-mono">${content}</span>`;
      }
    }

    // Otherwise, parse embedded $...$ and $$...$$
    // Replace $$...$$ first, then $...$
    try {
      let parsed = content;
      // Replace block math $$...$$
      parsed = parsed.replace(/\$\$([\s\S]+?)\$\$/g, (_, equation) => {
        try {
          return katex.renderToString(equation.trim(), {
            displayMode: true,
            throwOnError: false,
          });
        } catch {
          return `<div class="katex-display">${equation}</div>`;
        }
      });

      // Replace inline math $...$
      parsed = parsed.replace(/\$([^\$\n]+?)\$/g, (_, equation) => {
        try {
          return katex.renderToString(equation.trim(), {
            displayMode: false,
            throwOnError: false,
          });
        } catch {
          return `<span class="katex">${equation}</span>`;
        }
      });

      // Support line breaks in text
      parsed = parsed.replace(/\n/g, '<br />');

      return parsed;
    } catch {
      return content;
    }
  }, [content, block, math]);

  return (
    <span
      className={`inline-math-container ${block ? 'block text-center my-2' : 'inline'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MathView;
