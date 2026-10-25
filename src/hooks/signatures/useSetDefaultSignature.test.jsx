
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { api } from '@/lib/fetchWithAuth';
import useSignaturesStore from '@/store/features/signatures/signaturesStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import useSetDefaultSignature from './useSetDefaultSignature';

vi.mock('@/lib/fetchWithAuth', () => ({
    api: {
        patch: vi.fn(),
    },
}));

vi.mock('@/lib/toast', () => ({
    showSuccessToast: vi.fn(),
    showErrorToast: vi.fn(),
}));

describe('useSetDefaultSignature', () => {
    beforeEach(() => {
        api.patch.mockReset();
        showSuccessToast.mockReset();
        showErrorToast.mockReset();

        useSignaturesStore.setState({
            signatures: [
                { _id: 'signature-1', name: 'Signature 1', isDefault: true },
                { _id: 'signature-2', name: 'Signature 2', isDefault: false },
            ],
        });
    });

    it('does not show an error toast when the session expires', async () => {
        api.patch.mockRejectedValue(new Error('Session expired'));

        const { result } = renderHook(() => useSetDefaultSignature());

        let response;

        await act(async () => {
            response = await result.current.setDefault('signature-2');
        });

        expect(response).toEqual({ success: false });
        expect(showErrorToast).not.toHaveBeenCalled();
        expect(showSuccessToast).not.toHaveBeenCalled();
        expect(result.current.isUpdating).toBe(false);

        const signatures = useSignaturesStore.getState().signatures;
        expect(signatures.find((item) => item._id === 'signature-1').isDefault).toBe(true);
        expect(signatures.find((item) => item._id === 'signature-2').isDefault).toBe(false);
    });

    it('updates the default signature and shows success toast', async () => {
        api.patch.mockResolvedValue({ ok: true });

        const { result } = renderHook(() => useSetDefaultSignature());

        let response;

        await act(async () => {
            response = await result.current.setDefault('signature-2');
        });

        expect(response).toEqual({ success: true });
        expect(api.patch).toHaveBeenCalledWith('/api/signatures/signature-2', {
            isDefault: true,
        });

        const signatures = useSignaturesStore.getState().signatures;
        expect(signatures.find((item) => item._id === 'signature-1').isDefault).toBe(false);
        expect(signatures.find((item) => item._id === 'signature-2').isDefault).toBe(true);

        expect(showSuccessToast).toHaveBeenCalledWith('Default signature updated');
        expect(showErrorToast).not.toHaveBeenCalled();
        expect(result.current.isUpdating).toBe(false);
    });
});
