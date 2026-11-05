import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';

interface PreviewProps {
  content: string;
}

const MATH_BLOCK_PREFIX = '___MATH_BLOCK_';
const MATH_BLOCK_SUFFIX = '___';

function extractMath(content: string): { processed: string; mathBlocks: string[] } {
  const mathBlocks: string[] = [];
  let processed = content;
  
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (match) => {
    const index = mathBlocks.length;
    mathBlocks.push(match);
    return `${MATH_BLOCK_PREFIX}${index}${MATH_BLOCK_SUFFIX}`;
  });
  
  processed = processed.replace(/\$([^$\n]+?)\$/g, (match) => {
    const index = mathBlocks.length;
    mathBlocks.push(match);
    return `${MATH_BLOCK_PREFIX}${index}${MATH_BLOCK_SUFFIX}`;
  });
  
  return { processed, mathBlocks };
}

function restoreMath(content: string, mathBlocks: string[]): string {
  let restored = content;
  mathBlocks.forEach((block, index) => {
    const placeholder = `${MATH_BLOCK_PREFIX}${index}${MATH_BLOCK_SUFFIX}`;
    restored = restored.replace(placeholder, block);
  });
  return restored;
}

function preprocessLuoguContainers(content: string): string {
  const { processed, mathBlocks } = extractMath(content);
  
  const lines = processed.split('\n');
  const result: string[] = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    const startMatch = line.match(/^(:{3,})(info|success|warning|error|align|epigraph)(?:\[([^\]]*)\]|\{([^}]*)\})?\s*$/);
    
    if (startMatch) {
      const colons = startMatch[1].length;
      const type = startMatch[2];
      const title = startMatch[3] || startMatch[4] || '';
      const endPattern = ':'.repeat(colons);
      
      let endIndex = -1;
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() === endPattern) {
          endIndex = j;
          break;
        }
      }
      
      if (endIndex !== -1) {
        const containerContent = lines.slice(i + 1, endIndex).join('\n');
        let html = '';
        
        if (type === 'info' || type === 'success' || type === 'warning' || type === 'error') {
          html = `<details class="luogu-container luogu-container-${type}">\n`;
          if (title) {
            html += `<summary class="luogu-container-title">${title}</summary>\n`;
          }
          html += `<div class="luogu-container-content">\n\n${containerContent}\n\n</div>\n`;
          html += `</details>`;
        } else if (type === 'align') {
          const align = title || 'center';
          html = `<div class="luogu-container luogu-container-align" style="text-align: ${align};">\n`;
          html += `<div class="luogu-container-content">\n\n${containerContent}\n\n</div>\n`;
          html += `</div>`;
        } else if (type === 'epigraph') {
          html = `<blockquote class="luogu-container luogu-container-epigraph">\n`;
          if (title) {
            html += `<cite class="luogu-container-title">${title}</cite>\n`;
          }
          html += `<div class="luogu-container-content">\n\n${containerContent}\n\n</div>\n`;
          html += `</blockquote>`;
        }
        
        result.push(html);
        i = endIndex + 1;
        continue;
      }
    }
    
    result.push(line);
    i++;
  }
  
  const joined = result.join('\n');
  return restoreMath(joined, mathBlocks);
}

export default function Preview({ content }: PreviewProps) {
  const processedContent = preprocessLuoguContainers(content);
  
  return (
    <div className="preview-content p-6">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeKatex, { 
            strict: false,
            errorColor: '#cc0000',
            throwOnError: false
          }]
        ]}
        components={{
          p: ({ children }) => <p style={{ whiteSpace: 'pre-wrap' }}>{children}</p>,
          h1: ({ children }) => <h1 style={{ overflow: 'visible' }}>{children}</h1>,
          h2: ({ children }) => <h2 style={{ overflow: 'visible' }}>{children}</h2>,
          h3: ({ children }) => <h3 style={{ overflow: 'visible' }}>{children}</h3>,
          h4: ({ children }) => <h4 style={{ overflow: 'visible' }}>{children}</h4>,
          h5: ({ children }) => <h5 style={{ overflow: 'visible' }}>{children}</h5>,
          h6: ({ children }) => <h6 style={{ overflow: 'visible' }}>{children}</h6>,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
