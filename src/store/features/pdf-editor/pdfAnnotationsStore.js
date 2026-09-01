import { create } from "zustand";

const collectionKeyFor = (kind) => {
    if (kind === "text") return "textBoxesByPage";
    if (kind === "signature") return "signatureBoxesByPage";
    return "annotationsByPage";
};

// One 90-degree step, matches the same math the export pipeline reverses.
const rotatePointCW = (p) => ({ x: 1 - p.y, y: p.x });
const rotatePointCCW = (p) => ({ x: p.y, y: 1 - p.x });

const usePdfAnnotationsStore = create((set, get) => ({
    annotationsByPage: {},
    textBoxesByPage: {},
    signatureBoxesByPage: {},
    history: [],
    redoStack: [],
    // Sticky once true: undoing an edit still counts as "has been edited
    // this session" until an explicit save resets it.
    hasContentChanges: false,

    addStroke: (pageId, stroke) => {
        set((state) => ({
            annotationsByPage: {
                ...state.annotationsByPage,
                [pageId]: [...(state.annotationsByPage[pageId] || []), stroke],
            },
            history: [...state.history, { kind: "stroke", type: "add", pageNumber: pageId, item: stroke }],
            redoStack: [],
            hasContentChanges: true,
        }));
    },

    removeStroke: (pageId, strokeId) => {
        const state = get();
        const pageStrokes = state.annotationsByPage[pageId] || [];
        const stroke = pageStrokes.find((s) => s.id === strokeId);
        if (!stroke) return;

        set({
            annotationsByPage: {
                ...state.annotationsByPage,
                [pageId]: pageStrokes.filter((s) => s.id !== strokeId),
            },
            history: [...state.history, { kind: "stroke", type: "remove", pageNumber: pageId, item: stroke }],
            redoStack: [],
            hasContentChanges: true,
        });
    },

    addTextBox: (pageId, textBox) => {
        set((state) => ({
            textBoxesByPage: {
                ...state.textBoxesByPage,
                [pageId]: [...(state.textBoxesByPage[pageId] || []), textBox],
            },
            history: [...state.history, { kind: "text", type: "add", pageNumber: pageId, item: textBox }],
            redoStack: [],
            hasContentChanges: true,
        }));
    },

    updateTextBoxContent: (pageId, textBoxId, content) => {
        set((state) => ({
            textBoxesByPage: {
                ...state.textBoxesByPage,
                [pageId]: (state.textBoxesByPage[pageId] || []).map((box) =>
                    box.id === textBoxId ? { ...box, content } : box
                ),
            },
            hasContentChanges: true,
        }));
    },

    updateTextBoxStyle: (pageId, textBoxId, patch) => {
        set((state) => ({
            textBoxesByPage: {
                ...state.textBoxesByPage,
                [pageId]: (state.textBoxesByPage[pageId] || []).map((box) =>
                    box.id === textBoxId ? { ...box, ...patch } : box
                ),
            },
            hasContentChanges: true,
        }));
    },

    moveTextBox: (pageId, textBoxId, x, y) => {
        set((state) => ({
            textBoxesByPage: {
                ...state.textBoxesByPage,
                [pageId]: (state.textBoxesByPage[pageId] || []).map((box) =>
                    box.id === textBoxId ? { ...box, x, y } : box
                ),
            },
            hasContentChanges: true,
        }));
    },

    removeTextBox: (pageId, textBoxId) => {
        const state = get();
        const pageBoxes = state.textBoxesByPage[pageId] || [];
        const textBox = pageBoxes.find((b) => b.id === textBoxId);
        if (!textBox) return;

        set({
            textBoxesByPage: {
                ...state.textBoxesByPage,
                [pageId]: pageBoxes.filter((b) => b.id !== textBoxId),
            },
            history: [...state.history, { kind: "text", type: "remove", pageNumber: pageId, item: textBox }],
            redoStack: [],
            hasContentChanges: true,
        });
    },

    addSignatureBox: (pageId, signatureBox) => {
        set((state) => ({
            signatureBoxesByPage: {
                ...state.signatureBoxesByPage,
                [pageId]: [...(state.signatureBoxesByPage[pageId] || []), signatureBox],
            },
            history: [...state.history, { kind: "signature", type: "add", pageNumber: pageId, item: signatureBox }],
            redoStack: [],
            hasContentChanges: true,
        }));
    },

    moveSignatureBox: (pageId, signatureBoxId, x, y) => {
        set((state) => ({
            signatureBoxesByPage: {
                ...state.signatureBoxesByPage,
                [pageId]: (state.signatureBoxesByPage[pageId] || []).map((box) =>
                    box.id === signatureBoxId ? { ...box, x, y } : box
                ),
            },
            hasContentChanges: true,
        }));
    },

    resizeSignatureBox: (pageId, signatureBoxId, width, height) => {
        set((state) => ({
            signatureBoxesByPage: {
                ...state.signatureBoxesByPage,
                [pageId]: (state.signatureBoxesByPage[pageId] || []).map((box) =>
                    box.id === signatureBoxId ? { ...box, width, height } : box
                ),
            },
            hasContentChanges: true,
        }));
    },

    removeSignatureBox: (pageId, signatureBoxId) => {
        const state = get();
        const pageBoxes = state.signatureBoxesByPage[pageId] || [];
        const signatureBox = pageBoxes.find((b) => b.id === signatureBoxId);
        if (!signatureBox) return;

        set({
            signatureBoxesByPage: {
                ...state.signatureBoxesByPage,
                [pageId]: pageBoxes.filter((b) => b.id !== signatureBoxId),
            },
            history: [...state.history, { kind: "signature", type: "remove", pageNumber: pageId, item: signatureBox }],
            redoStack: [],
            hasContentChanges: true,
        });
    },

    rotatePageAnnotations: (pageId, direction) => {
        const state = get();
        const rotatePoint = direction === "cw" ? rotatePointCW : rotatePointCCW;

        // Strokes: rotate every stored point.
        const strokes = (state.annotationsByPage[pageId] || []).map((stroke) => ({
            ...stroke,
            points: stroke.points.map(rotatePoint),
        }));

        // Text boxes: only the anchor rotates, width/height stay as-is
        // since the box re-wraps to its own content anyway.
        const textBoxes = (state.textBoxesByPage[pageId] || []).map((box) => {
            const { x, y } = rotatePoint({ x: box.x, y: box.y });
            return { ...box, x, y };
        });

        // Signature boxes: rotate the full rectangle since width/height are explicit.
        const signatureBoxes = (state.signatureBoxesByPage[pageId] || []).map((box) => {
            if (direction === "cw") {
                return {
                    ...box,
                    x: 1 - box.y - box.height,
                    y: box.x,
                    width: box.height,
                    height: box.width,
                };
            }
            return {
                ...box,
                x: box.y,
                y: 1 - box.x - box.width,
                width: box.height,
                height: box.width,
            };
        });

        set({
            annotationsByPage: { ...state.annotationsByPage, [pageId]: strokes },
            textBoxesByPage: { ...state.textBoxesByPage, [pageId]: textBoxes },
            signatureBoxesByPage: { ...state.signatureBoxesByPage, [pageId]: signatureBoxes },
        });
    },

    // No history entry -- a deleted page has nothing sensible to undo back to.
    clearPageAnnotations: (pageId) => {
        const state = get();
        const { [pageId]: _removedStrokes, ...restAnnotations } = state.annotationsByPage;
        const { [pageId]: _removedText, ...restTextBoxes } = state.textBoxesByPage;
        const { [pageId]: _removedSignatures, ...restSignatures } = state.signatureBoxesByPage;

        set({
            annotationsByPage: restAnnotations,
            textBoxesByPage: restTextBoxes,
            signatureBoxesByPage: restSignatures,
        });
    },

    undo: () => {
        const state = get();
        const last = state.history[state.history.length - 1];
        if (!last) return;

        const collectionKey = collectionKeyFor(last.kind);
        const pageItems = state[collectionKey][last.pageNumber] || [];

        const nextPageItems =
            last.type === "add"
                ? pageItems.filter((i) => i.id !== last.item.id)
                : [...pageItems, last.item];

        set({
            [collectionKey]: { ...state[collectionKey], [last.pageNumber]: nextPageItems },
            history: state.history.slice(0, -1),
            redoStack: [...state.redoStack, last],
        });
    },

    redo: () => {
        const state = get();
        const next = state.redoStack[state.redoStack.length - 1];
        if (!next) return;

        const collectionKey = collectionKeyFor(next.kind);
        const pageItems = state[collectionKey][next.pageNumber] || [];

        const nextPageItems =
            next.type === "add"
                ? [...pageItems, next.item]
                : pageItems.filter((i) => i.id !== next.item.id);

        set({
            [collectionKey]: { ...state[collectionKey], [next.pageNumber]: nextPageItems },
            history: [...state.history, next],
            redoStack: state.redoStack.slice(0, -1),
        });
    },

    // Called after a successful save, so a fresh edit is what re-dirties the session.
    markAnnotationsSaved: () => set({ hasContentChanges: false }),

    resetAnnotations: () =>
        set({
            annotationsByPage: {},
            textBoxesByPage: {},
            signatureBoxesByPage: {},
            history: [],
            redoStack: [],
            hasContentChanges: false,
        }),
}));

export default usePdfAnnotationsStore;