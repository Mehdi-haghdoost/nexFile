import ArabicPersianReshaper from 'arabic-persian-reshaper';
import bidiFactory from 'bidi-js';

const bidi = bidiFactory();

// Joins Arabic-script letters into their correct initial/medial/final glyph
// forms; pdf-lib draws whatever codepoints it's given with no shaping of its
// own. No-op on text with no Arabic-script characters.
export const reshapeText = (text) => ArabicPersianReshaper.PersianShaper.convertArabic(text);

// Reorders one physical line of already-shaped text into left-to-right
// drawable order, carrying each character's style through the reordering.
// PDF text drawing has no bidi awareness, so this replaces what a browser's
// text renderer normally does automatically.
export const reorderLineToVisual = (text, styles) => {
    const embeddingLevels = bidi.getEmbeddingLevels(text);
    const direction = embeddingLevels.paragraphs[0]?.level % 2 === 1 ? 'rtl' : 'ltr';

    const chars = text.split('');
    const stylesCopy = [...styles];

    // Swaps mirrored characters (parens, brackets) for RTL context
    const mirrored = bidi.getMirroredCharactersMap(text, embeddingLevels);
    mirrored.forEach((replacement, index) => {
        chars[index] = replacement;
    });

    // Each flip range gets reversed in place, in order, per bidi-js's contract
    const flips = bidi.getReorderSegments(text, embeddingLevels);
    flips.forEach(([start, end]) => {
        let i = start;
        let j = end;
        while (i < j) {
            [chars[i], chars[j]] = [chars[j], chars[i]];
            [stylesCopy[i], stylesCopy[j]] = [stylesCopy[j], stylesCopy[i]];
            i += 1;
            j -= 1;
        }
    });

    return { chars, styles: stylesCopy, direction };
};