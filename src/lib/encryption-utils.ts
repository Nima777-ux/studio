
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
  // If encrypting: a -> d
  // If decrypting: d -> a
  let mapping = mode === 'encrypt'
    ? rules.map(r => ({ from: r.original, to: r.replacement }))
    : rules.map(r => ({ from: r.replacement, to: r.original }));

  // 2. Filter out empty 'from' values and handle duplicates
  // Duplicate 'from' values are prevented by taking the first rule found.
  // This is crucial for decryption when multiple original characters might have mapped to the same target.
  const seen = new Set<string>();
  mapping = mapping.filter(m => {
    if (!m.from || seen.has(m.from)) return false;
    seen.add(m.from);
    return true;
  });

  if (mapping.length === 0) return text;

  // 3. Sort mapping by 'from' string length descending.
  // This ensures longer strings are replaced before substrings (important for multi-char rules).
  mapping.sort((a, b) => b.from.length - a.from.length);

  // 4. Build a single regular expression for all patterns to process in one pass.
  // This prevents "double-shifting" (e.g., a -> b, b -> c would incorrectly turn 'a' into 'c' if done sequentially).
  const escapedPatterns = mapping.map(m => m.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(escapedPatterns.join('|'), 'g');

  // 5. Perform the replacement
  return text.replace(regex, (matched) => {
    const entry = mapping.find(m => m.from === matched);
    return entry ? entry.to : matched;
  });
}
