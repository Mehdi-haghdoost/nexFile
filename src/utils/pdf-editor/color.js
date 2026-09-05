// Accepts "#abc", "#aabbcc", "abc", or "aabbcc"
export const isValidHexColor = (input) =>
    typeof input === 'string' && /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(input.trim());

export const normalizeHexColor = (input, fallback = '#000000') => {
    if (!isValidHexColor(input)) return fallback;

    const clean = input.trim().replace('#', '');

    if (clean.length === 3) {
        // 3-digit shorthand expands each digit
        const [r, g, b] = clean.split('');
        return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }

    return `#${clean}`.toLowerCase();
};