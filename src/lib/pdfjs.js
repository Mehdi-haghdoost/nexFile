'use client';

/**
 * pdf.js touches browser globals as soon as it is evaluated, so it is imported
 * lazily instead of at module scope. A static import would run during Next's
 * server render of any client component that pulls this file in.
 */
let pdfjsPromise = null;

const getPdfjs = () => {
    if (!pdfjsPromise) {
        pdfjsPromise = import('pdfjs-dist').then((pdfjs) => {
            // Resolved at build time so the worker ships as a real asset.
            pdfjs.GlobalWorkerOptions.workerSrc = new URL(
                'pdfjs-dist/build/pdf.worker.min.mjs',
                import.meta.url
            ).toString();
            return pdfjs;
        });
    }

    return pdfjsPromise;
};

// Note: pdf.js takes ownership of the buffer and detaches it, so the caller
// must not reuse it afterwards.
export const loadPdfDocument = async (arrayBuffer) => {
    const pdfjs = await getPdfjs();
    return pdfjs.getDocument({ data: arrayBuffer }).promise;
};