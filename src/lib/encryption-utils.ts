export interface CipherRule {
  original: string;
  replacement: string;
}

export type EncryptionMode = 'encrypt' | 'decrypt';

/**
 * Applies the cipher rules to the given text based on the mode.
 * In 'encrypt' mode, it maps original -> replacement.
 * In 'decrypt' mode, it maps replacement -> original.
 */
export function applyCipher(
  text: string,
  rules: CipherRule[],
  mode: EncryptionMode = 'encrypt'
): string {
  if (!rules.length || !text) return text;

  // 1. Create the mapping based on the mode
  let mapping = mode === 'encrypt'
    ? rules.map(r => ({ from: r.original, to: r.replacement }))
    : rules.map(r => ({ from: r.replacement, to: r.original }));

  // 2. Filter out empty 'from' values and handle duplicates
  // When multiple rules have the same 'from' value (e.g., in decrypt mode if multiple letters mapped to one),
  // we take the first one encountered to ensure a consistent (if lossy) mapping.
  const seen = new Set<string>();
  mapping = mapping.filter(m => {
    if (!m.from || seen.has(m.from)) return false;
    seen.add(m.from);
    return true;
  });

  if (mapping.length === 0) return text;

  // 3. Sort mapping by 'from' string length descending.
  // This is CRITICAL to ensure that longer sequences (words/phrases) are replaced 
  // before individual characters that might be parts of those sequences.
  mapping.sort((a, b) => b.from.length - a.from.length);

  // 4. Build a single regular expression for all patterns
  // Using a single pass replacement ensures we don't "re-encrypt" already replaced parts.
  const escapedPatterns = mapping.map(m => m.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(escapedPatterns.join('|'), 'g');

  // 5. Perform the replacement
  return text.replace(regex, (matched) => {
    const entry = mapping.find(m => m.from === matched);
    return entry ? entry.to : matched;
  });
}
