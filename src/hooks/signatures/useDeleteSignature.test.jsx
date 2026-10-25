
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { api } from '@/lib/fetchWithAuth';
import useSignaturesStore from '@/store/features/signatures/signaturesStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { showConfirmDialog } from '@/lib/sweetAlert';
import useDeleteSignature from './useDeleteSignature';

vi.mock('@/lib/fetchWithAuth', () => ({
    api: {
        delete: vi.fn(),
    },
}));

vi.mock('@/lib/toast', () => ({
    showSuccessToast: vi.fn(),
    showErrorToast: vi.fn(),
}));

vi.mock('@/lib/sweetAlert', () => ({
    showConfirmDialog: vi.fn(),
}));

describe('useDeleteSignature', () => {
    beforeEach(() => {
        api.delete.mockReset();
        showSuccessToast.mockReset();
        showErrorToast.mockReset();
        showConfirmDialog.mockReset();

        useSignaturesStore.setState({
            signatures: [
                { _id: 'signature-1', name: 'Test signature' },
            ],
        });
    });

    it('does not show an error toast when the session expires', async () => {
        showConfirmDialog.mockResolvedValue(true);
        api.delete.mockRejectedValue(new Error('Session expired'));

        const { result } = renderHook(() => useDeleteSignature());

        let response;

        await act(async () => {
            response = await result.current.deleteSignature('signature-1');
        });

        expect(response).toEqual({ success: false });
        expect(showErrorToast).not.toHaveBeenCalled();
        expect(showSuccessToast).not.toHaveBeenCalled();
        expect(result.current.isDeleting).toBe(false);
        expect(useSignaturesStore.getState().signatures).toHaveLength(1);
    });

    it('removes the signature and shows success toast after successful deletion', async () => {
        showConfirmDialog.mockResolvedValue(true);
        api.delete.mockResolvedValue({ ok: true });

        const { result } = renderHook(() => useDeleteSignature());

        let response;

        await act(async () => {
            response = await result.current.deleteSignature('signature-1');
        });

        expect(response).toEqual({ success: true });
        expect(useSignaturesStore.getState().signatures).toHaveLength(0);
        expect(showSuccessToast).toHaveBeenCalledWith(
            'Signature deleted successfully',
        );
        expect(showErrorToast).not.toHaveBeenCalled();
        expect(result.current.isDeleting).toBe(false);
    });
});
