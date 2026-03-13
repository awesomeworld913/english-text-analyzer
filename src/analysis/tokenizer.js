const abbreviations = new Set([
  'mr', 'mrs', 'ms', 'dr', 'prof', 'sr', 'jr', 'st', 'ave', 'blvd',
  'dept', 'est', 'fig', 'govt', 'inc', 'ltd', 'vol', 'vs', 'etc',
  'e.g', 'i.e', 'u.s', 'u.k', 'u.n',
]);

export function splitSentences(text) {
  if (!text || !text.trim()) return [];

  // Replace abbreviations with placeholder to avoid false splits
  let processed = text;
  const abbrPattern = /\b([A-Za-z])\./g;

  // Split on sentence-ending punctuation followed by space or end
  const sentences = [];
  let current = '';

  const chars = [...processed];
  for (let i = 0; i < chars.length; i++) {
    current += chars[i];

    if ((chars[i] === '.' || chars[i] === '!' || chars[i] === '?')) {
      // Check if this is an abbreviation
      const wordBefore = current.trimEnd().split(/\s+/).pop().toLowerCase().replace(/\.$/, '');
      if (abbreviations.has(wordBefore)) continue;

      // Check for ellipsis (...)
      if (chars[i] === '.' && chars[i + 1] === '.') continue;

      // Check for decimal numbers
      if (chars[i] === '.' && i + 1 < chars.length && /\d/.test(chars[i + 1])) continue;
      if (chars[i] === '.' && i - 1 >= 0 && /\d/.test(chars[i - 1]) && i + 1 < chars.length && /\d/.test(chars[i + 1])) continue;

      // Check if next char is whitespace or end of string
      const nextChar = chars[i + 1];
      if (!nextChar || /\s/.test(nextChar)) {
        const trimmed = current.trim();
        if (trimmed.length > 0) {
          sentences.push(trimmed);
          current = '';
        }
      }
    }
  }

  // Add remaining text as last sentence
  const remaining = current.trim();
  if (remaining.length > 0) {
    sentences.push(remaining);
  }

  return sentences;
}

export function tokenizeWords(text) {
  if (!text || !text.trim()) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z']/g, ' ')
    .split(/\s+/)
    .map(w => w.replace(/^'+|'+$/g, ''))
    .filter(w => w.length > 0);
}

export function splitParagraphs(text) {
  if (!text || !text.trim()) return [];
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
}
