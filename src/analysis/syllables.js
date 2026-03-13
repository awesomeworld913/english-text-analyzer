export function countSyllables(word) {
  word = word.toLowerCase().trim();
  if (word.length <= 3) return 1;

  // Remove trailing silent e
  word = word.replace(/(?:[^leas])e$/, '');
  // Remove trailing ed if not adding a syllable
  word = word.replace(/(?:[^aeiouyd])ed$/, '');

  // Count vowel groups
  const vowelGroups = word.match(/[aeiouy]+/g);
  let count = vowelGroups ? vowelGroups.length : 1;

  // Adjustments for special patterns
  // -le at end preceded by consonant adds a syllable
  if (/[^aeiou]le$/.test(word)) count++;
  // -tion, -sion count as one syllable (already handled by vowel groups mostly)
  // -ia, -io at end
  if (/ia$/.test(word)) count++;
  if (/io$/.test(word)) count++;

  return Math.max(1, count);
}

export function countTotalSyllables(words) {
  return words.reduce((sum, word) => sum + countSyllables(word), 0);
}
