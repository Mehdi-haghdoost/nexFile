import {
    EDITOR_TABLE_TEMPLATE,
    EDITOR_TOOL_IDS,
} from '@/utils/constants/paperDocToolsConfig';

// Every function here returns a patch instead of a whole new document value
// A patch is { start, end, text, selectionStart, selectionEnd } and describes the
// smallest possible edit, which lets the editor apply it without losing native undo

// Index of the first character on the line that contains the given position
const getLineStart = (value, index) => (
    index <= 0 ? 0 : value.lastIndexOf('\n', index - 1) + 1
);

// Index of the last character on the line that contains the given position
const getLineEnd = (value, index) => {
    const next = value.indexOf('\n', index);
    return next === -1 ? value.length : next;
};

// Rewrites every selected line with the prefix, or strips it when all lines already have it
const toggleLinePrefix = (value, selectionStart, selectionEnd, buildPrefix, matcher) => {
    const start = getLineStart(value, selectionStart);
    const end = getLineEnd(value, selectionEnd);
    const lines = value.slice(start, end).split('\n');

    const isPrefixed = lines.every((line) => matcher.test(line));
    const text = lines
        .map((line, index) => (
            isPrefixed ? line.replace(matcher, '') : `${buildPrefix(index)}${line}`
        ))
        .join('\n');

    return { start, end, text, selectionStart: start, selectionEnd: start + text.length };
};

// Drops a standalone block on its own line, keeping one blank line around it
const insertBlock = (value, selectionStart, selectionEnd, block, consumeSelection = false) => {
    const start = consumeSelection ? selectionStart : selectionEnd;
    const before = value.slice(0, start);
    const after = value.slice(selectionEnd);

    // Only add the separators that are not already in the document
    const leading = before.length === 0 || before.endsWith('\n\n')
        ? ''
        : before.endsWith('\n') ? '\n' : '\n\n';
    const trailing = after.startsWith('\n') ? '\n' : '\n\n';

    const text = `${leading}${block}${trailing}`;
    const caret = start + text.length;

    return { start, end: selectionEnd, text, selectionStart: caret, selectionEnd: caret };
};

// Replaces the current selection with inline text and puts the caret after it
const insertInline = (selectionStart, selectionEnd, text) => {
    const caret = selectionStart + text.length;
    return { start: selectionStart, end: selectionEnd, text, selectionStart: caret, selectionEnd: caret };
};

// Builds the patch for pressing Enter inside a list item, or null when the caret is not in one
export const getListContinuation = (value, caret) => {
    const start = getLineStart(value, caret);
    const line = value.slice(start, caret);
    const match = line.match(/^(\s*)([-*]|(\d+)\.)\s+(.*)$/);

    if (!match) return null;

    const [, indent, marker, number, body] = match;

    // Pressing Enter on an empty item ends the list instead of adding another bullet
    if (!body.trim()) {
        return { start, end: caret, text: '', selectionStart: start, selectionEnd: start };
    }

    const nextMarker = number ? `${Number(number) + 1}.` : marker;
    const text = `\n${indent}${nextMarker} `;
    const nextCaret = caret + text.length;

    return { start: caret, end: caret, text, selectionStart: nextCaret, selectionEnd: nextCaret };
};

// Turns a toolbar click into a patch, or null when the tool cannot be applied
export const applyEditorTool = (toolId, {
    value = '',
    selectionStart = 0,
    selectionEnd = 0,
    input = '',
} = {}) => {
    const selected = value.slice(selectionStart, selectionEnd);

    switch (toolId) {
        case EDITOR_TOOL_IDS.HEADING:
            return toggleLinePrefix(value, selectionStart, selectionEnd, () => '## ', /^#{1,6}\s/);

        case EDITOR_TOOL_IDS.BULLET_LIST:
            return toggleLinePrefix(value, selectionStart, selectionEnd, () => '- ', /^[-*]\s/);

        case EDITOR_TOOL_IDS.NUMBERED_LIST:
            return toggleLinePrefix(
                value,
                selectionStart,
                selectionEnd,
                (index) => `${index + 1}. `,
                /^\d+\.\s/,
            );

        case EDITOR_TOOL_IDS.DIVIDER:
            return insertBlock(value, selectionStart, selectionEnd, '---');

        case EDITOR_TOOL_IDS.TABLE:
            return insertBlock(value, selectionStart, selectionEnd, EDITOR_TABLE_TEMPLATE);

        // The selected text becomes the body of the fenced block
        case EDITOR_TOOL_IDS.CODE:
            return insertBlock(
                value,
                selectionStart,
                selectionEnd,
                `\`\`\`\n${selected || 'code here'}\n\`\`\``,
                true,
            );

        case EDITOR_TOOL_IDS.IMAGE:
            if (!input) return null;
            return insertInline(selectionStart, selectionEnd, `![${selected || 'image'}](${input})`);

        case EDITOR_TOOL_IDS.VIDEO:
            if (!input) return null;
            return insertInline(selectionStart, selectionEnd, `[${selected || 'watch video'}](${input})`);

        case EDITOR_TOOL_IDS.LINK:
            if (!input) return null;
            return insertInline(selectionStart, selectionEnd, `[${selected || 'link'}](${input})`);

        default:
            return null;
    }
};