import { curriculumData } from '../data/curriculum';
import { tokenizeWords } from './tokenizer';

export function getCurriculumUnits() {
  return curriculumData;
}

export function checkAgainstCurriculum(text, levelId, unitId) {
  const unit = curriculumData.find(u => u.level === levelId && u.unit === unitId);
  if (!unit) return null;

  const words = tokenizeWords(text);
  const wordSet = new Set(words);
  const wordCount = words.length;

  // 1. Word count check
  let wordCountStatus = 'unknown';
  let wordCountTarget = unit.wordCountTarget;
  if (wordCountTarget) {
    const match = wordCountTarget.match(/(\d+)~(\d+)/);
    if (match) {
      const [, min, max] = match;
      if (wordCount < parseInt(min)) wordCountStatus = 'below';
      else if (wordCount > parseInt(max)) wordCountStatus = 'above';
      else wordCountStatus = 'within';
    }
  }

  // 2. Vocabulary coverage
  const targetWords = unit.words || [];
  const foundWords = targetWords.filter(w => wordSet.has(w.toLowerCase()));
  const missingWords = targetWords.filter(w => !wordSet.has(w.toLowerCase()));
  const vocabCoverage = targetWords.length > 0
    ? Math.round((foundWords.length / targetWords.length) * 100)
    : 0;

  // 3. Expression check
  const textLower = text.toLowerCase();
  const targetExpressions = unit.expressions || [];
  const foundExpressions = [];
  const missingExpressions = [];

  for (const expr of targetExpressions) {
    // Extract key words from expression (remove placeholders like [name])
    const cleanExpr = expr.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').trim().toLowerCase();
    const exprWords = cleanExpr.split(/\s+/).filter(w => w.length > 2);
    // Check if most key words appear in text
    const matchCount = exprWords.filter(w => textLower.includes(w)).length;
    if (exprWords.length > 0 && matchCount / exprWords.length >= 0.5) {
      foundExpressions.push(expr);
    } else {
      missingExpressions.push(expr);
    }
  }

  const expressionCoverage = targetExpressions.length > 0
    ? Math.round((foundExpressions.length / targetExpressions.length) * 100)
    : 0;

  // 4. Expression pattern analysis
  const expressionPatternRaw = unit.expressionPattern || '';
  const patternResults = analyzeExpressionPatterns(expressionPatternRaw, text);

  return {
    unit: {
      level: unit.level,
      unitNum: unit.unit,
      cefr: unit.cefr,
      title: unit.title,
      topic: unit.topic,
    },
    wordCount: {
      actual: wordCount,
      target: wordCountTarget,
      status: wordCountStatus,
    },
    vocabulary: {
      coverage: vocabCoverage,
      total: targetWords.length,
      found: foundWords,
      missing: missingWords,
    },
    expressions: {
      coverage: expressionCoverage,
      total: targetExpressions.length,
      found: foundExpressions,
      missing: missingExpressions,
    },
    grammar: unit.grammar || [],
    expressionPattern: expressionPatternRaw,
    patternAnalysis: patternResults,
  };
}

/**
 * Analyze whether expression patterns from curriculum appear in the text.
 * Patterns like "I'm _(name)" become regex "I'm \\w+" to match actual usage.
 */
function analyzeExpressionPatterns(patternStr, text) {
  if (!patternStr) return { patterns: [], found: [], missing: [], coverage: 0 };

  const textLower = text.toLowerCase();
  const lines = patternStr.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const found = [];
  const missing = [];

  for (const pattern of lines) {
    const { regex, display } = patternToRegex(pattern);
    if (!regex) {
      missing.push({ pattern: display, matches: [] });
      continue;
    }

    const matches = [];
    let match;
    while ((match = regex.exec(textLower)) !== null) {
      matches.push(match[0]);
      // Prevent infinite loop for zero-length matches
      if (match[0].length === 0) break;
    }

    if (matches.length > 0) {
      // Get original case matches from text
      const originalMatches = [];
      const regexOriginal = patternToRegex(pattern, false).regex;
      if (regexOriginal) {
        let m;
        while ((m = regexOriginal.exec(text)) !== null) {
          originalMatches.push(m[0]);
          if (m[0].length === 0) break;
        }
      }
      found.push({ pattern: display, matches: originalMatches.length > 0 ? originalMatches : matches });
    } else {
      missing.push({ pattern: display, matches: [] });
    }
  }

  const total = found.length + missing.length;
  const coverage = total > 0 ? Math.round((found.length / total) * 100) : 0;

  return { patterns: lines, found, missing, coverage };
}

/**
 * Convert a curriculum expression pattern to a regex.
 * e.g. "I'm _(name)" → /i'm \w+/gi
 *      "Let's _(verb) _(object)" → /let's \w+ \w+/gi
 *      "He/She is my _(relationship)" → /(?:he|she) is my \w+/gi
 */
function patternToRegex(pattern, caseInsensitive = true) {
  const display = pattern.trim();
  try {
    let raw = pattern.trim();

    // Use token-based approach: replace special parts with tokens first,
    // then escape everything else, then restore tokens as regex fragments.

    const tokens = [];
    function addToken(regexFragment) {
      const id = `__TOKEN_${tokens.length}__`;
      tokens.push(regexFragment);
      return id;
    }

    // Step 1: Extract optional groups like "(by _(행위자))" → optional regex group
    raw = raw.replace(/\(([^)]*_\([^)]*\)[^)]*)\)/g, (match, inner) => {
      // Process inner content of the optional group
      let opt = inner.trim();
      opt = opt.replace(/_\([^)]*\)/g, () => addToken("[\\w',-]+(?:\\s[\\w',-]+){0,3}"));
      opt = opt.replace(/([\w']+(?:\/[\w']+)+)/g, (m) => {
        const alts = m.split('/');
        return addToken(`(?:${alts.join('|')})`);
      });
      // Escape remaining literal chars in optional group
      opt = opt.replace(/[.*+?^${}|[\]\\]/g, '\\$&');
      // Restore tokens
      for (let i = 0; i < tokens.length; i++) {
        opt = opt.replace(`__TOKEN_${i}__`, tokens[i]);
      }
      return addToken(`(?:\\s*${opt.trim()})?`);
    });

    // Step 2: Replace placeholders _(xxx) with word-matching token
    raw = raw.replace(/_\([^)]*\)/g, () => addToken("[\\w',-]+(?:\\s[\\w',-]+){0,3}"));

    // Step 3: Handle alternatives like "Was/Were", "He/She", "When/Where/Who"
    raw = raw.replace(/([\w']+(?:\/[\w']+)+)/g, (m) => {
      const alts = m.split('/');
      return addToken(`(?:${alts.join('|')})`);
    });

    // Step 4: Escape remaining literal characters (period, question mark, etc.)
    raw = raw.replace(/[.*+?^${}|[\]\\]/g, '\\$&');

    // Step 5: Restore all tokens
    for (let i = 0; i < tokens.length; i++) {
      raw = raw.split(`__TOKEN_${i}__`).join(tokens[i]);
    }

    // Step 6: Make trailing punctuation (., ?, !) optional so patterns match mid-sentence
    raw = raw.trim().replace(/(?:\\[.?!])+$/, '[.?!,;]?');

    // Step 7: Flexible whitespace
    raw = raw.trim().replace(/\s+/g, '\\s+');

    const flags = caseInsensitive ? 'gi' : 'g';
    const regex = new RegExp(raw, flags);
    return { regex, display };
  } catch (e) {
    return { regex: null, display };
  }
}
