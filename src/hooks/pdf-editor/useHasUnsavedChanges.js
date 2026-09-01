import usePdfAnnotationsStore from '@/store/features/pdf-editor/pdfAnnotationsStore';
import usePdfPagesStore from '@/store/features/pdf-editor/pdfPagesStore';

// True when any edit hasn't been saved yet
export const useHasUnsavedChanges = () => {
    const hasContentChanges = usePdfAnnotationsStore((state) => state.hasContentChanges);
    const hasStructuralChanges = usePdfPagesStore((state) => state.hasStructuralChanges);
    return hasContentChanges || hasStructuralChanges;
};