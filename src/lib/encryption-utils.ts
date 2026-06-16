export interface CipherRule {
  original: string;
  replacement: string;
}

export type EncryptionMode = 'encrypt' | 'decrypt';

export function applyCipher(
  text: string,
  rules: CipherRule[],
  mode: EncryptionMode = 'encrypt'
): string {
  if (!rules.length) return text;

  // We should replace based on the mode.
  // Sorting rules by length descending to handle "word" substitutions before "character" substitutions.
  const activeRules = [...rules].sort((a, b) => b.original.length - a.original.length);

  let result = text;

  if (mode === 'encrypt') {
    // Single pass substitution is tricky with overlapping rules.
    // A more robust way: Find all positions of all patterns, sort them, then replace.
    return replaceAllSimultaneously(text, activeRules.map(r => ({ from: r.original, to: r.replacement })));
  } else {
    // For decrypt, swap the original and replacement.
    const reverseRules = activeRules.map(r => ({ from: r.replacement, to: r.original }));
    return replaceAllSimultaneously(text, reverseRules);
  }
}

function replaceAllSimultaneously(text: string, mapping: { from: string, to: string }[]): string {
  if (!text || mapping.length === 0) return text;

  // Escape special regex chars
  const patterns = mapping.map(m => m.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(patterns.join('|'), 'g');

  return text.replace(regex, (matched) => {
    const mapEntry = mapping.find(m => m.from === matched);
    return mapEntry ? mapEntry.to : matched;
  });
}
