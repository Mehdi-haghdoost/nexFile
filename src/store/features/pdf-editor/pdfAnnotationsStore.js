import { create } from "zustand";

/**
 * Undo/redo is a single document-wide history, not per page: drawing on
 * page 1 then page 2 and hitting undo removes the page 2 stroke first. Each
 * history entry stores the full stroke object, so an erase can be undone by
 * simply reinserting it.
 */
const usePdfAnnotationsStore = create((set, get) => ({
    annotationsByPage: {},
    history: [],
    redoStack: [],

    addStroke: (pageNumber, stroke) => {
        set((state) => ({
            annotationsByPage: {
                ...state.annotationsByPage,
                [pageNumber]: [...(state.annotationsByPage[pageNumber] || []), stroke],
            },
            history: [...state.history, { type: "add", pageNumber, stroke }],
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
            history: [...state.history, { type: "remove", pageNumber, stroke }],
            redoStack: [],
        });
    },

    undo: () => {
        const state = get();
        const last = state.history[state.history.length - 1];
        if (!last) return;

        const pageStrokes = state.annotationsByPage[last.pageNumber] || [];
        const nextPageStrokes =
            last.type === "add"
                ? pageStrokes.filter((s) => s.id !== last.stroke.id)
                : [...pageStrokes, last.stroke];

        set({
            annotationsByPage: { ...state.annotationsByPage, [last.pageNumber]: nextPageStrokes },
            history: state.history.slice(0, -1),
            redoStack: [...state.redoStack, last],
        });
    },

    redo: () => {
        const state = get();
        const next = state.redoStack[state.redoStack.length - 1];
        if (!next) return;

        const pageStrokes = state.annotationsByPage[next.pageNumber] || [];
        const nextPageStrokes =
            next.type === "add"
                ? [...pageStrokes, next.stroke]
                : pageStrokes.filter((s) => s.id !== next.stroke.id);

        set({
            annotationsByPage: { ...state.annotationsByPage, [next.pageNumber]: nextPageStrokes },
            history: [...state.history, next],
            redoStack: state.redoStack.slice(0, -1),
        });
    },

    resetAnnotations: () => set({ annotationsByPage: {}, history: [], redoStack: [] }),
}));

export default usePdfAnnotationsStore;