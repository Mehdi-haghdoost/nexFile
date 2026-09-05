const WHITESPACE_RE = /(\s+)/;

// Walks a text box's sanitized HTML into logical lines of {text,color,fontSize}
// runs, splitting on <br>. Font size compounds through nested spans via their
// relative "Xem" values, same as the browser would compute it.
const parseContentToLines = (html, baseColor, baseFontSize) => {
    const container = document.createElement('div');
    container.innerHTML = html;

    const lines = [[]];

    const walk = (node, color, fontSize) => {
        Array.from(node.childNodes).forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
                if (child.textContent) lines[lines.length - 1].push({ text: child.textContent, color, fontSize });
                return;
            }

            if (child.nodeType !== Node.ELEMENT_NODE) return;

            if (child.tagName === 'BR') {
                lines.push([]);
                return;
            }

            if (child.tagName === 'SPAN') {
                const nextColor = child.style.color || color;
                const emValue = parseFloat(child.style.fontSize);
                const nextFontSize = child.style.fontSize && !Number.isNaN(emValue) ? fontSize * emValue : fontSize;
                walk(child, nextColor, nextFontSize);
                return;
            }

            walk(child, color, fontSize);
        });
    };

    walk(container, baseColor, baseFontSize);
    return lines;
};

// Splits shaped text into whitespace-preserving tokens, each carrying its own per-character styles
const tokenize = (text, styles) => {
    const parts = text.split(WHITESPACE_RE).filter((part) => part.length > 0);
    let cursor = 0;
    return parts.map((part) => {
        const partStyles = styles.slice(cursor, cursor + part.length);
        cursor += part.length;
        return { text: part, styles: partStyles, isSpace: /^\s+$/.test(part) };
    });
};

// Greedy word-wrap: adds tokens to the current line until the next non-space token would overflow
const packTokensIntoLines = (tokens, wrapWidthPt, measureToken) => {
    const lines = [];
    let current = [];
    let currentWidth = 0;

    tokens.forEach((token) => {
        const tokenWidth = measureToken(token);

        if (!token.isSpace && current.length > 0 && currentWidth + tokenWidth > wrapWidthPt) {
            lines.push(current);
            current = [];
            currentWidth = 0;
        }

        current.push(token);
        currentWidth += tokenWidth;
    });

    if (current.length > 0) lines.push(current);
    return lines;
};

// Re-merges adjacent same-style characters back into drawable runs, in final visual order
const mergeCharsIntoRuns = (chars, styles) => {
    const runs = [];
    chars.forEach((char, i) => {
        const style = styles[i];
        const last = runs[runs.length - 1];
        if (last && last.color === style.color && last.fontSize === style.fontSize) {
            last.text += char;
        } else {
            runs.push({ text: char, color: style.color, fontSize: style.fontSize });
        }
    });
    return runs;
};

/**
 * Lays out one text box's rich HTML content into wrapped, bidi-corrected
 * drawable lines. measureWidth(char, fontSize) must return width in the
 * same unit as wrapWidthPt.
 *
 * Word-wrap decisions are made on the logical (pre-reorder) text -- widths
 * don't change when characters are reordered, only their draw sequence does.
 * Bidi is then recalculated per physical (wrapped) line, per bidi-js's own
 * guidance for text that's been line-wrapped, since a paragraph's overall
 * reordering isn't valid once it's split across multiple lines.
 */
export const layoutTextBox = (box, { wrapWidthPt, measureWidth }) => {
    // eslint-disable-next-line global-require
    const { reshapeText, reorderLineToVisual } = require('./persianText');

    const logicalLines = parseContentToLines(box.content, box.color, box.fontSize);
    const wrappedLines = [];

    logicalLines.forEach((lineRuns) => {
        const rawText = lineRuns.map((r) => r.text).join('');

        if (!rawText) {
            wrappedLines.push({ runs: [], direction: 'ltr', width: 0, maxFontSize: box.fontSize });
            return;
        }

        const styleForIndex = [];
        lineRuns.forEach((r) => {
            for (let i = 0; i < r.text.length; i += 1) styleForIndex.push({ color: r.color, fontSize: r.fontSize });
        });

        // Reshaping runs on the whole line (not per-run) so letters joining
        // across a style-change boundary still connect correctly.
        const shapedText = reshapeText(rawText);

        const tokens = tokenize(shapedText, styleForIndex);
        const measureToken = (token) =>
            token.text.split('').reduce((sum, char, i) => sum + measureWidth(char, token.styles[i].fontSize), 0);

        const packedLines = packTokensIntoLines(tokens, wrapWidthPt, measureToken);

        packedLines.forEach((packedTokens) => {
            const trimmed = [...packedTokens];
            while (trimmed.length && trimmed[trimmed.length - 1].isSpace) trimmed.pop();

            if (trimmed.length === 0) {
                wrappedLines.push({ runs: [], direction: 'ltr', width: 0, maxFontSize: box.fontSize });
                return;
            }

            const lineText = trimmed.map((t) => t.text).join('');
            const lineStyles = trimmed.flatMap((t) => t.styles);

            const { chars, styles, direction } = reorderLineToVisual(lineText, lineStyles);
            const visualRuns = mergeCharsIntoRuns(chars, styles);

            const width = visualRuns.reduce(
                (sum, run) => sum + run.text.split('').reduce((s, c) => s + measureWidth(c, run.fontSize), 0),
                0
            );
            const maxFontSize = Math.max(...lineStyles.map((s) => s.fontSize), box.fontSize);

            wrappedLines.push({ runs: visualRuns, direction, width, maxFontSize });
        });
    });

    return wrappedLines;
};