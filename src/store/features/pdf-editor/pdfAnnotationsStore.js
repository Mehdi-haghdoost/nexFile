import { create } from "zustand";

const usePdfAnnotationsStore = create((set, get) => ({
    annotationsByPage: {},
    textBoxesByPage: {},
    history: [],
    redoStack: [],

    addStroke: (pageNumber, stroke) => {
        set((state) => ({
            annotationsByPage: {
                ...state.annotationsByPage,
                [pageNumber]: [...(state.annotationsByPage[pageNumber] || []), stroke],
            },
            history: [...state.history, { kind: "stroke", type: "add", pageNumber, item: stroke }],
            redoStack: [],
        }));
    },

    removeStroke: (pageNumber, strokeId) => {
        const state = get();
        const pageStrokes = state.annotationsByPage[pageNumber] || [];
        const stroke = pageStrokes.find((s) => s.id === strokeId);
        if (!stroke) return;

        set({
            annotationsByPage: {
                ...state.annotationsByPage,
                [pageNumber]: pageStrokes.filter((s) => s.id !== strokeId),
            },
            history: [...state.history, { kind: "stroke", type: "remove", pageNumber, item: stroke }],
            redoStack: [],
        });
    },

    addTextBox: (pageNumber, textBox) => {
        set((state) => ({
            textBoxesByPage: {
                ...state.textBoxesByPage,
                [pageNumber]: [...(state.textBoxesByPage[pageNumber] || []), textBox],
            },
            history: [...state.history, { kind: "text", type: "add", pageNumber, item: textBox }],
            redoStack: [],
        }));
    },

    updateTextBoxContent: (pageNumber, textBoxId, content) => {
        set((state) => ({
            textBoxesByPage: {
                ...state.textBoxesByPage,
                [pageNumber]: (state.textBoxesByPage[pageNumber] || []).map((box) =>
                    box.id === textBoxId ? { ...box, content } : box
                ),
            },
        }));
    },

    // Used when a box is focused but has no live selection: a color/size
    // change then applies to the box's own base style instead of a sub-run.
    updateTextBoxStyle: (pageNumber, textBoxId, patch) => {
        set((state) => ({
            textBoxesByPage: {
                ...state.textBoxesByPage,
                [pageNumber]: (state.textBoxesByPage[pageNumber] || []).map((box) =>
                    box.id === textBoxId ? { ...box, ...patch } : box
                ),
            },
        }));
    },

    moveTextBox: (pageNumber, textBoxId, x, y) => {
        set((state) => ({
            textBoxesByPage: {
                ...state.textBoxesByPage,
                [pageNumber]: (state.textBoxesByPage[pageNumber] || []).map((box) =>
                    box.id === textBoxId ? { ...box, x, y } : box
                ),
            },
        }));
    },

    removeTextBox: (pageNumber, textBoxId) => {
        const state = get();
        const pageBoxes = state.textBoxesByPage[pageNumber] || [];
        const textBox = pageBoxes.find((b) => b.id === textBoxId);
        if (!textBox) return;

        set({
            textBoxesByPage: {
                ...state.textBoxesByPage,
                [pageNumber]: pageBoxes.filter((b) => b.id !== textBoxId),
            },
            history: [...state.history, { kind: "text", type: "remove", pageNumber, item: textBox }],
            redoStack: [],
        });
    },

    undo: () => {
        const state = get();
        const last = state.history[state.history.length - 1];
        if (!last) return;

        const collectionKey = last.kind === "text" ? "textBoxesByPage" : "annotationsByPage";
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

        const collectionKey = next.kind === "text" ? "textBoxesByPage" : "annotationsByPage";
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

    resetAnnotations: () =>
        set({ annotationsByPage: {}, textBoxesByPage: {}, history: [], redoStack: [] }),
}));

export default usePdfAnnotationsStore;