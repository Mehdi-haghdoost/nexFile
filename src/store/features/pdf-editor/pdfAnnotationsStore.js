// import { create } from "zustand";

// /**
//  * Undo/redo is a single document-wide history, not per page: drawing on
//  * page 1 then page 2 and hitting undo removes the page 2 stroke first. Each
//  * history entry stores the full stroke object, so an erase can be undone by
//  * simply reinserting it.
//  */
// const usePdfAnnotationsStore = create((set, get) => ({
//     annotationsByPage: {},
//     history: [],
//     redoStack: [],

//     addStroke: (pageNumber, stroke) => {
//         set((state) => ({
//             annotationsByPage: {
//                 ...state.annotationsByPage,
//                 [pageNumber]: [...(state.annotationsByPage[pageNumber] || []), stroke],
//             },
//             history: [...state.history, { type: "add", pageNumber, stroke }],
//             redoStack: [],
//         }));
//     },

//     removeStroke: (pageNumber, strokeId) => {
//         const state = get();
//         const pageStrokes = state.annotationsByPage[pageNumber] || [];
//         const stroke = pageStrokes.find((s) => s.id === strokeId);
//         if (!stroke) return;

//         set({
//             annotationsByPage: {
//                 ...state.annotationsByPage,
//                 [pageNumber]: pageStrokes.filter((s) => s.id !== strokeId),
//             },
//             history: [...state.history, { type: "remove", pageNumber, stroke }],
//             redoStack: [],
//         });
//     },

//     undo: () => {
//         const state = get();
//         const last = state.history[state.history.length - 1];
//         if (!last) return;

//         const pageStrokes = state.annotationsByPage[last.pageNumber] || [];
//         const nextPageStrokes =
//             last.type === "add"
//                 ? pageStrokes.filter((s) => s.id !== last.stroke.id)
//                 : [...pageStrokes, last.stroke];

//         set({
//             annotationsByPage: { ...state.annotationsByPage, [last.pageNumber]: nextPageStrokes },
//             history: state.history.slice(0, -1),
//             redoStack: [...state.redoStack, last],
//         });
//     },

//     redo: () => {
//         const state = get();
//         const next = state.redoStack[state.redoStack.length - 1];
//         if (!next) return;

//         const pageStrokes = state.annotationsByPage[next.pageNumber] || [];
//         const nextPageStrokes =
//             next.type === "add"
//                 ? [...pageStrokes, next.stroke]
//                 : pageStrokes.filter((s) => s.id !== next.stroke.id);

//         set({
//             annotationsByPage: { ...state.annotationsByPage, [next.pageNumber]: nextPageStrokes },
//             history: [...state.history, next],
//             redoStack: state.redoStack.slice(0, -1),
//         });
//     },

//     resetAnnotations: () => set({ annotationsByPage: {}, history: [], redoStack: [] }),
// }));

// export default usePdfAnnotationsStore;

import { create } from "zustand";

/**
 * Undo/redo is a single document-wide history covering both strokes and
 * text boxes, not per page and not per item kind: drawing on page 1, adding
 * text on page 2, then hitting undo removes the page 2 text box first. Each
 * history entry stores the full item, so a removal can be undone by simply
 * reinserting it.
 */
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

    // Typing into a box is not a history step on its own -- the browser's
    // native undo already handles keystroke-level undo inside the textarea.
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