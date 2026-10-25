
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { api } from '@/lib/fetchWithAuth';
import useSignaturesStore from '@/store/features/signatures/signaturesStore';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import useCreateSignature from './useCreateSignature';

vi.mock('@/lib/fetchWithAuth', () => ({
    api: {
        post: vi.fn(),
    },
}));

vi.mock('@/lib/toast', () => ({
    showSuccessToast: vi.fn(),
    showErrorToast: vi.fn(),
}));

describe('useCreateSignature', () => {
    beforeEach(() => {
        api.post.mockReset();
        showSuccessToast.mockReset();
        showErrorToast.mockReset();

        useSignaturesStore.setState({
            signatures: [],
        });
    });

    it('does not show an error toast when the session expires', async () => {
        api.post.mockRejectedValue(new Error('Session expired'));

        const { result } = renderHook(() => useCreateSignature());

        let response;

        await act(async () => {
            response = await result.current.createSignature({
                name: 'Test signature',
                type: 'draw',
                data: 'test-data',
            });
        });

        expect(response).toEqual({ success: false });
        expect(showErrorToast).not.toHaveBeenCalled();
        expect(showSuccessToast).not.toHaveBeenCalled();
        expect(result.current.isCreating).toBe(false);
    });

    it('adds the created signature and shows success toast', async () => {
        const signature = {
            _id: 'signature-test-1',
            name: 'Test signature',
            type: 'draw',
        };

        api.post.mockResolvedValue({
            ok: true,
            json: async () => ({ signature }),
        });

        const { result } = renderHook(() => useCreateSignature());

        await act(async () => {
            const response = await result.current.createSignature({
                name: 'Test signature',
                type: 'draw',
                data: 'test-data',
            });

            expect(response).toEqual({ success: true, signature });
        });

        expect(useSignaturesStore.getState().signatures).toContainEqual(signature);
        expect(showSuccessToast).toHaveBeenCalledWith(
            'Signature created successfully',
        );
        expect(showErrorToast).not.toHaveBeenCalled();
        expect(result.current.isCreating).toBe(false);
    });
});
